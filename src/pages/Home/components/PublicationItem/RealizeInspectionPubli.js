import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../../services/api";
import { FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { getImage } from "../../../../services/getImage";
import { useTranslation } from "react-i18next";

export function RealizeInspectionPubli({ data }) {
    const {t} = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);
    const navigate = useNavigate();
    const [inspectionData, setInspectionData] = useState({});
    const [loadingInspection, setLoadingInspection] = useState(false);
    const [image, setImage] = useState(null)

    useEffect(() => {
        getIsas(additionalData.inspectionId);
    }, []);

    async function getIsas(id) {
        setLoadingInspection(true);
        const response = await api.get(`/web3/inspection/${id}`);
        setInspectionData(response.data);
        getImageProof(response.data?.inspectionApiData?.proofPhoto)
        setLoadingInspection(false);
    }

    async function getImageProof(hash) {
        const response = await getImage(hash)
        setImage(response)
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 p-2 rounded-md bg-green-600">
                <FaInfoCircle color='white' size={18} />
                <p className="text-white">{t('realizouIsp')} #{additionalData.inspectionId}</p>
            </div>

            <div className="mt-3 p-2 rounded-md bg-green-950 flex justify-center gap-2">
                <div className="w-[40%] flex flex-col bg-florest h-[235px] rounded-md overflow-hidden">
                    {image && (
                        <img
                            src={image}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="w-[59%] flex flex-col h-[235px] gap-2">
                    <div className="flex items-center justify-center gap-2 p-1 rounded-md bg-green-600">
                        <p className="font-bold text-white">
                            {loadingInspection ? t('carregandoDados') : `${inspectionData?.inspection?.isaScore} ${t('ptsRegen')}`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-1 rounded-md bg-[#0a4303]">
                        <p className="text-white">{t('carbono')}</p>
                        <p className="font-bold text-green-500">
                            {loadingInspection ? t('carregandoDados') : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(Number(inspectionData?.isaData?.carbon?.indicator) / 1000)} t`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-1 rounded-md bg-[#0a4303]">
                        <p className="text-white">{t('solo')}</p>
                        <p className="font-bold text-green-500">
                            {loadingInspection ? t('carregandoDados') : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(inspectionData?.isaData?.soil?.indicator)} m²`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-1 rounded-md bg-[#0a4303]">
                        <p className="text-white">{t('agua')}</p>
                        <p className="font-bold text-green-500">
                            {loadingInspection ? t('carregandoDados') : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(inspectionData?.isaData?.water?.indicator)} m³`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-1 rounded-md bg-[#0a4303]">
                        <p className="text-white">{t('bio')}</p>
                        <p className="font-bold text-green-500">
                            {loadingInspection ? t('carregandoDados') : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(inspectionData?.isaData?.bio?.indicator)} uv`}
                        </p>
                    </div>

                    <button
                        className="flex items-center justify-between gap-2 p-1 rounded-md bg-blue-500"
                        onClick={() => navigate(`/result-inspection/${additionalData.inspectionId}`)}
                    >
                        <p className="text-white">{t('verResultado')}</p>
                        <FaChevronRight size={18} color='white' />
                    </button>
                </div>
            </div>
        </div>
    )
}