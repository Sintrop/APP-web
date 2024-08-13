import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function InsumoItem({ data }) {
    const {t} = useTranslation();
    const categoryDetails = JSON.parse(data?.categoryDetails);
    if(data?.value === '0' || data?.value === '00'){
        return(
            <div/>
        )
    }
    
    return (
        <div className="flex flex-col p-2 rounded-md bg-green-800 mb-3">
            <div className="flex items-center justify-between w-full">
                <div className="flex">
                    <div className="flex flex-col">
                        <p className="font-bold text-white">{data?.title}</p>
                        <p className="text-white">
                            {categoryDetails?.insumoCategory === 'insumo-mineral' && t('insumoMineral')}
                            {categoryDetails?.insumoCategory === 'insumo-biologico' && t('insumoBiologico')}
                            {categoryDetails?.insumoCategory === 'insumo-quimico' && t('insumoQuimico')}
                            {categoryDetails?.insumoCategory === 'recurso-externo' && t('recursoExterno')}
                            {categoryDetails?.insumoCategory === 'embalagens' && t('embalagens')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-col">
                    <p className="font-bold text-red-500">{data?.value}</p>
                    <p className="text-gray-300">{categoryDetails?.unity}</p>
                </div>
            </div>

            <div className="flex flex-col items-center mt-3">
                <p className="text-gray-300 text-xs">{t('impactoCausado')}</p>

                <div className="flex items-center gap-10 mt-1">
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.carbonValue))} kg
                        </p>
                        <p className="text-sm text-gray-200">{t('carbono')}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.soloValue))} m²
                        </p>
                        <p className="text-sm text-gray-200">{t('solo')}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.aguaValue))} m³
                        </p>
                        <p className="text-sm text-gray-200">{t('agua')}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.bioValue))} uv
                        </p>
                        <p className="text-sm text-gray-200">{t('bio')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}