import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { useNetwork } from "../../hooks/useNetwork";
import loginImg from '../../assets/img/sintrop_login_alpha.png';
import logo from '../../assets/logo-branco.png';
import { MainContext } from "../../contexts/main";
import { UnsupportedNetwork } from "../../components/UnsupportedNetwork";
import {useTranslation} from 'react-i18next';
import { ModalChooseLang } from "../../components/ModalChooseLang";
import * as Dialog from '@radix-ui/react-dialog';

import { TopBarStatus } from "../../components/TopBarStatus";

function Login(){
    const {t} = useTranslation();
    const {isSupported} = useNetwork();
    const {Sync, modalChooseLang, toggleModalChooseLang} = useContext(MainContext);
    const navigate = useNavigate();

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            navigate(`/dashboard/${response.wallet}/isa/main`)
        }
    }

    return(
        <div className="flex flex-col h-[100vh]">
            <TopBarStatus/>
            <div className="flex w-full h-full items-center justify-center bg-[#0A4303] overflow-auto mt-10">
                <div className="lg:w-[1000px] lg:h-[600px] flex">
                    <div className='flex flex-col justify-between lg:w-[500px]'>
                        <div className='flex flex-col w-[300px]'>
                            <img
                                src={require('../../assets/logo-branco.png')}
                                className="w-[200px] h-[80px] object-contain"
                            />
                            <h1 className="text-[#BBFFB2] font-bold text-2xl">
                                Sistema descentralizado de certificação de 
                                <span className="text-white"> Agricultura Regenerativa</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <a>
                                <img
                                    src={require('../../assets/icon-linkedin.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a>
                                <img
                                    src={require('../../assets/icon-whats.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a>
                                <img
                                    src={require('../../assets/icon-insta.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <h1 className='font-bold text-white text-3xl mb-3'>Bem vindo</h1>
                        <p className="font-bold text-[#F4A022] text-xl">Nossa missão é regenerar o planeta!</p>
                        <p className="text-white lg:w-[500px]">Ela não será nada fácil, porém é extremamente importante pois o futuro da humanidade depende de nós.</p>

                        <div className="w-[500px] flex justify-center">
                            <img
                                src={require('../../assets/formiga.png')}
                                className="object-contain w-[300px]"
                            />
                        </div>

                        <p className="text-white lg:w-[500px]">Será preciso de muita, mas muita gente nessa luta. Por isso estamos buscando pessoas do bem para fazerem parte do Exército da Regeneração. Para se juntar nessa luta, basta concluir a missão 1</p>

                        <div className="w-[500px] flex justify-center">
                            <button
                                className="w-[300px] h-10 bg-[#A75722] rounded-xl font-bold text-white mt-6"
                                onClick={handleSync}
                            >
                                COMEÇAR MISSÃO 1
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
            </div>
        </div>
    )
}

export default Login;