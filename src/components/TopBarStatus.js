import React, {useState, useEffect} from 'react';
import { useMainContext } from '../hooks/useMainContext';
import {useNetwork} from '../hooks/useNetwork';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {VscAccount} from 'react-icons/vsc';
import {MdVisibility, MdVisibilityOff, MdKeyboardArrowDown, MdOutlineNotificationsActive} from 'react-icons/md';
import {AiFillCaretDown} from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalAccountOptions } from './HeaderAccount/ModalAccountOptions';
import { ModalNotifications } from './ModalNotifications';
import { ModalTutorial } from './Tutorial/ModalTutorial';

export function TopBarStatus({}){
    const {walletAddress} = useParams();
    const {pathname} = useLocation();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user, walletConnected, Sync, chooseModalRegister, balanceUser, checkUser, era, toggleModalChooseLang, language, notifications, viewMode, chooseModalTutorial, modalTutorial} = useMainContext();
    const {isSupported} = useNetwork();
    const [visibilityBalance, setVisibilityBalance] = useState(false);
    const [modalOptions, setModalOptions] = useState(false);
    const [modalNotifications, setModalNotifications] = useState(false);
    const [notificationNotVisualized, setNotificationNotVisualized] = useState(0);

    useEffect(() => {
        if(notifications.length > 0) {
            let totalNotVisualized = 0;
            for(var i = 0; i < notifications.length; i++) {
                if(!notifications[i].visualized){
                    totalNotVisualized += 1;
                }
            }
            setNotificationNotVisualized(totalNotVisualized);
        }
    },[notifications]);

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            const typeUser = await checkUser(response.wallet);
            navigate(`/dashboard/${response.wallet}/network-impact/${typeUser}/n`)
        }
    }

    if(viewMode){
        return(
            <div className={`flex w-full h-12 bg-[url("./assets/bg-status-bar.png")] fixed items-center justify-between px-2 lg:px-5 bottom-0 lg:top-0`}>
                <div className='flex items-center gap-2'>
                    <p className='text-white text-sm lg:text-base'>{t('You are in preview mode')}</p>
                    <button
                        onClick={() => chooseModalTutorial()}
                        className='px-3 h-8 font-bold text-white rounded-md bg-green-600'
                    >
                        {t('Register')}
                    </button>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        className='px-2 py-1 text-white flex items-center justify-center'
                        onClick={() => toggleModalChooseLang()}
                    >
                        {language === 'pt-BR' ? (
                            <img
                                src={require('../assets/icon-br.png')}
                                className='w-[30px] object-contain'
                            />
                        ) : (
                            <img
                                src={require('../assets/icon-brit.png')}
                                className='w-[30px] object-contain'
                            />
                        )}

                        <div>
                            <MdKeyboardArrowDown
                                size={20}
                                color='white'
                            />
                        </div>
                    </button>
                </div>

                <Dialog.Root
                    open={modalTutorial}
                    onOpenChange={(open) => chooseModalTutorial()}
                >
                    <ModalTutorial/>
                </Dialog.Root>
            </div>
        );
    }

    return(
        <div className={`flex w-full h-12 bg-[url("./assets/bg-status-bar.png")] fixed items-center ${walletConnected === '' ? 'justify-center' : 'justify-between'} px-2 lg:px-5 bottom-0 lg:top-0`}>
            {isSupported ? (
                <>
                {walletConnected === '' ? (
                    <>
                    <div className='flex w-full items-center gap-2 justify-center'>
                        <p className='font-bold text-white'>{t('You are good to conect')}!</p>
                        
                        <button
                            className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                            onClick={() => handleSync()}
                        >
                            {t('SYNCHRONIZE')}
                        </button>
                    </div>
                    </>
                ) : (
                    <>
                    {pathname === '/' ? (
                        <div className='flex w-full items-center gap-2 justify-between'>
                            <div/>

                            <div className='flex items-center gap-2'>
                                <p className='font-bold text-white'>{t('You are good to conect')}!</p>
                                
                                <button
                                    className='px-10 py-1 rounded-md font-bold text-white bg-[#0A4303]'
                                    onClick={() => handleSync()}
                                >
                                    {t('SYNCHRONIZE')}
                                </button>
                            </div>

                            <div/>
                        </div>
                    ) : (
                        <>
                        
                        {user === '0' && (
                            <div className='flex w-full items-center gap-2 justify-center'>
                                <p className='font-bold text-xs lg:text-lg text-white'>{t('Your connected but not registered')}!</p>
                            
                                <button
                                    className='px-1 lg:px-10 py-1 rounded-md font-bold text-xs lg:text-base text-white bg-[#ff9900]'
                                    onClick={chooseModalRegister}
                                >
                                    {t('Click Here To Register')}
                                </button>

                                <button
                                    className='px-1 lg:px-10 py-1 rounded-md font-bold text-xs lg:text-base text-white bg-[#0a4303]'
                                    onClick={() => navigate('/')}
                                >
                                    {t('Voltar para login')}
                                </button>
                            </div>
                        )}

                        {user !== '0' && (
                            <>
                                <p className='hidden lg:flex font-bold text-[#80421A] text-xl'>Era 1</p>
                                <p className='hidden lg:flex text-xs lg:text-lg font-bold text-white'>Conta: {walletConnected}</p> 
                                
                                <div className='flex w-full justify-between lg:w-[350px] lg:justify-normal items-center lg:gap-2'>
                
                                    <div className='flex items-center justify-end gap-2 lg:w-[400px]'>
                                        
                                        <h1 className='font-bold text-white'>{t('Balance')}: </h1>
                                        <p className='font-bold text-white'>{visibilityBalance ? (balanceUser / 10 ** 18).toFixed(2)  : '******'} Tokens</p>
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
                                        className='px-2 py-1 text-white flex items-center justify-center'
                                        onClick={() => toggleModalChooseLang()}
                                    >
                                        {language === 'pt-BR' ? (
                                            <img
                                                src={require('../assets/icon-br.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        ) : (
                                            <img
                                                src={require('../assets/icon-brit.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        )}

                                        <div>
                                            <MdKeyboardArrowDown
                                                size={20}
                                                color='white'
                                            />
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setModalNotifications(true)}
                                        className='flex flex-col ml-3 mr-1'
                                    >
                                        <MdOutlineNotificationsActive size={25} color='white'/>
                                        {notificationNotVisualized > 0 && (
                                            <div className='flex w-5 h-5 rounded-full bg-red-500 items-center justify-center border mt-[-15px] ml-[-10px]'>
                                                <p className='text-white text-xs'>
                                                    {notificationNotVisualized < 10 ? notificationNotVisualized : '+9'}
                                                </p>
                                            </div>
                                        )}
                                    </button>
                            
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
                <div className='flex w-full items-center gap-2 justify-between'>
                    <div className='flex items-center gap-2'>
                        <p className='text-xs lg:text-lg text-white'>{t('Your connected network is unsupported. Please connect to Sepolia Testnet')}!</p>
                        
                        <button
                            onClick={() => chooseModalTutorial()}
                            className='px-5 lg:px-10 h-8 rounded-md font-bold text-white bg-[#FF9900]'
                        >
                            Tutorial
                        </button>
                    </div>

                    <button
                        className='px-2 py-1 text-white flex items-center justify-center'
                        onClick={() => toggleModalChooseLang()}
                    >
                        {language === 'pt-BR' ? (
                            <img
                                src={require('../assets/icon-br.png')}
                                className='w-[30px] object-contain'
                            />
                        ) : (
                            <img
                                src={require('../assets/icon-brit.png')}
                                className='w-[30px] object-contain'
                            />
                        )}

                        <div>
                            <MdKeyboardArrowDown
                                size={20}
                                color='white'
                            />
                        </div>
                    </button>
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

            <Dialog.Root
                open={modalNotifications}
                onOpenChange={(open) => setModalNotifications(open)}
            >
                <ModalNotifications
                
                />
            </Dialog.Root>
        </div>
    )
}