import React, { useEffect, useState } from "react";
import { getInspectionsValidationCenter } from "../../../../../services/centers/validation/inspection";
import { InspectionProps } from "../../../../../types/inspection";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";

export function InspectionsContentTab(){
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

    if(isError){
        return(
            <div className="flex flex-col mt-10">
                <p className="text-white">Erro na busca de dados</p>
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