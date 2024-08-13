import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function PublishResearche({ data }) {
    const {t} = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);
    const [seeMore, setSeeMore] = useState(false);

    return (
        <div className="flex flex-col">
            <p className="font-bold text-white">{additionalData?.title}</p>

            {seeMore ? (
                <p className="text-white text-sm">{additionalData?.thesis}</p>
            ) : (
                <p className="text-white text-sm text-ellipsis overflow-hidden truncate">{additionalData?.thesis}</p>
            )}

            <div className="flex justify-start">
                {additionalData?.thesis.length > 90 && (
                    <button
                        onClick={() => setSeeMore(!seeMore)}
                        className="text-gray-400 text-sm"
                    >
                        {seeMore ? 'Ver menos' : 'Ver mais'}
                    </button>
                )}
            </div>

            <div className="items-center flex flex-col mt-3">
                <a
                    href={`https://app.sintrop.com/view-pdf/${additionalData?.file}`}
                    className="px-4 py-1 rounded-md bg-blue-500 font-bold text-white text-sm"
                    target="_blank"
                >
                    {t('verPesquisa')}
                </a>
            </div>
        </div>
    )
}