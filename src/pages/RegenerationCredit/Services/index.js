import React from "react";
import { Header } from "../../../components/Header";
import { useNavigate } from "react-router";
import { TopBar } from "../../../components/TopBar";
import { useTranslation } from "react-i18next";

export function Services({}){
    const {t} = useTranslation();
    const navigate = useNavigate();

    return(
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex gap-5 flex-wrap max-w-[1024px] mt-3">
                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/pools/producers')}
                    >
                        <img
                            src={require('../../../assets/icon-produtor.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('regeneracaoEcossitemas')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/pools/developers')}
                    >
                        <img
                            src={require('../../../assets/centro-dev.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('desenvolvimento')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/pools/researchers')}
                    >
                        <img
                            src={require('../../../assets/centro-pesquisa.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('pesquisa')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/pools/inspectors')}
                    >
                        <img
                            src={require('../../../assets/centro-inspecao.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('inspecao')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => navigate('/pools/validators')}
                    >
                        <img
                            src={require('../../../assets/validacao-icon.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('validacao')}</p>
                    </button>

                    <button 
                        className="rounded-md w-[328px] h-[120px] flex items-center px-5 gap-5 bg-[#03364B]"
                        onClick={() => alert('disponível em breve')}
                    >
                        <img
                            src={require('../../../assets/icon-ativista.png')}
                            className="h-16 w-16 object-contain"
                        />

                        <p className="font-bold text-white text-left text-xl mt-2">{t('ativismo')}</p>
                    </button>
                </div>
            </div>
        </div>
    )
}