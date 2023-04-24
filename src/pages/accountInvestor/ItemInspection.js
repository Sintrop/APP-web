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
        <div className="flex flex-col items-center w-[500px]">
            <div className="flex flex-col p-3 pb-24 w-full bg-[#0A4303]">
                <div className="flex w-full py-1 items-center px-2 bg-[#783E19] rounded-md mb-5">
                    <p className="font-bold text-white text-xl">Recibo de regeneração #{index}</p>
                </div>

                <p className="font-bold text-white">{t('Transaction Hash')}</p>
                <a target="_blank" href={`https://goerli.etherscan.io/tx/${data.hash}`}>
                    <p className="text-white mb-5 w-[50ch] overflow-hidden text-ellipsis">{data.hash}</p>
                </a>

                <p className="font-bold text-white">{t('From Address')}</p>
                <p className="text-white mb-5">{data.contractAddress}</p>

                <p className="font-bold text-white">{t('Block Number')}</p>
                <p className="text-white mb-5">{data.blockNumber}</p>

                <p className="font-bold text-white">{t('Date')}</p>
                <p className="text-white mb-5">{date}</p>

                <p className="font-bold text-white">{t('Total Burned')}</p>
                <p className="text-white mb-5">{(Number(data.value) / 10**18).toFixed(5)}</p>

            </div>
                <div className="flex flex-col bg-[#783e19] p-3 w-[90%] mt-[-100px]">
                    <p className="font-bold text-white">{t('Total Impact')} = 0</p>
                    <p className="font-bold text-white">{t('Carbono')} = 0t</p>
                    <p className="font-bold text-white">Solo = 0m²</p>
                    <p className="font-bold text-white">{t('Biodiversidade')} = 0</p>
                    <p className="font-bold text-white">{t('Água')} = 0m³</p>
                </div>
        </div>
    )
}