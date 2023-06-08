import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { useNetwork } from "../../hooks/useNetwork";
import { MainContext } from "../../contexts/main";
import {useTranslation} from 'react-i18next';
import { ModalChooseLang } from "../../components/ModalChooseLang";
import * as Dialog from '@radix-ui/react-dialog';

import { TopBarStatus } from "../../components/TopBarStatus";
import {ModalTutorial} from '../../components/Tutorial/ModalTutorial';



function Login(){
    const {t} = useTranslation();
    const {isSupported} = useNetwork();
    const {Sync, modalChooseLang, toggleModalChooseLang, modalTutorial, chooseModalTutorial} = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {

        
    },[])

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            navigate(`/dashboard/${response.wallet}/network-impact/main`)
        }
    }

    return(
        <div className="flex flex-col h-[100vh]">
            <TopBarStatus/>
            <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center bg-[#0A4303] overflow-auto pb-16 pt-[300px] px-2 lg:px-0 lg:pt-0 lg:mt-10 lg:pb-0">
                <div className="w-full lg:w-[1000px] lg:h-[600px] flex flex-col lg:flex-row">
                    <div className='flex flex-col justify-between w-full lg:w-[500px]'>
                        <div className='flex flex-col w-full lg:w-[300px]'>
                            <img
                                src={require('../../assets/logo-branco.png')}
                                className="w-[200px] h-[80px] object-contain"
                            />
                            <h1 className="text-[#BBFFB2] font-bold text-2xl">
                                {t('Decentralized Regenerative Agriculture certification system')}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 my-5 lg:my-0">
                            <a
                                href="https://www.linkedin.com/company/sintrop-sustainability/"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-linkedin.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a
                                href="https://api.whatsapp.com/send/?phone=%2B5548988133635&text&type=phone_number&app_absent=0"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-whats.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a
                                href="https://www.instagram.com/sintrop.sustentabilidade/"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-insta.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <h1 className='font-bold text-white text-3xl mb-3'>{t('Welcome')}</h1>
                        <p className="font-bold text-[#F4A022] text-xl">{t('Our mission is to regenerate the planet')}!</p>
                        <p className="text-white lg:w-[500px]">{t('It will not be easy at all, but it is extremely important because the future of humanity depends on us')}.</p>

                        <div className="lg:w-[500px] flex justify-center items-center">
                            <img
                                src={require('../../assets/formiga.png')}
                                className="object-contain w-[300px]"
                            />
                        </div>

                        <p className="text-white lg:w-[500px]">{t('Será preciso de muita, mas muita gente nessa luta. Por isso estamos buscando pessoas do bem para fazerem parte do Exército da Regeneração. Para se juntar nessa luta, basta concluir a missão 1')}</p>

                        <div className="lg:w-[500px] flex flex-col lg:flex-row justify-center">
                            <button
                                className="lg:w-[300px] h-10 bg-[#A75722] rounded-xl font-bold text-white mt-6"
                                onClick={chooseModalTutorial}
                            >
                                {t('START MISSION 1')}
                            </button>
                        </div>
                    </div>
                </div>

                <Dialog.Root
                    open={modalChooseLang}
                    onOpenChange={() => toggleModalChooseLang()}
                >
                    <ModalChooseLang/>
                </Dialog.Root>

                <Dialog.Root
                    open={modalTutorial}
                    onOpenChange={chooseModalTutorial}
                >
                    <ModalTutorial/>
                </Dialog.Root>
            </div>
        </div>
    )
}

export default Login;