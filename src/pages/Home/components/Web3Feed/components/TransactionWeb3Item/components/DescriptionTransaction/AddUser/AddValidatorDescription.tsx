import React from "react";
import { useTranslation } from "react-i18next";

export function AddValidatorDescription() {
    const { t } = useTranslation();

    return (
        <p className='text-white'>
            {t('oUsuario')} {t('seCadastrouComo')}
            <span className='font-bold text-green-600'> {t('textValidador')}</span> {t('textVersao6')}
        </p>
    )
}