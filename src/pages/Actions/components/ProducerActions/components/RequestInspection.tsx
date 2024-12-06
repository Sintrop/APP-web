import React from "react";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Props {
    close: () => void;
}
export function RequestInspection({ close }: Props) {
    const { t } = useTranslation();

    function handleSuccess(type: string){
        if(type === 'blockchain'){
            toast.success('inspecaoSolicitadaComSucesso');
            close();
        }
        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
            close();
        }
    }

    return (
        <ModalWhereExecuteTransaction
            additionalData=""
            close={close}
            success={handleSuccess}
            transactionType="requestInspection"
        />
    )
}