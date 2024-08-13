import React, { useEffect, useState } from "react";
import { useMainContext } from "../../hooks/useMainContext";
import { useNavigate } from "react-router";
import { useCountdown } from '../../hooks/useCountdown';
import { useTranslation } from "react-i18next";

export function TopBar() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const { era, nextEra, impactToken, epoch } = useMainContext();

    const blocosEmSegundos = nextEra * 13.5
    const blocosEmMinutos = blocosEmSegundos / 60
    const blocosEmHoras = blocosEmMinutos / 60
    const blocosEmDias = blocosEmHoras / 24

    return (
        <div className="w-full h-[40px] bg-green-700 flex fixed top-0 left-0 items-center z-40 overflow-auto">
            <div className="flex items-center min-w-[1400px] px-3 gap-5">
                <p className=" text-gray-200 text-xs">{t('epocaAtual')}: <span className="font-bold text-green-300">{epoch}</span></p>

                <p className=" text-gray-200 text-xs">{t('eraAtual')}: <span className="font-bold text-green-300">{era}</span></p>

                <p className=" text-gray-200 text-xs">
                    Próx. era:
                    <span className="font-bold text-green-300"> {Intl.NumberFormat('pt-BR').format(nextEra)} {t('blocos')} </span>
                    <span className="text-white font-bold">
                        {blocosEmSegundos > 86400 && (` (${blocosEmDias.toFixed(0)} ${t('dias')})`)}
                        {blocosEmSegundos > 3600 && blocosEmSegundos < 86400 ? (` (${blocosEmHoras.toFixed(0)} ${t('horas')})`) : null}
                        {blocosEmSegundos > 1 && blocosEmSegundos < 3600 ? (` (${blocosEmMinutos.toFixed(0)} ${t('minutos')})`) : null}
                    </span>
                </p>

                <div className="flex items-center gap-1">
                    <img src={require('../../assets/token.png')} className="w-5 h-5 object-contain" />
                    <p className="font-bold text-white text-xs">R$ 0,0282</p>
                </div>

                
                <p className=" text-gray-200 text-xs gap-3">
                    {t('impactoPorToken')}:
                    <span className="font-bold text-green-300"> {t('carbono')}: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(impactToken?.carbon * 1000)} g</span>
                    <span className="font-bold text-green-300"> | {t('agua')}: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.water * 1000)} L</span>
                    <span className="font-bold text-green-300"> | {t('solo')}: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.soil * 10000)} cm²</span>
                    <span className="font-bold text-green-300"> | {t('bio')}: {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.bio)} uv</span>
                </p>
                

                {/* <button className="items-center justify-center h-8 px-2 rounded-md bg-red-500 flex gap-2" onClick={() => navigate('/pre-sale')}>
                    <img
                        src={require('../../assets/token.png')}
                        className="w-5 h-5 object-contain"
                    />
                    <p className="font-bold text-white text-xs">Pré-venda do Crédito De Regeneração</p>

                    <div className="flex items-center gap-1">
                        <div className="flex flex-col items-center justify-center h-6 rounded-md bg-green-500 px-1">
                            <p className="font-bold text-xs">Lista de espera</p>
                        </div>
                    </div>
                </button> */}
            </div>
        </div>
    )
}