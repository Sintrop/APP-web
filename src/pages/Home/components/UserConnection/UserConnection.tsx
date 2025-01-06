import React, { useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../../../components/ModalConnectAccount";
import { MdLogout } from "react-icons/md";
import { useMainContext } from "../../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { CheckItem } from "./components/CheckItem";
import { Jazzicon } from '@ukstv/jazzicon-react';

interface Props {
    handleShowSignUp: () => void;
    showLogout: () => void;
    showTransactionCreated: () => void;
    showModalWhereExecuteTransaction: () => void;
}
export function UserConnection({ handleShowSignUp, showLogout, showModalWhereExecuteTransaction }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    //@ts-ignore
    const { userData, imageProfile, walletConnected, accountStatus, userTypeConnected, userBlockchain } = useMainContext();
    const [modalConnect, setModalConnect] = useState(false);

    async function handleEfetiveRegister() {
        showModalWhereExecuteTransaction();
    }

    return (
        <div className="hidden lg:flex flex-col items-center w-full p-2 bg-[#03364B] rounded-md relative">
            {walletConnected === '' ? (
                <>
                    <div className="w-14 h-14 rounded-full">
                        <Jazzicon address={walletConnected} />
                    </div>

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
                        {imageProfile === '' ? (
                            <Jazzicon address={walletConnected} />
                        ) : (
                            <img
                                src={imageProfile}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                alt='imagem de perfil'
                            />
                        )}
                    </div>

                    <p className="font-bold text-white text-center text-sm mt-2 cursor-pointer hover:underline overflow-hidden text-ellipsis truncate w-[190px]" onClick={() => navigate('/profile')}>{userData?.name}</p>
                    <p className="text-gray-300 text-center text-xs">
                        {userTypeConnected === 1 && t('textProdutor')}
                        {userTypeConnected === 2 && t('textInspetor')}
                        {userTypeConnected === 3 && t('textPesquisador')}
                        {userTypeConnected === 4 && t('textDesenvolvedor')}
                        {userTypeConnected === 5 && t('textContribuidor')}
                        {userTypeConnected === 6 && t('textAtivista')}
                        {userTypeConnected === 7 && t('textApoiador')}
                        {userTypeConnected === 8 && t('textValidador')}
                    </p>
                    <p className="text-white text-center text-xs text-ellipsis overflow-hidden truncate w-[190px]">{walletConnected}</p>

                    {userTypeConnected === 0 ? (
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
                                        {userBlockchain && (
                                            <p className={`${userTypeConnected === 7 ? 'text-lg' : 'text-4xl'} font-bold text-green-500`}>
                                                {userTypeConnected === 1 && parseInt(userBlockchain?.isa?.isaScore)}
                                                {userTypeConnected === 2 && parseInt(userBlockchain?.totalInspections)}
                                                {userTypeConnected === 3 && parseInt(userBlockchain?.publishedWorks)}
                                                {userTypeConnected === 4 && parseInt(userBlockchain?.pool?.level)}
                                                {userTypeConnected === 7 && Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(userBlockchain?.tokensBurned)}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-200">
                                        {userTypeConnected === 1 && t('ptsRegeneracao')}
                                        {userTypeConnected === 2 && t('ispRealizadas')}
                                        {userTypeConnected === 3 && t('pesqPublicadas')}
                                        {userTypeConnected === 4 && t('seuNivel')}
                                        {userTypeConnected === 7 && t('tokenContribuidos')}
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
        </div>
    )
}