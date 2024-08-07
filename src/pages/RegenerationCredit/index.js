import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet";
import { Chat } from "../../components/Chat";

export function RegenerationCredit() {
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
                <div className="flex gap-5 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-blue-500"
                        onClick={() => navigate('/impact-calculator')}
                    >
                        <img
                            src={require('../../assets/icon-contribuir.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Contribuir</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-green-500"
                        onClick={() => navigate('/market')}
                    >
                        <img
                            src={require('../../assets/market-icon.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Mercado</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-yellow-600"
                        onClick={() => navigate('/services')}
                    >
                        <img
                            src={require('../../assets/recompensas.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Pagamento por serviços ambientais</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/impact')}
                    >
                        <img
                            src={require('../../assets/network.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Impacto e estatísticas</p>
                    </button>


                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/my-tokens')}
                    >
                        <img
                            src={require('../../assets/token.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Meus tokens</p>
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