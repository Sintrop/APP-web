import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdInfo } from "react-icons/md";

export function RecordItemPubli({ data }) {
    const { t } = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);

    return (
        <div className="flex flex-col w-full bg-[#0a4303] rounded-md overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1C840F]">
                <MdInfo size={20} color='white' />

                <p className="text-white">{t('addItemCalcPubli')}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b px-3">
                <p className="font-bold text-white">
                    {additionalData?.calculatorItem?.name}
                </p>
                <p className="font-bold text-white">
                    {additionalData?.quant} {additionalData?.calculatorItem?.unit}
                </p>
            </div>
            <div className="flex flex-col py-2 px-3">
                <p className="text-xs text-gray-300">Impacto causado</p>
                <div className="flex items-center gap-2 justify-evenly">
                    <div className="flex items-center p-2 rounded-md bg-[#1c840f] w-[25%] justify-between">
                        <p className="text-xs text-white">{t('carbono')}</p>
                        <p className="font-bold text-white text-xs">
                            {Intl.NumberFormat('pt-BR').format(additionalData?.quant * additionalData?.calculatorItem?.carbon)} kg
                        </p>
                    </div>

                    <div className="flex items-center p-2 rounded-md bg-[#1c840f] w-[25%] justify-between">
                        <p className="text-xs text-white">{t('solo')}</p>
                        <p className="font-bold text-white text-xs">
                            {Intl.NumberFormat('pt-BR').format(additionalData?.quant * additionalData?.calculatorItem?.soil)} m²
                        </p>
                    </div>

                    <div className="flex items-center p-2 rounded-md bg-[#1c840f] w-[25%] justify-between">
                        <p className="text-xs text-white">{t('agua')}</p>
                        <p className="font-bold text-white text-xs">
                            {Intl.NumberFormat('pt-BR').format(additionalData?.quant * additionalData?.calculatorItem?.water)} m³
                        </p>
                    </div>

                    <div className="flex items-center p-2 rounded-md bg-[#1c840f] w-[25%] justify-between">
                        <p className="text-xs text-white">{t('bio')}</p>
                        <p className="font-bold text-white text-xs">
                           {Intl.NumberFormat('pt-BR').format(additionalData?.quant * additionalData?.calculatorItem?.bio)} uv
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}