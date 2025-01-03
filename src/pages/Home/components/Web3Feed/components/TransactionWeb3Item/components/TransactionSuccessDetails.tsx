import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../types/transaction";

interface Props {
    parameters: ParametersTransactionProps[];
    method: string;
}
export function TransactionSuccessDetails({ parameters, method }: Props) {
    const { t } = useTranslation();
    const [showDecodedInput, setShowDecodedInput] = useState(false);

    function toggleShowDecodedInput() {
        setShowDecodedInput(old => !old);
    }

    return (
        <div className="flex flex-col gap-1 mt-2">
            <button
                onClick={toggleShowDecodedInput}
                className="text-white text-sm underline text-start w-fit"
            >
                {showDecodedInput ? 'Ocultar dados brutos' : 'Exibir dados brutos'}
            </button>
            <div className={`flex flex-col gap-1 ${showDecodedInput ? 'h-[200px]' : 'h-0'} duration-300`}>
                {showDecodedInput && (
                    <DecodedInput
                        parameters={parameters}
                    />
                )}
            </div>
        </div>
    )
}

interface DecodedInputProps {
    parameters: ParametersTransactionProps[];
}
function DecodedInput({ parameters }: DecodedInputProps) {

    if (!parameters) {
        return <p className="text-white">Nenhum dado adicional para ser exibido</p>
    }

    if (parameters.length === 0) {
        return (
            <p className="text-white">Nenhum dado adicional para ser exibido</p>
        )
    }

    return (
        <div className="flex flex-col mt-1">
            <div className="flex h-10 bg-container-secondary rounded-t-md px-3 items-center py-1">
                <div className="flex w-[20%] border-r border-container-primary h-full items-center">
                    <p className="text-white font-bold text-sm">Name</p>
                </div>
                <div className="flex w-[80%] pl-3 h-full items-center">
                    <p className="text-white font-bold text-sm">Data</p>
                </div>
            </div>
            <div className="flex flex-col h-[155px] overflow-y-auto">
                {parameters.map(item => (
                    <DecodedInputItem
                        key={item.name}
                        input={item}
                    />
                ))}
            </div>
        </div>
    )
}

interface DecodedInputItemProps {
    input: ParametersTransactionProps;
}
function DecodedInputItem({ input }: DecodedInputItemProps) {
    return (
        <div className="flex h-10 bg-container-secondary px-3 items-center py-1 border-b border-container-primary">
            <div className="flex w-[20%] h-full items-center">
                <p className="text-white truncate text-sm">{input.name}</p>
            </div>
            <div className="flex w-[80%] pl-3 h-full items-center">
                <p className="text-white truncate text-sm">{input.value}</p>
            </div>
        </div>
    )
}