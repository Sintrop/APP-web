import React from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../types/transaction";

interface Props{
    parameters: ParametersTransactionProps[];
    method: string;
}
export function TransactionSuccessDetails({parameters, method}: Props){
    const {t} = useTranslation();

    if(parameters.length === 0){
        return(
            <p className="text-white">Nenhum dado adicional para ser exibido</p>
        )
    }
    
    return (
        <div>
            
        </div>
    )
}