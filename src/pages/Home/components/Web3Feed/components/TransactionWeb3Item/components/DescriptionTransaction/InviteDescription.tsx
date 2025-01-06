import React from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../../types/transaction";

interface Props {
    parameters: ParametersTransactionProps[]
}
export function InviteDescription({ parameters }: Props) {
    const { t } = useTranslation();
    const parameterInvited = parameters.filter(item => item.name === 'invited');
    const parameterUserType = parameters.filter(item => item.name === 'userType');

    const walletInvited = parameterInvited[0].value;
    const userTypeInvited = parseInt(parameterUserType[0].value);
    
    return (
        <p className='text-white'>
            {t('conviteWallet')} <span className='font-bold text-green-600'>{walletInvited} </span>
            {t('seCadastrarComo')}
            <span className='font-bold text-green-600'>
                {userTypeInvited === 1 && ` ${t('textProdutor')} `}
                {userTypeInvited === 2 && ` ${t('textInspetor')} `}
                {userTypeInvited === 3 && ` ${t('textPesquisador')} `}
                {userTypeInvited === 4 && ` ${t('textDesenvolvedor')} `}
                {userTypeInvited === 5 && ` ${t('textContribuidor')} `}
                {userTypeInvited === 6 && ` ${t('textAtivista')} `}
                {userTypeInvited === 7 && ` ${t('textApoiador')} `}
                {userTypeInvited === 8 && ` ${t('textValidador')} `}
            </span>
            {userTypeInvited === 7 && t('textComissao')}
        </p>
    )
}