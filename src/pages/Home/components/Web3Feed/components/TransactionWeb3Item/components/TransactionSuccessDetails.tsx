import React from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../types/transaction";

interface Props{
    parameters: ParametersTransactionProps[];
    method: string;
}
export function TransactionSuccessDetails({parameters, method}: Props){
    const {t} = useTranslation();

    if(!parameters){
        return <p className="text-white">Nenhum dado adicional para ser exibido</p>
    }

    if(parameters.length === 0){
        return(
            <p className="text-white">Nenhum dado adicional para ser exibido</p>
        )
    }
    
    return (
        <div className="flex flex-col gap-1 mt-2">
            {parameters.map(item => (
                <DecodedInputItem
                    key={item.name}
                    input={item}
                />
            ))}
        </div>
    )
}

interface DecodedInputProps{
    input: ParametersTransactionProps;
}
function DecodedInputItem({input}: DecodedInputProps){
    return (
        <div className="w-full px-3 h-10 bg-container-secondary rounded-md flex items-center gap-3">
            <p className="text-white text-sm">{input.name}</p>
            <p className="text-white text-sm truncate">{input.value}</p>
        </div>
    )
}