import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../LoadingTransaction";
import { addSupporter } from "../../services/supporterService";
import { api } from "../../services/api";
import { ModalTransactionCreated } from "../ModalTransactionCreated";
import { ActivityIndicator } from "../ActivityIndicator";
import { Info } from "../Info";
import { useMainContext } from "../../hooks/useMainContext";
import { WebcamCapture } from "./components/WebCam";
import { storage } from "../../services/firebase";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { save } from "../../config/infura";

export function ModalSignOut({ close }) {
    const { walletConnected, Sync, loginWithWalletAndPassword, getUserDataApi, logout } = useMainContext();
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
        if (step === 1 && !wallet.trim()) {
            toast.error('Digite uma wallet!');
            return;
        }
        if (step === 2 && userType === 0) {
            toast.error('Selecione um tipo de usuário!');
            return;
        }

        if (step === 2 && userType === 7) {
            setStep(4);
            return;
        }

        if (step === 3 && !proofPhoto64) {
            toast.error('A foto é obrigatória!')
            return
        }

        if (step === 4) {
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
        if (step === 4 && userType === 7) {
            setStep(2);
            return;
        }
        setStep(step - 1);
    }

    async function handleRegister() {
        if(userType === 7){
            if (window.ethereum) {
                registerSupporterBlockchain();
            } else {
                registerSupporterOnCheckout();
            }
        }else{
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
                        await api.post('/publication/new', {
                            userId: response.data.user.id,
                            type: 'new-user',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData: response.data.user,
                                hash: res.hashTransaction
                            }),
                        });
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

    async function handleSyncWallet() {
        if (loading) {
            return;
        }

        if (!window.ethereum) {
            toast.error('Você não tem um provedor ethereum em seu navegador!');
            return;
        }
        setLoading(true);

        const response = await Sync();

        setLoading(false);
    }

    async function savePhotoIpfs(){
        const res = await fetch(proofPhoto64);
        const blob = await res.blob();

        const hash = await save(blob);
        

        const storageRef = ref(storage, `/images/${hash}.png`);
        const response = await uploadBytesResumable(storageRef, blob)
        if(response.state === 'success'){
            const url = await getDownloadURL(storageRef);
            createImageDB(url, hash)
            return hash;
        }else{
            return false;
        }
    }

    function createImageDB(url, hash){
        try{
            api.post('/image', {
                url,
                hash
            })
        }catch(err){
            console.log(err)
        }
    }

    async function registerOnApi(){
        setLoading(true);
        
        const hashProofPhoto = await savePhotoIpfs();

        if(!hashProofPhoto){
            toast.error('Erro ao carregar imagem de prova, tente novamente!');
            setLoading(false);
            return;
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
            toast.success('Cadastro realizado com sucesso!');
            getUserDataApi();
            setTimeout(() => close(), 1000);
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
            <div className='absolute flex flex-col p-3 lg:w-[400px] h-[400px] justify-between bg-[#0a4303] rounded-md m-auto inset-0 border-2 z-20'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-[25px]" />

                    <p className="font-semibold text-white">Cadastro</p>

                    <button onClick={close}>
                        <MdClose size={25} color='white' />
                    </button>
                </div>

                <div className="flex flex-col">
                    {step === 1 && (
                        <>
                            <p className="font-semibold text-white text-center">Vamos lá, primeiro você precisa ter uma carteira criada no metamask</p>
                            <a
                                target="_blank"
                                href="https://docs.sintrop.com/suporte/guia-de-utilizacao-do-metamask/tutorial-em-video-do-metamask"
                                className="text-center text-blue-500 underline"
                            >
                                Veja aqui como criar
                            </a>

                            {!window.ethereum && (
                                <div className="flex flex-col w-full mt-3">
                                    <label className="font-semibold text-sm text-blue-500">Wallet:</label>
                                    <input
                                        placeholder="Digite aqui sua wallet"
                                        className="rounded-md p-2 bg-green-950 text-white"
                                        value={wallet}
                                        onChange={(e) => setWallet(e.target.value)}
                                    />
                                </div>
                            )}


                            {window.ethereum && (
                                <>
                                    <p className="font-semibold text-white text-center mt-5">{walletConnected}</p>

                                    {walletConnected === '' ? (
                                        <button
                                            className="font-bold text-white px-5 py-2 rounded-md bg-green-500 mt-1"
                                            onClick={handleSyncWallet}
                                        >
                                            {loading ? (
                                                <ActivityIndicator
                                                    size={25}
                                                />
                                            ) : 'Sincronize sua wallet'}
                                        </button>
                                    ) : (
                                        <button
                                            className="font-bold text-white px-5 py-2 underline mt-1"
                                            onClick={logout}
                                        >
                                            Desconectar wallet
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="font-semibold text-white text-center">Agora escolha o tipo de usuário que deseja se cadastrar</p>

                            <div className="flex flex-wrap justify-center my-3 gap-5">
                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 7 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(7)}
                                >
                                    <img
                                        src={require('../../assets/icon-apoiador.png')}
                                        className="w-6 h-6 object-contain"
                                    />
                                    Apoiador
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 3 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(3)}
                                >
                                    <img
                                        src={require('../../assets/icon-pesquisadores.png')}
                                        className="w-6 h-6 object-contain"
                                    />
                                    Pesquisador
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 2 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(2)}
                                >
                                    <img
                                        src={require('../../assets/icon-inspetor.png')}
                                        className="w-6 h-6 object-contain"
                                    />
                                    Inspetor
                                </button>

                                <button
                                    className={`flex items-center gap-1 rounded-md border-2 p-2 w-fit text-white font-semibold ${userType === 6 ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => setUserType(6)}
                                >
                                    <img
                                        src={require('../../assets/icon-ativista.png')}
                                        className="w-6 h-6 object-contain"
                                    />
                                    Ativista
                                </button>
                            </div>

                            <Info
                                text1='Para se cadastrar como outros usuários, baixe nosso aplicativo móvel!'
                            />
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="font-semibold text-white text-center">Precisamos de uma foto sua, essa será seua foto de prova no sistema</p>

                            {proofPhoto64 ? (
                                <div className="flex flex-col items-center mt-5">
                                    <img
                                        src={proofPhoto64}
                                        className="w-[180px] h-[160px] object-cover rounded-md"
                                    />

                                    <button
                                        className="text-white underline"
                                        onClick={() => setProofPhoto64(null)}
                                    >Tirar outra</button>
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

                    {step === 4 && (
                        <>
                            <p className="font-semibold text-white text-center">Agora precisamos de alguns dados seus</p>
                            <p className="text-sm text-white text-center">Preencha corretamente, não será possível alterar depois</p>

                            <div className="flex flex-col mt-3">
                                <label className="text-sm font-semibold text-blue-400">Seu nome</label>
                                <input
                                    placeholder="Digite aqui"
                                    className="rounded-md p-2 bg-green-950 text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <p className="text-sm text-gray-300 text-center mt-2">Crie uma senha para acessar nosso app. Essa senha é exclusiva para acessar nosso app mobile</p>

                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col w-[49%]">
                                        <label className="text-sm font-semibold text-blue-400">Crie uma senha</label>
                                        <input
                                            placeholder="Digite aqui"
                                            className="rounded-md p-2 bg-green-950 text-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                        />
                                    </div>

                                    <div className="flex flex-col w-[49%]">
                                        <label className="text-sm font-semibold text-blue-400">Confirme a senha</label>
                                        <input
                                            placeholder="Digite aqui"
                                            className="rounded-md p-2 bg-green-950 text-white"
                                            value={confirmPass}
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                            type="password"
                                        />
                                    </div>
                                </div>

                                {passNotMatch && (
                                    <p className="text-red-400 text-center text-sm">As senhas não estão iguais</p>
                                )}
                            </div>
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <p className="font-semibold text-white text-center">Tudo certo, vamos finalizar seu cadastro</p>

                            <button
                                className='px-2 py-1 rounded-md font-semibold text-white bg-blue-500 mt-5'
                                onClick={handleRegister}
                            >
                                {loading ? (
                                    <ActivityIndicator size={20} />
                                ) : 'Finalizar cadastro'}
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 justify-center">
                    {step > 1 && (
                        <button
                            onClick={previousStep}
                            className="text-white font-bold px-5"
                        >
                            Anterior
                        </button>
                    )}

                    {step < 5 && (
                        <button
                            onClick={nextStep}
                            className="text-white font-semibold px-5 py-1 rounded-md bg-blue-500"
                        >
                            Próximo
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
                        toast.success('Cadastro realizado com sucesso!');
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