import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import Loading from './Loading';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';
import Loader from './Loader';
import { FaWallet, FaKey } from "react-icons/fa";
import { ActivityIndicator } from './ActivityIndicator';
import {useMainContext} from '../hooks/useMainContext';

export function ModalConnectAccount({ close }) {
    const {loginWithWalletAndPassword, Sync} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [viewForm, setViewForm] = useState(false);
    const [wallet, setWallet] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

    }, []);

    async function handleLogin(){
        if(loading){
            return;
        }
        if(!wallet.trim()){
            toast.error('Digite sua wallet!')
            return;
        }
        if(!password.trim()){
            toast.error('Digite sua senha!')
            return;
        }

        setLoading(true);

        const response = await loginWithWalletAndPassword(wallet, password);
        setLoading(false);
        
        if(response){
            toast.success('Você se conectou com sucesso!');
            setTimeout(() => close(), 2000);
            setWallet('');
            setPassword('');
        }

    }

    async function handleSyncWallet(){
        if (!window.ethereum) {
            toast.error('Você não tem um provedor ethereum em seu navegador!');
            return;
        }
        setLoading();
        
        const response = await Sync();
        
        if(response?.status === 'connected'){
            toast.success('Você se conectou com sucesso!')
        }else{
            toast.error('Operação cancelada!')
        }

        setLoading(false);
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col justify-between p-3 lg:w-[400px] lg:h-[400px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>

                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]' />
                    <Dialog.Title className='font-bold text-white'>Conectar</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white' />
                    </Dialog.Close>
                </div>

                <div>
                    {viewForm ? (
                        <>
                            <h3 className='text-white text-center text-lg'>Digite sua wallet e sua senha</h3>
                            <p className='mt-5 text-xs text-gray-400'>Wallet:</p>
                            <input
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                type='text'
                                className='w-full h-10 rounded-md bg-green-950 text-white px-2'
                                placeholder='Digite sua wallet'
                            />

                            <p className='mt-3 text-xs text-gray-400'>Senha:</p>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                className='w-full h-10 rounded-md bg-green-950 text-white px-2'
                                placeholder='Digite sua senha'
                            />


                            <button
                                className='flex h-10 items-center gap-2 p-2 rounded-md bg-blue-400 mt-2 w-full justify-center text-white'
                                onClick={handleLogin}
                            >
                                {loading ? (
                                    <ActivityIndicator size={25}/>
                                ) : (
                                    'Conectar'
                                )}
                            </button>

                            <p className='text-sm text-center text-gray-400 mt-8 cursor-pointer' onClick={() => setViewForm(false)}>Voltar</p>
                        </>
                    ) : (
                        <>
                            <h3 className='text-white text-center text-lg'>Como você deseja se conectar?</h3>

                            <button
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
                            </button>

                            <button
                                className='flex items-center gap-2 p-2 rounded-md bg-blue-400 mt-2 w-full justify-center text-white'
                                onClick={() => setViewForm(true)}
                            >
                                <FaKey color='white' size={25} />

                                Entrar com wallet e senha
                            </button>
                        </>
                    )}
                </div>

                <div />

            </Dialog.Content>

            <ToastContainer />
        </Dialog.Portal>
    )
}