import React, {useState} from 'react';
import { useMainContext } from '../hooks/useMainContext';
import {useNetwork} from '../hooks/useNetwork';
import { useNavigate, useLocation } from 'react-router-dom';
import {VscAccount} from 'react-icons/vsc';
import {MdVisibility, MdVisibilityOff} from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalAccountOptions } from './HeaderAccount/ModalAccountOptions';

export function TopBarStatus({}){
    const {pathname} = useLocation();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user, walletConnected, Sync, chooseModalRegister} = useMainContext();
    const {isSupported} = useNetwork();
    const [visibilityBalance, setVisibilityBalance] = useState(false);
    const [balanceUser, setBalanceUser] = useState(0);
    const [modalOptions, setModalOptions] = useState(false);

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            navigate(`/dashboard/${response.wallet}/isa/main`)
        }
    }

    return(
        <div className='w-full h-12 bg-[url("./assets/bg-status-bar.png")] fixed flex items-center justify-between px-5 '>
            {isSupported ? (
                <>
                {walletConnected === '' ? (
                    <div className='flex w-full items-center gap-2 justify-center'>
                        <p className='font-bold text-white'>You are good to conect!</p>
                        
                        <button
                            className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                            onClick={() => handleSync()}
                        >
                            SINCRONIZAR
                        </button>
                    </div>
                ) : (
                    <>
                    {pathname === '/' ? (
                        <div className='flex w-full items-center gap-2 justify-center'>
                            <p className='font-bold text-white'>You are good to conect!</p>
                            
                            <button
                                className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                                onClick={() => handleSync()}
                            >
                                SINCRONIZAR
                            </button>
                        </div>
                    ) : (
                        <>
                        
                        {user === '0' && (
                            <div className='flex w-full items-center gap-2 justify-center'>
                                <p className='font-bold text-white'>Your connected but not registered!</p>
                            
                                <button
                                    className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                                    onClick={chooseModalRegister}
                                >
                                    Click Here To Register
                                </button>

                                <button
                                    className='px-10 py-1 rounded-md font-bold text-white bg-[#FF9900]'
                                    onClick={() => navigate('/')}
                                >
                                    Start Mission 1
                                </button>
                            </div>
                        )}

                        {user !== '0' && (
                            <>
                                <p className='font-bold text-[#80421A] text-xl'>Era 1</p>
                                <p className='font-bold text-white'>Conta: {walletConnected}</p> 
                                
                                <div className='flex items-center gap-2'>
                
                                    <div className='flex items-center justify-end gap-2 w-[300px]'>
                                        
                                        <h1 className='font-bold text-white'>{t('Balance')}: </h1>
                                        <p className='font-bold text-white'>{visibilityBalance ? balanceUser : '******'} SAC Tokens</p>
                                        <button 
                                            className='w-[30px] h-[30px]'
                                            onClick={() => setVisibilityBalance(!visibilityBalance)}
                                        >
                                            {visibilityBalance ? (
                                                <MdVisibility color='white' size={25}/>
                                            ) : (
                                                <MdVisibilityOff color='white' size={25}/>
                                            )}
                                        </button>
                                    </div>
                            
                                    <button
                                        onClick={() => setModalOptions(true)}
                                        className='w-[30px] h-[30px]'
                                    >
                                        <VscAccount color='#fff' size={30}/>
                                    </button>
                                </div>
                            </>
                        )}
                        </>
                    )}
                    </>
                )}
                </>
            ) : (
                <div className='flex w-full items-center gap-2 justify-center'>
                    <p className='font-bold text-white'>Your connected network is unsupported. Please connect to Goerli Testnet!</p>
                    <a
                        href='https://github.com/Sintrop/SMR/wiki/Como-acessar-a-v3-do-Sistema'
                        target='_blank'
                    >
                        <button
                            className='px-10 h-8 rounded-md font-bold text-white bg-[#FF9900]'
                        >
                            Tutorial
                        </button>
                    </a>
                </div>
            )}

            <Dialog.Root
                open={modalOptions}
                onOpenChange={(open) => setModalOptions(open)}
            >
                <ModalAccountOptions
                    user={user}
                    walletConnected={walletConnected}
                    close={() => setModalOptions(false)}
                />
            </Dialog.Root>
        </div>
    )
}