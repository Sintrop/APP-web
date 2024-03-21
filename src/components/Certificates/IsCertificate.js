import React, {useEffect, useState} from "react";
import {FaClock, FaCheck, FaRegWindowClose} from 'react-icons/fa';

export function IsCertified({producer}){
    const [status, setStatus] = useState(0);

    useEffect(() => {
        if(producer?.totalInspections < 3) {
            setStatus(0);
        }else{
            if(producer?.isa?.isaScore > 0){
                setStatus(1)
            }else{
                setStatus(2)
            }
        }
    }, [producer]);

    return(
        <div className={`flex items-center gap-1 rounded-md p-1 w-fit ${status === 2 ? 'bg-red-500' : 'bg-[#0a4303]'}`}>
            {status === 0 && (
                <>
                <FaClock size={20} color='white' />
                <p className="text-white font-bold text-xs">Certificação em andamento</p>
                </>
            )}

            {status === 1 && (
                <>
                <FaCheck size={20} color='white' />
                <p className="text-white font-bold text-xs">Produtor aprovado</p>
                </>
            )}

            {status === 2 && (
                <>
                <FaRegWindowClose size={20} color='white' />
                <p className="text-white font-bold text-xs">Produtor reprovado</p>
                </>
            )}
        </div>
    )
}