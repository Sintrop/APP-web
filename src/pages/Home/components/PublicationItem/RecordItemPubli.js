import React, {useState} from "react";

export function RecordItemPubli({data}){
    const additionalData = JSON.parse(data?.additionalData);

    return(
        <div className="flex flex-col">
            <p className="text-white">Adicionou:</p>
            
            <div className="p-2 rounded-md bg-[#1C840F] flex items-center gap-2">
                <p className='font-bold text-white'>
                    {additionalData?.quant} {additionalData?.calculatorItem?.unit} de {additionalData?.calculatorItem?.name}
                </p>
            </div>

            <p className="text-white">Na sua fatura de consumo</p>
        </div>
    )
}