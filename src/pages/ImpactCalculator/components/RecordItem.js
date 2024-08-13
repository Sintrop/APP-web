import { format } from "date-fns";
import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { FaChevronUp, FaRegTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export function RecordItem({data}){
    const {t} = useTranslation();
    const [moreDetails, setMoreDetails] = useState(false);
    const [impact, setImpact] = useState({});

    useEffect(() => {
        setImpact({
            carbon: data?.quant * data?.CalculatorItem?.carbon,
            water: data?.quant * data?.CalculatorItem?.water,
            soil: data?.quant * data?.CalculatorItem?.soil,
            bio: data?.quant * data?.CalculatorItem?.bio,
        })
    }, []);

    return(
        <div className="flex flex-col w-full px-3 bg-[#0a4303] mb-3 rounded-sm">
            <button 
                className="flex items-center justify-between w-full h-12" 
                onClick={() => setMoreDetails(true)}
            >
                <div className="flex flex-col items-start">
                    <p className="font-bold text-white">{data?.CalculatorItem?.name}</p>
                    <p className="text-xs text-gray-400">{t('cliqueMaisDetalhes')}</p>
                </div>

                <div className="flex items-center justify-end gap-5">
                    <p className="text-gray-300 text-xs">{format(new Date(data?.createdAt), 'dd/MM')}</p>

                    <p className="font-bold text-green-500">{data?.quant} {data?.CalculatorItem?.unit}</p>
                </div>
            </button>

            {moreDetails && (
                <div className="flex flex-col items-center pb-3">
                    <p className="text-xs text-gray-400">{t('impactoCausado')}</p>

                    <div className="flex items-center gap-8 mt-2">
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-white">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impact?.carbon)} kg</p>
                            <p className="text-white text-sm">{t('carbono')}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="font-bold text-white">-{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impact?.soil)} m²</p>
                            <p className="text-white text-sm">{t('solo')}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="font-bold text-white">-{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impact?.water)} m³</p>
                            <p className="text-white text-sm">{t('agua')}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="font-bold text-white">-{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impact?.bio)} uv</p>
                            <p className="text-white text-sm">{t('bio')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 mt-5">
                        <button 
                            className="text-white flex items-center gap-2" 
                            onClick={() => setMoreDetails(false)}
                        >
                            <FaChevronUp color='white' size={15}/>
                            {t('ocultarDetalhes')}
                        </button>

                        <button 
                            className="text-red-500 flex items-center gap-2"
                            onClick={() => toast.info('Disponível em breve')}
                        >
                            <FaRegTrashAlt size={15} className="text-red-500"/>
                            {t('excluirRegistro')}
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer/>
        </div>
    )
}