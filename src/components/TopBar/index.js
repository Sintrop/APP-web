import React, { useEffect, useState } from "react";
import { useMainContext } from "../../hooks/useMainContext";
import { useNavigate } from "react-router";
import { useCountdown } from '../../hooks/useCountdown';

export function TopBar() {
    const [day, hour, minute, second] = useCountdown('2024-06-25 23:59:59');
    const navigate = useNavigate();
    const { era, nextEra, impactToken } = useMainContext();

    const blocosEmSegundos = nextEra * 13.5
    const blocosEmMinutos = blocosEmSegundos / 60
    const blocosEmHoras = blocosEmMinutos / 60
    const blocosEmDias = blocosEmHoras / 24

    return (
        <div className="w-full h-[40px] bg-green-700 flex fixed top-0 left-0 items-center z-50 overflow-auto">
            <div className="flex items-center min-w-[1400px] px-3 gap-5">
                <p className=" text-gray-200 text-xs">Era atual: <span className="font-bold text-green-300">{era}</span></p>

                <p className=" text-gray-200 text-xs">
                    Próx. era:
                    <span className="font-bold text-green-300"> {Intl.NumberFormat('pt-BR').format(nextEra)} blocos </span>
                    <span className="text-white font-bold">
                        {blocosEmSegundos > 86400 && (` (${blocosEmDias.toFixed(0)} dias)`)}
                        {blocosEmSegundos > 3600 && blocosEmSegundos < 86400 ? (` (${blocosEmHoras.toFixed(0)} horas)`) : null}
                        {blocosEmSegundos > 1 && blocosEmSegundos < 3600 ? (` (${blocosEmMinutos.toFixed(0)} minutos)`) : null}
                    </span>
                </p>

                <div className="flex items-center gap-1">
                    <img src={require('../../assets/token.png')} className="w-5 h-5 object-contain" />
                    <p className="font-bold text-white text-xs">R$ 0,0282</p>
                </div>

                
                <p className=" text-gray-200 text-xs gap-3">
                    Impacto por token:
                    <span className="font-bold text-green-300"> Carbono: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(impactToken?.carbon * 1000)} g</span>
                    <span className="font-bold text-green-300"> | Água: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.water * 1000)} L</span>
                    <span className="font-bold text-green-300"> | Solo: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.soil * 10000)} cm²</span>
                    <span className="font-bold text-green-300"> | Biodver.: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.bio)} uv</span>
                </p>
                

                <button className="items-center justify-center h-8 px-2 rounded-md bg-red-500 flex gap-2" onClick={() => navigate('/pre-sale')}>
                    <img
                        src={require('../../assets/token.png')}
                        className="w-5 h-5 object-contain"
                    />
                    <p className="font-bold text-white text-xs">Pré-venda do Crédito De Regeneração</p>

                    <div className="flex items-center gap-1">
                        <div className="flex flex-col items-center justify-center h-6 rounded-md bg-green-500 px-1">
                            <p className="font-bold text-xs">{day} dias e {hour} horas</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}