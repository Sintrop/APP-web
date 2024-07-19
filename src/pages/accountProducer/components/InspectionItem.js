import React, {useEffect, useState} from "react";
import { Inspection } from "../../ResultInspection/components/Inspection";
import { ActivityIndicator } from "../../../components/ActivityIndicator";

export function InspectionItem({inspectionId, index}){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, index * 15000);
    }, []);

    return(
        <div className="flex flex-col w-full border border-white rounded-md p-1">
            {loading ? (
                <div className="flex flex-col items-center my-5">
                    <ActivityIndicator size={40}/>
                    <p className="font-bold text-white">Carregando dados...</p>
                </div>
            ) : (
                <Inspection id={inspectionId}/>
            )}
        </div>
    )
}