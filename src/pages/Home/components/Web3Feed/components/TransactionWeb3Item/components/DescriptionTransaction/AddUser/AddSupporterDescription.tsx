import React from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../../../types/transaction";

interface Props{
    parameters: ParametersTransactionProps[]
}
export function AddSupporterDescription({parameters}: Props) {
    const { t } = useTranslation();
    const parameterName = parameters.filter(item => item.name === 'name');

    return (
        <p className='text-white'>
            {t('oUsuario')} <span className='font-bold text-green-600'>{parameterName[0].value} </span>
            {t('seCadastrouComo')}
            <span className='font-bold text-green-600'> {t('textApoiador')}</span> {t('textVersao6')}
        </p>
    )
}