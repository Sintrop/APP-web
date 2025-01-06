import React from "react";
import { ParametersTransactionProps } from "../../../../../../../../../types/transaction";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Props {
    parameters: ParametersTransactionProps[];
}
export function UserValidationDescription({ parameters }: Props) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const parameterUser = parameters.filter(item => item.name === 'userAddress');
    const parameterJustification = parameters.filter(item => item.name === 'justification');
    const userAddress = parameterUser[0].value;

    function navigateToUserDetail(){
        navigate(`/user-details/${userAddress}`);
    }

    return (
        <div>
            <p className="text-white">{t('votouUsuario')}
                <span
                    className="font-bold text-green-600 underline hover:cursor-pointer ml-1"
                    onClick={navigateToUserDetail}
                >
                    {userAddress}
                </span>
            </p>

            <p className="mt-3 text-xs text-gray-400">{t('justificativa')}:</p>
            <p className="text-white">{parameterJustification[0].value}</p>
        </div>
    )
}