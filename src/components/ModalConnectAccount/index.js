import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { FaWallet, FaKey, FaChevronLeft } from "react-icons/fa";
import { ActivityIndicator } from '../ActivityIndicator';
import { useMainContext } from '../../hooks/useMainContext';
import { ModalSignOut } from '../ModalSignOut';
import { UserAccountItem } from './components/UserAccountItem';
import { useTranslation } from 'react-i18next';

export function ModalConnectAccount({ close }) {
    const {t} = useTranslation();
    const { loginWithWalletAndPassword, Sync, accountsConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [viewForm, setViewForm] = useState(false);
    const [wallet, setWallet] = useState('');
    const [password, setPassword] = useState('');
    const [modalSignOut, setModalSignOut] = useState(false);
    const [accountSelected, setAccountSelected] = useState(null);

    async function handleLogin() {
        if (loading) {
            return;
        }
        if (!wallet.trim()) {
            toast.error(t('digiteWallet'))
            return;
        }
        if (!password.trim()) {
            toast.error(t('digiteSuaSenha'))
            return;
        }

        setLoading(true);

        const response = await loginWithWalletAndPassword(wallet, password);
        setLoading(false);

        if (response) {
            toast.success(t('conectadoSucesso'));
            setTimeout(() => close(), 2000);
            setWallet('');
            setPassword('');
        }

    }

    async function handleSyncWallet() {
        if (loading) {
            return;
        }

        if (!window.ethereum) {
            toast.error(t('necessitaProvedor'));
            return;
        }
        setLoading(true);

        const response = await Sync();

        if (response?.status === 'connected') {
            toast.success(t('conectadoSucesso'));
            close();
        } else {
            close();
        }

        setLoading(false);
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0 '>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0 ' />
            <Dialog.Content className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[400px] bg-[#03364D] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-10'>

                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]' />
                    <Dialog.Title className='font-bold text-white'>{t('conectar')}</Dialog.Title>
                    <button onClick={close}>
                        <IoMdClose size={25} color='white' />
                    </button>
                </div>

                <div>
                    {viewForm ? (
                        <>
                            <h3 className='text-white text-center text-lg'>{t('digiteSuaWalletSenha')}</h3>
                            <p className='mt-5 text-xs text-gray-400'>Wallet:</p>
                            <input
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                type='text'
                                className='w-full h-10 rounded-md bg-[#012939] text-white px-2'
                                placeholder={t('digiteAqui')}
                            />

                            <p className='mt-3 text-xs text-gray-400'>{t('senha')}:</p>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                className='w-full h-10 rounded-md bg-[#012939] text-white px-2'
                                placeholder={t('digiteAqui')}
                            />


                            <button
                                className='flex h-10 items-center gap-2 p-2 rounded-md bg-blue-400 mt-2 w-full justify-center text-white'
                                onClick={handleLogin}
                            >
                                {loading ? (
                                    <ActivityIndicator size={25} />
                                ) : (
                                    t('conectar')
                                )}
                            </button>

                            <p className='text-sm text-center text-gray-400 mt-8 cursor-pointer' onClick={() => setViewForm(false)}>{t('voltar')}</p>
                        </>
                    ) : (
                        <>
                            {accountsConnected.length === 0 ? (
                                <>
                                    <button
                                        className='flex items-center gap-2 p-2 rounded-md bg-blue-400 mt-2 w-full justify-center text-white'
                                        onClick={() => setViewForm(true)}
                                    >
                                        <FaKey color='white' size={20} />

                                        {t('entrarWalletSenha')}
                                    </button>

                                    <button
                                        className='flex items-center gap-2 p-2 rounded-md bg-orange-500 mt-5 w-full justify-center text-white'
                                        onClick={handleSyncWallet}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size={25} />
                                        ) : (
                                            <>
                                                <FaWallet color='white' size={25} />

                                                {t('sincronizarWallet')}
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {accountSelected ? (
                                        <>
                                            <div className='flex items-center gap-2 w-full'>
                                                <button
                                                    className='p-2'
                                                    onClick={() => setAccountSelected(null)}
                                                >
                                                    <FaChevronLeft size={20} color='white' />
                                                </button>

                                                <div className='flex flex-col items-start'>
                                                    <p className="font-bold text-white text-sm">{accountSelected?.name}</p>
                                                    <p className="text-white text-xs">{String(accountSelected?.wallet).toLowerCase()}</p>
                                                </div>
                                            </div>

                                            <p className='text-white text-center mt-10 text-sm'>{t('agoraSuaSenha')}</p>
                                            <p className='mt-3 text-xs text-gray-400'>{t('senha')}:</p>
                                            <input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type='password'
                                                className='w-full h-10 rounded-md bg-[#012939] text-white px-2'
                                                placeholder={t('digiteAqui')}
                                            />

                                            <button
                                                className='flex h-10 items-center gap-2 p-2 rounded-md bg-blue-400 mt-5 w-full justify-center text-white'
                                                onClick={handleLogin}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator size={25} />
                                                ) : (
                                                    t('conectar')
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className='text-gray-300 text-sm text-center'>{t('contasSalvas')}</p>
                                            <div className='flex flex-col gap-2 max-h-[200px] overflow-y-auto'>
                                                {accountsConnected.map(item => (
                                                    <UserAccountItem
                                                        key={item.id}
                                                        data={item}
                                                        selectAccount={(data) => {
                                                            setAccountSelected(data);
                                                            setWallet(data?.wallet);
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                className='flex items-center gap-2 p-2 rounded-md bg-blue-400 mt-5 w-full justify-center text-white'
                                                onClick={() => setViewForm(true)}
                                            >
                                                {t('entrarOutraConta')}
                                            </button>

                                            <button
                                                className='flex items-center gap-2 p-2 rounded-md bg-orange-500 mt-5 w-full justify-center text-white'
                                                onClick={handleSyncWallet}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator size={25} />
                                                ) : (
                                                    <>
                                                        <FaWallet color='white' size={25} />

                                                        {t('sincronizarWallet')}
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}

                            {/* <button
                                className='flex items-center gap-2 p-2 rounded-md bg-orange-500 mt-5 w-full justify-center text-white'
                                onClick={handleSyncWallet}
                            >
                                {loading ? (
                                    <ActivityIndicator size={25}/>
                                ) : (
                                    <>
                                        <FaWallet color='white' size={25} />

                                        Sincronizar wallet
                                    </>
                                )}
                            </button> */}
                        </>
                    )}
                </div>

                <div />

            </Dialog.Content>

            <ToastContainer />

            {modalSignOut && (
                <ModalSignOut
                    close={() => setModalSignOut(false)}
                />
            )}
        </Dialog.Portal>
    )
}