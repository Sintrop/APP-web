import React from "react";
import { useTranslation } from "react-i18next";

export function InviteWalletPubli({ data }) {
    const { t } = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);

    return (
        <div>
            <p className='text-white'>
                {t('conviteWallet')} <span className='font-bold text-green-600'>{additionalData?.walletInvited} </span>
                {t('seCadastrarComo')}
                <span className='font-bold text-green-600'>
                    {additionalData?.userType === 1 && ` ${t('textProdutor')} `}
                    {additionalData?.userType === 2 && ` ${t('textInspetor')} `}
                    {additionalData?.userType === 3 && ` ${t('textPesquisador')} `}
                    {additionalData?.userType === 4 && ` ${t('textDesenvolvedor')} `}
                    {additionalData?.userType === 5 && ` ${t('textContribuidor')} `}
                    {additionalData?.userType === 6 && ` ${t('textAtivista')} `}
                    {additionalData?.userType === 7 && ` ${t('textApoiador')} `}
                    {additionalData?.userType === 8 && ` ${t('textValidador')} `}
                </span>
                {t('textComissao')}
            </p>
        </div>
    )
}