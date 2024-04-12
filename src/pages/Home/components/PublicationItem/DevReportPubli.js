import React from "react";
import { useNavigate } from "react-router";

export function DevReportPubli({additionalData}){
    const navigate = useNavigate();

    return(
        <div>
            <p className="text-white">Enviou o relatório de contribuição e subiu de nível</p>

            <div className="items-center flex flex-col mt-3">
                <a
                    href={`https://app.sintrop.com/view-pdf/${additionalData?.report}`}
                    className="px-4 py-1 rounded-md bg-blue-500 font-bold text-white text-sm"
                    target="_blank"
                >
                    Ver relatório
                </a>
            </div>
        </div>
    )
}