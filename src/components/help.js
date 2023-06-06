import React from "react";
import { FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export function Help({description}){
    const {t} = useTranslation();

    return(
        <div className="rounded-md p-2 w-[95%] lg:mt-5 bg-[#0a4303]">
            <div className="flex items-center gap-2">
                <FaBook size={18} color='#ff9900'/>
                <p className='font-bold text-[#ff9900]'>{t('Help')}</p>
            </div>

            <p className='font-bold text-white lg:mt-1'>
                {t(`${description}`)}
            </p>
        </div>
    )
}