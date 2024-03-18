import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";

export function Market() {

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header routeActive='market' />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                <div className="flex gap-5 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-blue-500"
                        onClick={() => alert('Disponível em breve')}
                    >
                        <img
                            src={require('../../assets/icon-contribuir.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Contribuir</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-green-500"
                        onClick={() => alert('Disponível em breve')}
                    >
                        <img
                            src={require('../../assets/market-icon.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Mercado</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => alert('Disponível em breve')}
                    >
                        <img
                            src={require('../../assets/network.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Impacto da rede</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => alert('Disponível em breve')}
                    >
                        <img
                            src={require('../../assets/token.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Recompensas</p>
                    </button>
                </div>
            </div>
        </div>
    )
}