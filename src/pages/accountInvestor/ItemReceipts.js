import React, {useEffect, useState} from "react";
import {format} from 'date-fns';
import { useTranslation } from "react-i18next";

export function ItemReceipt({data, index}){
    const {t} = useTranslation();
    const [date, setDate] = useState('');

    useEffect(() => {
        calculateDate();
    }, []);

    function calculateDate(){
        if(data){
            const newDate = format(new Date(Number(data?.timeStamp) * 1000), 'dd-MM-yyyy - kk:mm')
            setDate(newDate);
        }
    }

    return(
        <div className="flex flex-col items-center w-[300px] md:w-[420px] lg:h-[650px] bg-folha-recibo bg-contain bg-no-repeat">
            <div className="flex flex-col p-3 w-full ">
                <div>
                    <p className="font-bold text-center text-black lg:text-xl lg:mt-3">Recibo de regeneração #{index}</p>
                    <p className="text-black text-center text-xs lg:text-lg">{date}</p>
                    <p className="text-black text-center text-xs lg:text-md lg:mb-3">sintrop.com</p>
                </div>

                <p className="max-w-[100%] overflow-clip">**********************************************************************************</p>
                
                <div>
                    <p className="font-bold text-sm lg:text-base text-black">{t('Transaction Hash')}</p>
                    <a target="_blank" href={`https://goerli.etherscan.io/tx/${data.hash}`}>
                        <p className="text-blue-700 text-sm lg:text-base mb-2 max-w-[95%] overflow-hidden text-ellipsis decoration-1 underline decoration-blue-700">{data.hash}</p>
                    </a>

                    <p className="font-bold text-black text-sm lg:text-base">{t('From Address')}</p>
                    <p className="text-black mb-2 text-sm lg:text-base max-w-[95%] overflow-hidden text-ellipsis">{data.contractAddress}</p>

                    <p className="font-bold text-black text-sm lg:text-base">{t('Block Number')}</p>
                    <p className="text-black mb-2 text-sm lg:text-base">{data.blockNumber}</p>
                </div>

                <p className="max-w-[100%] overflow-clip">**********************************************************************************</p>

                <div className="flex items-center w-full justify-between mb-2">
                    <p className="font-bold text-black text-sm lg:text-base">{t('Total Burned')}</p>
                    <p className="text-black text-sm lg:text-base">{(Number(data.value) / 10**18).toFixed(5)}</p>
                </div>

                <p className="max-w-[100%] overflow-clip">**********************************************************************************</p>

                <p className="font-bold text-center text-sm lg:text-base">Relatório de impacto</p>
                <div className="flex flex-col lg:p-3">
                    <p className="font-bold text-black text-sm lg:text-base">{t('Carbono')} = 0t</p>
                    <p className="font-bold text-black text-sm lg:text-base">Solo = 0m²</p>
                    <p className="font-bold text-black text-sm lg:text-base">{t('Biodiversidade')} = 0</p>
                    <p className="font-bold text-black text-sm lg:text-base">{t('Água')} = 0m³</p>
                </div>
                <p className="max-w-[100%] overflow-clip">**********************************************************************************</p>

                <div className="flex items-center w-full justify-between">
                    <p className="font-bold text-black text-sm lg:text-base">{t('Total Impact')}</p>
                    <p className="text-black text-sm lg:text-base">0</p>
                </div>
            </div>
        </div>
    )
}