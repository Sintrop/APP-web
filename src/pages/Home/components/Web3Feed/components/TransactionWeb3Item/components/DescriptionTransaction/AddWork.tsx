import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ParametersTransactionProps } from "../../../../../../../../types/transaction";

interface Props{
    parameters: ParametersTransactionProps[];
}
export function AddWorkDescription({parameters}: Props){
    const {t} = useTranslation();
    const [seeMore, setSeeMore] = useState(false);


    if(!parameters){
        return <div/>
    }

    const parameterTitle = parameters.filter(item => item.name === 'title');
    const parameterThesis = parameters.filter(item => item.name === 'thesis');
    const parameterFile = parameters.filter(item => item.name === 'file');
    const title = parameterTitle[0].value;
    const thesis = parameterThesis[0].value;
    const file = parameterFile[0].value;

    return(
        <div className="flex flex-col">
            <p className="font-bold text-white">{title}</p>

            {seeMore ? (
                <p className="text-white text-sm">{thesis}</p>
            ) : (
                <p className="text-white text-sm text-ellipsis overflow-hidden truncate">{thesis}</p>
            )}

            <div className="flex justify-start">
                {thesis.length > 90 && (
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
                    href={`https://ipfs.io/ipfs/${file}`}
                    className="px-4 py-1 rounded-md bg-blue-500 font-bold text-white text-sm"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('verPesquisa')}
                </a>
            </div>
        </div>
    )
}