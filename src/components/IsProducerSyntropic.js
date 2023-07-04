import React, {useState, useEffect} from "react";
import {FaClock, FaCheck} from 'react-icons/fa';
import {RiCloseCircleLine} from 'react-icons/ri';
import { useTranslation } from "react-i18next";

export function IsProducerSyntropic({data}){
    const {t} = useTranslation();
    const [status, setStatus] = useState('0');

    useEffect(() => {
        if(Number(data.totalInspections) < 3){
            setStatus('0');
        }
        if(Number(data.totalInspections) >= 3 && Number(data.isa?.isaScore) > 0){
            setStatus('1');
        }
        if(Number(data.totalInspections) >= 3 && Number(data.isa?.isaScore) <= 0){
            setStatus('2');
        }
    },[data]);

    return(
        <div className={`px-4 py-2 flex items-center gap-1 rounded-md ${status === '0' && 'bg-yellow-600 w-[250px]'} ${status === '1' && 'bg-[#0a4303] w-[200px]'} ${status === '2' && 'bg-red-500 w-[200px]'}`}>
            {status === '0' && (<FaClock color='white' size={20}/>)}
            {status === '1' && (<FaCheck color='white' size={20}/>)}
            {status === '2' && (<RiCloseCircleLine color='white' size={20}/>)}
            <p className="font-bold text-white text-sm">
                {status === '0' && `${t('Certification in progress')}`}
            </p>
            <p className="font-bold text-white text-sm">
                {status === '1' && `${t('Certified Producer')}`}
            </p>
            <p className="font-bold text-white text-sm">
                {status === '2' && `${t('Failed Producer')}`}
            </p>
        </div>
    )
}