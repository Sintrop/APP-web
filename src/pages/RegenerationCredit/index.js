import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/header";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet";
import { Chat } from "../../components/Chat";
import { useTranslation } from "react-i18next";
import { RiComputerFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";

export function RegenerationCredit() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Crédito de Regeneração - Sintrop</title>
                <link rel="canonical" href={`https://app.sintrop.com/regeneration-credit`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar/>
            <Header routeActive='regeneration-credit' />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex gap-5 flex-wrap max-w-[1024px] mt-3">
                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/impact-calculator')}
                    >
                        <img
                            src={require('../../assets/icon-contribuir.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('contribuir')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/services')}
                    >
                        <img
                            src={require('../../assets/recompensas.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('pagamentoAmbiental')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/impact')}
                    >
                        <img
                            src={require('../../assets/network.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('impactoEstatistica')}</p>
                    </button>


                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/my-tokens')}
                    >
                        <img
                            src={require('../../assets/token.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('meusTokens')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/centers')}
                    >
                        <RiComputerFill color='white' size={50} />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('servicos')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[110px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/community')}
                    >
                        <FaUsers color="white" size={50} />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('comunidade')}</p>
                    </button>
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat/>
            </div>
        </div>
    )
}