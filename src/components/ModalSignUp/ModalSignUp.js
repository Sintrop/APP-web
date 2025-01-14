import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../LoadingTransaction";
import { addSupporter } from "../../services/web3/supporterService";
import { api } from "../../services/api";
import { ModalTransactionCreated } from "../ModalTransactionCreated";
import { ActivityIndicator } from "../ActivityIndicator/ActivityIndicator";
import { Info } from "../Info";
import { useMainContext } from "../../hooks/useMainContext";
import { WebcamCapture } from "./components/WebCam";
import { storage } from "../../services/firebase";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { save } from "../../config/infura";
import { useTranslation } from "react-i18next";

export function ModalSignUp({ close, success }) {
    const { t } = useTranslation();
    const { walletConnected, loginWithWalletAndPassword, newFlowConnectUser } = useMainContext();
    const [step, setStep] = useState(1);
    const [wallet, setWallet] = useState('');
    const [userType, setUserType] = useState(0);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loading, setLoading] = useState(false);
    const [passNotMatch, setPassNotMatch] = useState(false);
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [proofPhoto64, setProofPhoto64] = useState(null);

    useEffect(() => {
        if (confirmPass.length > 0) {
            if (password !== confirmPass) {
                setPassNotMatch(true);
            } else {
                setPassNotMatch(false);
            }
        } else {
            setPassNotMatch(false);
        }
    }, [password, confirmPass]);

    useEffect(() => {
        if (walletConnected !== '') {
            setWallet(walletConnected)
        }
    }, [walletConnected]);

    function nextStep() {
        if (step === 1 && userType === 8) {
            setStep(4);
            return;
        }
        if (step === 1 && userType === 0) {
            toast.error('Selecione um tipo de usuário!');
            return;
        }

        if (step === 1 && userType === 7) {
            setStep(3);
            return;
        }

        if (step === 2 && !proofPhoto64) {
            toast.error('A foto é obrigatória!')
            return
        }

        if (step === 3) {
            if (!name.trim() || !password.trim() || !confirmPass.trim()) {
                toast.error('Preencha todos os campos!');
                return;
            } else {
                if (passNotMatch) {
                    return
                }
            }
        }
        setStep(step + 1);
    }

    function previousStep() {
        if (step === 3 && userType === 7) {
            setStep(1);
            return;
        }
        if(step === 4 && userType === 8){
            setStep(1);
            return;
        }
        setStep(step - 1);
    }

    async function handleRegister() {
        if (userType === 7) {
            if (window.ethereum) {
                registerSupporterBlockchain();
            } else {
                registerSupporterOnCheckout();
            }
        } else {
            registerOnApi();
        }
    }

    async function registerSupporterBlockchain() {
        if (userType === 7) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addSupporter(wallet, name)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        const response = await api.post('/users', {
                            name,
                            wallet: String(wallet).toUpperCase(),
                            userType: Number(userType),
                            level: 1,
                            password,
                            accountStatus: 'blockchain'
                        });
                        newFlowConnectUser(wallet, true);
                        // await api.post('/publication/new', {
                        //     userId: response.data.user.id,
                        //     type: 'new-user',
                        //     origin: 'platform',
                        //     additionalData: JSON.stringify({
                        //         hash: res.hashTransaction
                        //     }),
                        // });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        setLoading(false)
                        setLoadingTransaction(false);
                    }
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Not allowed user")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Not allowed user',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("This supporter already exist")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'This supporter already exist',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("User already exists")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'User already exists',
                            hash: ''
                        })
                        return;
                    }
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                });
        }
    }

    async function registerSupporterOnCheckout() {
        try {
            await api.post('/users', {
                name,
                wallet: String(wallet).toUpperCase(),
                userType: Number(userType),
                level: 1,
                password,
            });

            try {
                await api.post('/transactions-open/create', {
                    wallet: String(wallet).toUpperCase(),
                    type: 'register'
                });
                setCreatedTransaction(true);
            } catch (err) {
                if (err.response?.data?.message === 'open transaction of the same type') {
                    toast.error('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
                    return;
                }
            }

        } catch (err) {
            console.log(err);
            if (err.response?.data.error === 'User already exists') {
                toast.error('Essa carteira já está cadastrada!')
                return;
            }
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
                return;
            }
            toast.error('Erro no cadastro, tente novamente!')
        } finally {
            setLoading(false);
        }
        return
    }

    async function savePhotoIpfs() {
        const res = await fetch(proofPhoto64);
        const blob = await res.blob();

        const hash = await save(blob);


        const storageRef = ref(storage, `/images/${hash}.png`);
        const response = await uploadBytesResumable(storageRef, blob)
        if (response.state === 'success') {
            const url = await getDownloadURL(storageRef);
            createImageDB(url, hash)
            return hash;
        } else {
            return false;
        }
    }

    function createImageDB(url, hash) {
        try {
            api.post('/image', {
                url,
                hash
            })
        } catch (err) {
            console.log(err)
        }
    }

    async function registerOnApi() {
        setLoading(true);

        let hashProofPhoto = '';

        if(userType < 7){
            const updateProofPhoto = await savePhotoIpfs();
            if (!updateProofPhoto) {
                toast.error('Erro ao carregar imagem de prova, tente novamente!');
                setLoading(false);
                return;
            }

            hashProofPhoto = updateProofPhoto;
        }

        try {
            await api.post('/users', {
                name,
                wallet: String(wallet).toUpperCase(),
                userType: Number(userType),
                imgProfileUrl: hashProofPhoto,
                level: 1,
                password,
            });
            //Cadastro realizado
            toast.success(t('cadidaturaSucesso'));
            newFlowConnectUser(wallet, false);
            setTimeout(() => close(), 1000);
            success();
        } catch (err) {
            console.log(err);
            if (err.response?.data.error === 'User already exists') {
                toast.error('Essa carteira já está cadastrada!')
                return;
            }
            toast.error('Erro no cadastro, tente novamente!')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-black/60 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[450px] h-[500px] justify-between bg-[#03364D] rounded-md m-auto inset-0 z-20'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-[25px]" />

                    <p className="font-semibold text-white">{t('candidatura')}</p>

                    <button onClick={close}>
                        <MdClose size={25} color='white' />
                    </button>
                </div>

                <div className="flex flex-col">
                    {step === 1 && (
                        <>
                            <p className="font-semibold text-white text-center">{t('escolhaTipoUsuario')}</p>

                            <div className="flex flex-wrap justify-center my-3 gap-5">
                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 2 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(2)}
                                >
                                    <img
                                        src={require('../../assets/icon-inspetor.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon inspetor'
                                    />
                                    {t('textInspetor')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 3 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(3)}
                                >
                                    <img
                                        src={require('../../assets/icon-pesquisadores.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon pesquisador'
                                    />
                                    {t('textPesquisador')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 4 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(4)}
                                >
                                    <img
                                        src={require('../../assets/centro-dev.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon desenvolvedor'
                                    />
                                    {t('textDesenvolvedor')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 5 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(5)}
                                >
                                    <img
                                        src={require('../../assets/icon-contribuir.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon contribuidor'
                                    />
                                    {t('textContribuidor')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 6 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(6)}
                                >
                                    <img
                                        src={require('../../assets/icon-ativista.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon ativista'
                                    />
                                    {t('textAtivista')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 7 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(7)}
                                >
                                    <img
                                        src={require('../../assets/icon-apoiador.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon apoiador'
                                    />
                                    {t('textApoiador')}
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 8 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(8)}
                                >
                                    <img
                                        src={require('../../assets/icon-validator.png')}
                                        className="w-6 h-6 object-contain"
                                        alt='icon validador'
                                    />
                                    {t('textValidador')}
                                </button>
                            </div>

                            <Info
                                text1={t('paraOutrosUsuariosNossoApp')}
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="font-semibold text-white text-center">{t('precisamosDeUmaFoto')}</p>

                            {proofPhoto64 ? (
                                <div className="flex flex-col items-center mt-5">
                                    <img
                                        src={proofPhoto64}
                                        className="w-[180px] h-[160px] object-cover rounded-md"
                                        alt='foto de prova'
                                    />

                                    <button
                                        className="text-white underline"
                                        onClick={() => setProofPhoto64(null)}
                                    >{t('tirarOutra')}</button>
                                </div>
                            ) : (
                                <WebcamCapture
                                    captured={(base64) => {
                                        setProofPhoto64(base64);
                                    }}
                                />
                            )}

                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="font-semibold text-white text-center">{t('agoraSeusDados')}</p>
                            <p className="text-sm text-white text-center">{t('preenchaCorretamente')}</p>

                            <div className="flex flex-col mt-3">
                                <label className="text-sm font-semibold text-blue-400">{t('nome')}</label>
                                <input
                                    placeholder={t('digiteAqui')}
                                    className="rounded-md p-2 bg-[#012939] text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <p className="text-sm text-gray-300 text-center mt-2">{t('senhaAcessoNossoApp')}</p>

                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col w-[49%]">
                                        <label className="text-sm font-semibold text-blue-400">{t('crieUmaSenha')}</label>
                                        <input
                                            placeholder={t('digiteAqui')}
                                            className="rounded-md p-2 bg-[#012939] text-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                        />
                                    </div>

                                    <div className="flex flex-col w-[49%]">
                                        <label className="text-sm font-semibold text-blue-400">{t('confirmeSenha')}</label>
                                        <input
                                            placeholder={t('digiteAqui')}
                                            className="rounded-md p-2 bg-[#012939] text-white"
                                            value={confirmPass}
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            type="password"
                                        />
                                    </div>
                                </div>

                                {passNotMatch && (
                                    <p className="text-red-400 text-center text-sm">{t('senhasNaoIguais')}</p>
                                )}
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <p className="font-semibold text-white text-center">
                                {userType === 7 ? (
                                    t('oTipoUsuarioApoiadorPodeEfetivarCadastro')
                                ) : (
                                    t('tudoOkFinalizarCadastro')
                                )}
                            </p>

                            <button
                                className='px-2 h-10 rounded-md font-semibold text-white bg-blue-500 mt-5'
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size={25} />
                                ) : (
                                    <>
                                        {userType === 7 ? t('efetivarCadastro') : t('finalizarCadastro')}
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 justify-center">
                    {step > 1 && (
                        <button
                            onClick={previousStep}
                            className="text-white font-bold px-5"
                            disabled={loading}
                        >
                            {t('anterior')}
                        </button>
                    )}

                    {step < 4 && (
                        <button
                            onClick={nextStep}
                            className="text-white font-semibold px-5 py-1 rounded-md bg-blue-500"
                            disabled={loading}
                        >
                            {t('proximo')}
                        </button>
                    )}
                </div>
            </div>

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => {
                        setCreatedTransaction(false);
                        close();
                    }}
                />
            )}

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        toast.success(t('cadastroSucesso'));
                        loginWithWalletAndPassword(wallet, password);
                        setTimeout(() => {
                            close();
                        }, 2000);
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    )
}