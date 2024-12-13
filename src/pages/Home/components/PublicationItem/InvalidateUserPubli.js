import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function InvalidateUserPubli({additionalData}){
    const {t} = useTranslation();
    const navigate = useNavigate();

    function navigateToUserDetail(){
        navigate(`/user-details/${additionalData?.walletToVote}`);
    }

    return(
        <div>
            <p className="text-white">{t('votouUsuario')} 
                <span 
                    className="font-bold text-green-600 underline hover:cursor-pointer ml-1" 
                    onClick={navigateToUserDetail}
                > 
                    {additionalData?.walletToVote}
                </span>
            </p>

            <p className="mt-3 text-xs text-gray-400">{t('justificativa')}:</p>
            <p className="text-white">{additionalData?.justification}</p>
        </div>
    )
}