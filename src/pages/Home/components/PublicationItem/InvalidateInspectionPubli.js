import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function InvalidateInspectionPubli({additionalData}){
    const {t} = useTranslation();
    const navigate = useNavigate();

    return(
        <div>
            <p className="text-white">{t('votouIsp')} <span className="font-bold text-green-600">#{additionalData?.inspection?.id}</span></p>

            <p className="mt-3 text-xs text-gray-400">{t('justificativa')}:</p>
            <p className="text-white">{additionalData?.justification}</p>

            <button
                className="w-fit px-3 py-1 bg-blue-600 rounded-md text-white font-bold mt-3"
                onClick={() => navigate(`/result-inspection/${additionalData?.inspection?.id}`)}
            >
                {t('verIsp')}
            </button>
        </div>
    )
}