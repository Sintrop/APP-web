import React from "react";
import { ParametersTransactionProps } from "../../../../../../../../types/transaction";
import { useTranslation } from "react-i18next";

interface Props {
    parameters: ParametersTransactionProps[]
}
export function AddContributionDescription({ parameters }: Props) {
    const {t} = useTranslation();

    if (!parameters) {
        return <div />
    }

    const parameterReport = parameters.filter(item => item.name === 'report');

    return (
        <div>
            <p className="text-white">{t('enviouRelatorioSubiuDeNivel')}</p>

            <div className="items-center flex flex-col mt-3">
                <a
                    href={`https://ipfs.io/ipfs/${parameterReport[0]?.value}`}
                    className="px-4 py-1 rounded-md bg-blue-500 font-bold text-white text-sm"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('verRelatorio')}
                </a>
            </div>
        </div>
    )
}