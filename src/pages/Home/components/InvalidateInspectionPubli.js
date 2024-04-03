import React from "react";
import { useNavigate } from "react-router";

export function InvalidateInspectionPubli({additionalData}){
    const navigate = useNavigate();

    return(
        <div>
            <p className="text-white">Votou para invalidar a inspeção <span className="font-bold text-green-600">#{additionalData?.inspection?.id}</span></p>

            <p className="mt-3 text-xs text-gray-400">Justificativa:</p>
            <p className="text-white">{additionalData?.justification}</p>

            <button
                className="w-fit px-3 py-1 bg-blue-600 rounded-md text-white font-bold mt-3"
                onClick={() => navigate(`/result-inspection/${additionalData?.inspection?.id}`)}
            >
                Ver inspeção
            </button>
        </div>
    )
}