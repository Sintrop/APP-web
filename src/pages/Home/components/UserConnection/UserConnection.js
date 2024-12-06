import React, { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../../../components/ModalConnectAccount";
import { MdLogout } from "react-icons/md";
import { useMainContext } from "../../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { CheckItem } from "./components/CheckItem";
import { api } from "../../../../services/api";
import { toast } from "react-toastify";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { executeRegisterUser } from "../../../../services/registerUser";

export function UserConnection({ handleShowSignUp, showLogout, showTransactionCreated }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userData, imageProfile, blockchainData, walletConnected, getUserDataApi } = useMainContext();
    const [modalConnect, setModalConnect] = useState(false);
    const [accountStatus, setAccountStatus] = useState('pending');
    const [inviteData, setInviteData] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingEfetive, setLoadingEfetive] = useState(false);

    useEffect(() => {
        if (userData?.accountStatus !== 'blockchain') {
            if (userData?.wallet) {
                checkInvite();
            }
        }
    }, [userData]);

    async function checkInvite() {
        const response = await api.get(`/invites/${userData?.wallet}`)
        const invite = response.data.invite;

        if (invite?.invited === '0x0000000000000000000000000000000000000000') {
            setAccountStatus('pending');
        }
        if (String(invite?.invited).toLowerCase() === String(userData?.wallet).toLowerCase()) {
            setAccountStatus('guest');
            setInviteData(invite);
            if (accountStatus === 'pending') {
                api.put('/user/account-status', {
                    userWallet: userData?.wallet,
                    status: 'guest',
                })
            }
        }
    }

    async function handleEfetiveRegister() {
        setLoadingEfetive(true);
        if (window.ethereum) {
            setModalTransaction(true);
            setLoadingTransaction(true);

            const response = await executeRegisterUser(userData, walletConnected);
            if (response.success) {
                setLogTransaction({
                    type: 'success',
                    message: response.message,
                    hash: response.transactionHash,
                });
                setLoadingTransaction(false);
                return;
            }

            setLogTransaction({
                type: 'error',
                message: response.message,
                hash: response.transactionHash,
            });
            setLoadingTransaction(false);
            setLoadingEfetive(false);
            return;
        }

        try {
            await api.post('/transactions-open/create', {
                wallet: String(walletConnected).toUpperCase(),
                type: 'register'
            });
            showTransactionCreated();
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
                return;
            }
        }

        setLoadingEfetive(false);
    }

    return (
        <div className="hidden lg:flex flex-col items-center w-full p-2 bg-[#03364B] rounded-md relative">
            {walletConnected === '' ? (
                <>
                    <img
                        src={require('../../../../assets/anonimous.png')}
                        className="w-14 h-14 object-contain rounded-full border-2 border-white"
                        alt='imagem de um avatar anonimo'
                    />

                    <p className="font-bold text-white text-center text-sm mt-2">{t('voceEstaAnonimo')}</p>

                    <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                        <Dialog.Trigger
                            className="w-full p-2 bg-blue-500 rounded-md text-white font-bold mt-10 max-w-[300px]"
                        >
                            {t('conectarWallet')}
                        </Dialog.Trigger>

                        <ModalConnectAccount close={() => setModalConnect(false)} />
                    </Dialog.Root>
                </>
            ) : (
                <>
                    <div className="w-14 h-14 rounded-full bg-gray-500 cursor-pointer" onClick={() => navigate('/profile')}>
                        <img
                            src={imageProfile}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white"
                            alt='imagem de perfil'
                        />
                    </div>

                    <p className="font-bold text-white text-center text-sm mt-2 cursor-pointer hover:underline overflow-hidden text-ellipsis truncate w-[190px]" onClick={() => navigate('/profile')}>{userData?.name}</p>
                    <p className="text-gray-300 text-center text-xs">
                        {userData?.userType === 1 && t('textProdutor')}
                        {userData?.userType === 2 && t('textInspetor')}
                        {userData?.userType === 3 && t('textPesquisador')}
                        {userData?.userType === 4 && t('textDesenvolvedor')}
                        {userData?.userType === 5 && t('textContribuidor')}
                        {userData?.userType === 6 && t('textAtivista')}
                        {userData?.userType === 7 && t('textApoiador')}
                        {userData?.userType === 8 && t('textValidador')}
                    </p>
                    <p className="text-white text-center text-xs text-ellipsis overflow-hidden truncate w-[190px]">{walletConnected}</p>

                    {userData?.userType === 0 ? (
                        <div className="flex flex-col mt-5 w-full">
                            <CheckItem title='walletConectada' check />
                            <CheckItem
                                title='candidaturaEnviada'
                                type='application'
                                handleShowSignUp={handleShowSignUp}
                            />
                            <CheckItem title='conviteRecebido' />
                            <CheckItem title='efetivarCadastro' />
                        </div>
                    ) : (
                        <div className="flex flex-col mt-2 w-full items-center">
                            {userData?.accountStatus === 'blockchain' ? (
                                <>
                                    <div className="bg-activity bg-contain bg-no-repeat w-24 h-24 flex flex-col items-center justify-center">
                                        {blockchainData && (
                                            <p className={`${userData?.userType === 7 ? 'text-lg' : 'text-4xl'} font-bold text-green-500`}>
                                                {userData?.userType === 1 && parseInt(blockchainData?.producer?.isa?.isaScore)}
                                                {userData?.userType === 2 && parseInt(blockchainData?.inspector?.totalInspections)}
                                                {userData?.userType === 3 && parseInt(blockchainData?.researcher?.publishedWorks)}
                                                {userData?.userType === 4 && parseInt(blockchainData?.developer?.pool?.level)}
                                                {userData?.userType === 7 && Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(blockchainData?.tokensBurned)}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-200">
                                        {userData?.userType === 1 && t('ptsRegeneracao')}
                                        {userData?.userType === 2 && t('ispRealizadas')}
                                        {userData?.userType === 3 && t('pesqPublicadas')}
                                        {userData?.userType === 4 && t('seuNivel')}
                                        {userData?.userType === 7 && t('tokenContribuidos')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CheckItem title='walletConectada' check />
                                    <CheckItem title='candidaturaEnviada' check />
                                    <CheckItem title='conviteRecebido' type='invite' check={accountStatus === 'guest'} />
                                    <CheckItem 
                                        title='efetivarCadastro' 
                                        type='efetive-register' 
                                        handleEfetiveRegister={handleEfetiveRegister} 
                                        loadingEfetive={loadingEfetive}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    <button
                        className="absolute top-2 right-2"
                        title="Desconectar"
                        onClick={showLogout}
                    >
                        <MdLogout color='white' size={18} />
                    </button>
                </>
            )}

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    if (logTransaction.success) {
                        getUserDataApi(walletConnected);
                        toast.success(t('cadastroSucesso'));
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
        </div>
    )
}