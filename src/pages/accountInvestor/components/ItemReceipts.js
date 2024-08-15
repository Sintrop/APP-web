import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";
import { api } from "../../../services/api";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export function ItemReceipt({ data, index }) {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [impactReceipt, setImpactReceipt] = useState({});
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

        if(impact){
            setImpactReceipt({
                carbon: impact.tokens * impact.carbon,
                water: impact.tokens * impact.water,
                bio: impact.tokens * impact.bio,
                soil: impact.tokens * impact.soil,
            }) 
        }
    }

    return (
        <div className="flex flex-col w-full bg-[#0E5804] rounded-md">
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
                <div className="flex flex-col p-3 w-full bg-[#0a4303]">
                    <div className="mt-5">
                        <p className="font-bold text-sm lg:text-base text-white">{t('hashTransacao')}</p>
                        <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data.hash}`}>
                            <p className="text-blue-400 text-sm lg:text-base mb-2 max-w-[95%] overflow-hidden text-ellipsis decoration-1 underline decoration-blue-400">{data.hash}</p>
                        </a>

                        <div className="w-full h-[1px] bg-green-500/20"/>

                        <p className="font-bold text-white text-sm lg:text-base mt-2">{t('doEndereco')}</p>
                        <p className="text-white mb-2 text-sm lg:text-base max-w-[95%] overflow-hidden text-ellipsis">{data.to}</p>

                        <div className="w-full h-[1px] bg-green-500/20"/>

                        <p className="font-bold text-white text-sm lg:text-base mt-2">{t('numeroBloco')}</p>
                        <p className="text-white mb-2 text-sm lg:text-base">{data.blockNumber}</p>

                        <div className="w-full h-[1px] bg-green-500/20"/>
                    </div>

                    <div className="flex items-center w-full justify-between my-5">
                        <p className="font-bold text-white text-sm lg:text-base">{t('totalContribuido')}</p>
                        <p className="text-green-500 font-bold text-sm lg:text-base">{Intl.NumberFormat('pt-BR',{maximumFractionDigits: 0}).format(Number(data.value) / 10 ** 18)} RC</p>
                    </div>

                    <div className="w-full h-[1px] bg-green-500/20"/>

                    <p className="font-bold text-sm lg:text-base text-white mt-3">{t('relatorioImpacto')}</p>
                    <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                        <div className="flex flex-col items-center px-5 py-3 rounded-sm bg-green-950 w-[135px]">
                            <p className="font-bold text-green-500">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactReceipt?.carbon)} kg</p>
                            <p className="text-white text-sm lg:text-base">{t('carbono')}</p>
                        </div>
                        <div className="flex flex-col items-center px-5 py-3 rounded-sm bg-green-950 w-[135px]">
                            <p className="font-bold text-green-500">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactReceipt?.soil)} m²</p>
                            <p className="text-white text-sm lg:text-base">{t('solo')}</p>
                        </div>
                        <div className="flex flex-col items-center px-5 py-3 rounded-sm bg-green-950 w-[135px]">
                            <p className="font-bold text-green-500">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactReceipt?.water)} m³</p>
                            <p className="text-white text-sm lg:text-base">{t('agua')}</p>
                        </div>
                        <div className="flex flex-col items-center px-5 py-3 rounded-sm bg-green-950 w-[135px]">
                            <p className="font-bold text-green-500">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactReceipt?.bio)} uv</p>
                            <p className="text-white text-sm lg:text-base">{t('bio')}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}