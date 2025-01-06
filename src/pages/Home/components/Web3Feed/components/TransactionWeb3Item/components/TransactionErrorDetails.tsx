import React from "react";
import { useTranslation } from "react-i18next";

interface Props{
    result: string;
}
export function TransactionErrorDetails({result}: Props){
    const {t} = useTranslation();

    return (
        <div>
            <p className="text-white">
                Erro: {result === 'awaiting_internal_transactions' ? t('aguardandoAsTransacoesInternas') : result}
            </p>
        </div>
    )
}