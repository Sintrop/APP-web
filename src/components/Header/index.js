import React, { useEffect, useState } from "react";
import { FaHome, FaUsers, FaRegUser } from "react-icons/fa";
import { RiComputerFill } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { useMainContext } from '../../hooks/useMainContext';
import { ModalConnectAccount } from "../ModalConnectAccount/index.js";
import * as Dialog from '@radix-ui/react-dialog';
import { getImage } from "../../services/getImage";
import { ModalLogout } from "../../pages/Home/components/ModalLogout/index.js";
import { ModalOptionAccount } from "./components/ModalOptionAccount.js";
import { useTranslation } from "react-i18next";
import { ModalChooseLanguage } from "./components/ModalChooseLanguage.js";

export function Header({ routeActive }) {
    const { t, i18n } = useTranslation();
    const { walletConnected, userData, modalChooseLang, toggleModalChooseLang } = useMainContext();
    const navigate = useNavigate();
    const [modalConnect, setModalConnect] = useState(false);
    const [imageProfile, setImageProfile] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const [optionsAccount, setOptionsAccount] = useState(false);

    useEffect(() => {
        if (userData?.name) {
            getImageProfile();
        }
    }, [userData]);

    async function getImageProfile() {
        const response = await getImage(userData?.imgProfileUrl);
        setImageProfile(response)
    }

    return (
        <>
            <div className="w-full flex items-center justify-center h-[60px] lg:h-[80px] bg-[#0a4303] py-2 fixed bottom-0 lg:top-10 left-0 border-b-2 border-green-800 z-40">
                <div className="flex items-center justify-between overflow-x-auto lg:min-w-[1024px]">
                    <button onClick={() => navigate('/')}>
                        <img
                            src={require('../../assets/logo-branco.png')}
                            className="w-[120px] h-[80px] object-contain"
                        />
                    </button>
                    <div className="flex items-center">
                        <button
                            className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                            onClick={() => navigate('/')}
                        >
                            <div className="hidden lg:flex">
                                <FaHome color={routeActive === 'home' ? 'white' : '#ccc'} size={25} />
                            </div>
                            <div className="lg:hidden">
                                <FaHome color={routeActive === 'home' ? 'white' : '#ccc'} size={18} />
                            </div>
                            <p className={`${routeActive === 'home' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>{t('inicio')}</p>

                            {routeActive === 'home' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>
                        <button
                            className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                            onClick={() => navigate('/centers')}
                        >
                            <div className="hidden lg:flex">
                                <RiComputerFill color={routeActive === 'centers' ? 'white' : '#ccc'} size={25} />
                            </div>
                            <div className="lg:hidden">
                                <RiComputerFill color={routeActive === 'centers' ? 'white' : '#ccc'} size={18} />
                            </div>
                            <p className={`${routeActive === 'centers' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>{t('centros')}</p>

                            {routeActive === 'centers' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>

                        <button
                            className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                            onClick={() => navigate('/regeneration-credit')}
                        >
                            <div className="py-3">
                                <img
                                    src={require('../../assets/token.png')}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>

                            {routeActive === 'regeneration-credit' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>

                        <button
                            className="flex flex-col items-center hover:text-white w-[85px] lg:w-[100px]"
                            onClick={() => navigate('/community')}
                        >
                            <div className="hidden lg:flex">
                                <FaUsers color={routeActive === 'community' ? 'white' : '#ccc'} size={25} />
                            </div>
                            <div className="lg:hidden">
                                <FaUsers color={routeActive === 'community' ? 'white' : '#ccc'} size={18} />
                            </div>

                            <p className={`${routeActive === 'community' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>{t('comunidade')}</p>

                            {routeActive === 'community' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>

                        <button
                            className="flex flex-col items-center hover:text-white w-[85px] lg:w-[95px]"
                            onClick={() => navigate('/actions')}
                        >
                            <div className="hidden lg:flex">
                                <BsFillGearFill color={routeActive === 'actions' ? 'white' : '#ccc'} size={25} />
                            </div>
                            <div className="lg:hidden">
                                <BsFillGearFill color={routeActive === 'actions' ? 'white' : '#ccc'} size={18} />
                            </div>

                            <p className={`${routeActive === 'actions' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base`}>{t('acoes')}</p>

                            {routeActive === 'actions' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>

                        <button
                            className="flex flex-col items-center w-[75px]"
                            onClick={() => {
                                if (walletConnected === '') {
                                    setModalConnect(true);
                                } else {
                                    setOptionsAccount(true);
                                }
                            }}
                        >
                            <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                                <ModalConnectAccount close={() => setModalConnect(false)} />
                            </Dialog.Root>

                            <div
                                className="flex flex-col items-center justify-center w-6 h-6 bg-gray-200 rounded-full"
                            >
                                {walletConnected === '' ? (
                                    <>
                                        <FaRegUser color='#aaa' size={15} />
                                    </>
                                ) : (
                                    <>
                                        {imageProfile && (
                                            <img
                                                src={imageProfile}
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <p className={`${routeActive === 'profile' ? 'text-white' : 'text-[#ccc]'} text-sm lg:text-base text-center`}>{walletConnected === '' ? t('conectar') : t('perfil')}</p>

                            {routeActive === 'profile' && (
                                <div className="w-full h-1 bg-white rounded-full" />
                            )}
                        </button>

                        <button
                            className="w-7 h-5 bg-red-500 ml-5"
                            onClick={toggleModalChooseLang}
                        >
                            {i18n.language === 'pt-BR' && (
                                <img
                                    src={require('../../assets/icon-br.png')}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            {i18n.language === 'en-US' && (
                                <img
                                    src={require('../../assets/icon-brit.png')}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            {i18n.language === 'es' && (
                                <img
                                    src={require('../../assets/icon-spa.png')}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </button>
                    </div>
                </div>

            </div>
            <div className="z-10">
                {showLogout && (
                    <ModalLogout
                        close={() => setShowLogout(false)}
                    />
                )}
            </div>

            {optionsAccount && (
                <ModalOptionAccount
                    close={() => setOptionsAccount(false)}
                    disconnect={() => {
                        setOptionsAccount(false);
                        setShowLogout(true);
                    }}
                    switchAccount={() => {
                        setOptionsAccount(false);
                        setModalConnect(true);
                    }}
                />
            )}

            {modalChooseLang && (
                <ModalChooseLanguage
                    close={toggleModalChooseLang}
                />
            )}
        </>
    )
}