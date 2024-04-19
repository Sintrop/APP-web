import React, { useEffect, useState } from "react";

export function InsumoItem({ data }) {
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
                            {categoryDetails?.insumoCategory === 'insumo-mineral' && 'Insumo mineral'}
                            {categoryDetails?.insumoCategory === 'insumo-biologico' && 'Insumo biológico'}
                            {categoryDetails?.insumoCategory === 'insumo-quimico' && 'Insumo químico'}
                            {categoryDetails?.insumoCategory === 'recurso-externo' && 'Recurso externo'}
                            {categoryDetails?.insumoCategory === 'embalagens' && 'Embalagens'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center flex-col">
                    <p className="font-bold text-red-500">{data?.value}</p>
                    <p className="text-gray-300">{categoryDetails?.unity}</p>
                </div>
            </div>

            <div className="flex flex-col items-center mt-3">
                <p className="text-gray-300 text-xs">Impacto causado</p>

                <div className="flex items-center gap-10 mt-1">
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.carbonValue))} kg
                        </p>
                        <p className="text-sm text-gray-200">Carbono</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.soloValue))} m²
                        </p>
                        <p className="text-sm text-gray-200">Solo</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.aguaValue))} m³
                        </p>
                        <p className="text-sm text-gray-200">Água</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white">
                            - {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(Number(data?.value) * Math.abs(categoryDetails?.bioValue))} uv
                        </p>
                        <p className="text-sm text-gray-200">Bio.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}