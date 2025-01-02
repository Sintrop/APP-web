import React from "react";
import { Header } from "../../components/Header/header";
import { useNavigate } from "react-router";
import { TopBar } from '../../components/TopBar';
import { Feedback } from '../../components/Feedback';
import { Helmet } from "react-helmet";
import { Chat } from "../../components/Chat";
import { useTranslation } from "react-i18next";

export function Centers() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/centers`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive='regeneration-credit' />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3">
                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroInspecao')}</p>
                        <p className="text-white">{t('descCentroIsp')}</p>

                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/inspections-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroPesquisa')}</p>
                        <p className="text-white">{t('descCentroPesquisa')}</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/researches-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroDev')}</p>
                        <p className="text-white">{t('descCentroDev')}</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/development-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroValidacao')}</p>
                        <p className="text-white">{t('descCentroValidacao')}</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/validation-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroComercial')}</p>
                        <p className="text-white">{t('descCentroComercial')}</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/activist-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#03364B] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">{t('centroColab')}</p>
                        <p className="text-white">{t('descCentroColab')}</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/colaborative-center')}
                        >
                            {t('acessarCentro')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat/>
            </div>
        </div>
    )
}