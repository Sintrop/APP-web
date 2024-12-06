import React from "react";
import { ContributionProps } from "../../../../../types/developer";
import {LuFileSpreadsheet} from 'react-icons/lu';
import { useNavigate } from "react-router";

interface Props{
    contribution: ContributionProps;
}

export function ReportItem({contribution}: Props){
    const navigate = useNavigate();

    function navigateToProfile(){
        navigate(`/user-details/${contribution.developer}`);
    }

    return(
        <div className="w-full bg-container-primary p-3 gap-3 rounded-md flex items-center">
            <LuFileSpreadsheet color='white' size={50}/>
            <div className="flex flex-col">
                <p className="text-white">Desenvolvedor: 
                    <span 
                        className="text-blue-400 underline cursor-pointer ml-1"
                        onClick={navigateToProfile}
                    >
                        {contribution.developer}
                    </span>
                </p>

                <p className="text-white">Era: <span className="font-bold">{contribution.era}</span></p>
                <p className="text-white">Bloco: <span className="font-bold">{contribution.createdAtBlockNumber}</span></p>
                <p className="text-white">Validações recebidas: <span className="font-bold">{contribution.validationsCount}</span></p>
                <p className="text-white">Relatório: <a className="text-blue-400 underline" href={`https://ipfs.io/ipfs/${contribution.report}`} target="_blank">{contribution.report}</a></p>
            </div>
        </div>
    )
}