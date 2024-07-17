import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";
import { api } from "../../../services/api";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export function ItemReceipt({ data, index }) {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [impactReceipt, setImpactReceipt] = useState({});
    const [idApi, setIdApi] = useState('---');
    const [moreInfo, setMoreInfo] = useState(false);

    useEffect(() => {
        formaterDate();
        getInfoApi();
    }, []);

    function formaterDate() {
        if (data) {
            const newDate = format(new Date(Number(data?.timeStamp) * 1000), 'dd-MM-yyyy kk:mm')
            setDate(newDate);
        }
    }

    async function getInfoApi() {
        const response = await api.get(`/tokens-burned/by-hash/${data.hash}`);
        const impact = response.data.tokensBurned[0];

        setIdApi(impact.id)

        setImpactReceipt({
            carbon: impact.tokens * impact.carbon,
            water: impact.tokens * impact.water,
            bio: impact.tokens * impact.bio,
            soil: impact.tokens * impact.soil,
        })
    }

    return (
        <div className="flex flex-col w-full bg-[#0a4303] rounded-md">
            <div className="flex items-center justify-between p-2">
                <div className="flex flex-col">
                    <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data.hash}`}>
                        <p className="text-blue-400 text-sm lg:text-base mb-2 max-w-[80px] lg:max-w-[70%] overflow-hidden text-ellipsis decoration-1 underline decoration-blue-400">{data.hash}</p>
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-gray-400 text-xs text-center">{date}</p>
                    <div className="flex items-center gap-1 w-[120px]">
                        <img 
                            src={require('../../../assets/token.png')}
                            className="w-6 h-6 object-contain"
                        />

                        <p className="text-green-500 font-bold">
                            {Intl.NumberFormat('pt-BR',{maximumFractionDigits: 0}).format(Number(data.value) / 10 ** 18)} RC
                        </p>
                    </div>

                    <button onClick={() => setMoreInfo(!moreInfo)} className="p-1">
                        {moreInfo ? (
                            <BiChevronUp size={25} color='white'/>
                        ) : (
                            <BiChevronDown size={25} color='white'/>
                        )}
                    </button>
                </div>
            </div>

            {moreInfo && (
                <div className="flex flex-col p-3 w-full ">
                    <div>
                        <p className="font-bold text-center text-white lg:text-xl lg:mt-3">Recibo de contribuição</p>
                        <p className="text-white text-center text-xs lg:text-base">{idApi}</p>
                        <p className="text-white text-center text-xs lg:text-lg">{date}</p>
                        <p className="text-white text-center text-xs lg:text-md lg:mb-3">sintrop.com</p>
                    </div>

                    <p className="max-w-[100%] overflow-clip text-gray-400">***********************************************************************************************************************************************************</p>

                    <div>
                        <p className="font-bold text-sm lg:text-base text-white">{t('Transaction Hash')}</p>
                        <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data.hash}`}>
                            <p className="text-blue-400 text-sm lg:text-base mb-2 max-w-[95%] overflow-hidden text-ellipsis decoration-1 underline decoration-blue-400">{data.hash}</p>
                        </a>

                        <p className="font-bold text-white text-sm lg:text-base">{t('From Address')}</p>
                        <p className="text-white mb-2 text-sm lg:text-base max-w-[95%] overflow-hidden text-ellipsis">{data.to}</p>

                        <p className="font-bold text-white text-sm lg:text-base">{t('Block Number')}</p>
                        <p className="text-white mb-2 text-sm lg:text-base">{data.blockNumber}</p>
                    </div>

                    <p className="max-w-[100%] overflow-clip text-gray-400">********************************************************************************************************************************************************</p>

                    <div className="flex items-center w-full justify-between mb-2">
                        <p className="font-bold text-white text-sm lg:text-base">Total contribuido</p>
                        <p className="text-white text-sm lg:text-base">{Intl.NumberFormat('pt-BR',{maximumFractionDigits: 0}).format(Number(data.value) / 10 ** 18)} RC</p>
                    </div>

                    <p className="max-w-[100%] overflow-clip text-gray-400">*****************************************************************************************************************************************************</p>

                    <p className="font-bold text-center text-sm lg:text-base text-white">Relatório de impacto</p>
                    <div className="flex flex-col lg:p-3">
                        <p className="font-bold text-white text-sm lg:text-base">{t('Carbono')} = {Number(impactReceipt?.carbon).toFixed(2)} kg</p>
                        <p className="font-bold text-white text-sm lg:text-base">Solo = {Number(impactReceipt?.soil).toFixed(2)} m²</p>
                        <p className="font-bold text-white text-sm lg:text-base">{t('Biodiversidade')} = {Number(impactReceipt?.bio).toFixed(2)} uv</p>
                        <p className="font-bold text-white text-sm lg:text-base">{t('Água')} = {Number(impactReceipt?.water).toFixed(2)} m³</p>
                    </div>
                </div>
            )}

        </div>
    )
}