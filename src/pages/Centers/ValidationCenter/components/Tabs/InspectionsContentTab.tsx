import React, { useEffect, useState } from "react";
import { getInspectionsValidationCenter } from "../../../../../services/centers/validation/inspection";
import { InspectionProps } from "../../../../../types/inspection";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { useTranslation } from "react-i18next";

export function InspectionsContentTab(){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [inspections, setInspections] = useState<InspectionProps[]>([]);

    useEffect(() => {
        handleGetInspections();
    }, []);

    async function handleGetInspections(){
        setLoading(true);
        const response = await getInspectionsValidationCenter();
        setIsError(!response.success);

        if(response.success){
            setInspections(response.inspections)
        }
        setLoading(false);
    }

    function handleTryAgain(){
        setIsError(false);
        setLoading(true);
        setTimeout(() => handleGetInspections(), 500)
    }

    if(isError){
        return(
            <div className="flex flex-col mt-10">
                <p className="text-white">{t('erroNaBuscaDeDados')}</p>

                <button
                    className="w-fit bg-blue-500 rounded-md text-white font-semibold h-12 px-5 mt-5"
                    onClick={handleTryAgain}
                >
                    {t('tentarNovamente')}
                </button>
            </div>
        )
    }

    if(loading){
        return (
            <ActivityIndicator size={50}/>
        )
    }

    return(
        <div className="flex flex-col mt-5 w-full">
            {inspections.length === 0 ? (
                <div>
                    <p className="text-white">Nenhuma inspeção para ser mostrada</p>
                </div>
            ) : (
                <div>
                    <p className="text-white">Visualização disponível em breve</p>
                </div>
            )}
        </div>
    )
}