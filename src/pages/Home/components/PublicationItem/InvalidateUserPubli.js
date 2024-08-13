import React from "react";
import { useTranslation } from "react-i18next";

export function InvalidateUserPubli({additionalData}){
    const {t} = useTranslation();
    return(
        <div>
            <p className="text-white">{t('votouUsuario')} <span className="font-bold text-green-600">{additionalData?.userToVote?.name}</span></p>

            <p className="mt-3 text-xs text-gray-400">{t('justificativa')}:</p>
            <p className="text-white">{additionalData?.justification}</p>
        </div>
    )
}