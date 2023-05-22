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
            navigate(`/dashboard/${response.wallet}/network-impact/main`)
        }
    }

    return(
        <div className={`flex w-full h-12 bg-[url("./assets/bg-status-bar.png")] fixed items-center ${walletConnected === '' ? 'justify-center' : 'justify-between'} px-2 lg:px-5 bottom-0 lg:top-0`}>
            {isSupported ? (
                <>
                {walletConnected === '' ? (
                    <>
                    <div className='flex w-full items-center gap-2 justify-center'>
                        <p className='font-bold text-white'>You are good to conect!</p>
                        
                        <button
                            className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                            onClick={() => handleSync()}
                        >
                            SINCRONIZAR
                        </button>
                    </div>
                    </>
                ) : (
                    <>
                    {pathname === '/' ? (
                        <div className='flex w-full lg:w-[350px] items-center gap-2 justify-center'>
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
                                <p className='font-bold text-xs lg:text-lg text-white'>Your connected but not registered!</p>
                            
                                <button
                                    className='px-1 lg:px-10 py-1 rounded-md font-bold text-xs lg:text-base text-white bg-[#0A4303]'
                                    onClick={chooseModalRegister}
                                >
                                    Click Here To Register
                                </button>

                                <button
                                    className='px-1 lg:px-10 py-1 rounded-md font-bold text-xs lg:text-base text-white bg-[#FF9900]'
                                    onClick={() => navigate('/')}
                                >
                                    Start Mission 1
                                </button>
                            </div>
                        )}

                        {user !== '0' && (
                            <>
                                <p className='hidden lg:flex font-bold text-[#80421A] text-xl'>Era 1</p>
                                <p className='hidden lg:flex text-xs lg:text-lg font-bold text-white'>Conta: {walletConnected}</p> 
                                
                                <div className='flex w-full justify-between lg:w-[300px] lg:justify-normal items-center lg:gap-2'>
                
                                    <div className='flex items-center justify-end gap-2 lg:w-[300px]'>
                                        
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
                    <p className='font-bold text-xs lg:text-lg text-white'>Your connected network is unsupported. Please connect to Goerli Testnet!</p>
                    <a
                        href='https://github.com/Sintrop/SMR/wiki/Como-acessar-a-v3-do-Sistema'
                        target='_blank'
                    >
                        <button
                            className='px-5 lg:px-10 h-8 rounded-md font-bold text-white bg-[#FF9900]'
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