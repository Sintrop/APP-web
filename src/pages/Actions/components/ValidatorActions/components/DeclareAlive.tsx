import React, { useState } from "react";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props{
    close: () => void;
}
export function DeclareAlive({close}: Props){
    const {t} = useTranslation();
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);

    function handleSuccess(type: string){
        setShowModalWhereExecuteTransaction(false);
        if(type === 'blockchain'){
            toast.success(t('declaracaoFeitaComSucesso'));
            close();
        }

        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return(
        <div className="flex flex-col">
            <p className="text-center text-gray-300">É importante que faça essa declaração para que você consiga votar para invalidar algo na próxima ERA</p>
            <button
                className="w-full h-12 rounded-md bg-blue-primary flex items-center justify-center text-white font-semibold"
                onClick={() => setShowModalWhereExecuteTransaction(true)}
            >
                Fazer declaração
            </button>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData=""
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={handleSuccess}
                    transactionType="declareAlive"
                />
            )}
        </div>
    )
}