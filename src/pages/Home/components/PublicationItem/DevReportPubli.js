import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function DevReportPubli({additionalData}){
    const navigate = useNavigate();
    const {t} = useTranslation();

    return(
        <div>
            <p className="text-white">{t('enviouRelatorioSubiuDeNivel')}</p>

            <div className="items-center flex flex-col mt-3">
                <a
                    href={`https://app.sintrop.com/view-pdf/${additionalData?.report}`}
                    className="px-4 py-1 rounded-md bg-blue-500 font-bold text-white text-sm"
                    target="_blank"
                >
                    {t('verRalatorio')}
                </a>
            </div>
        </div>
    )
}