import React from 'react';
import { useTranslation } from 'react-i18next';
import {TiWarning} from 'react-icons/ti';

export function Warning({message, width}){
    const {t} = useTranslation();
    return(
        <div className={`rounded-md p-2 lg:mt-5 bg-red-600 w-[${width}px]`}>
            <div className="flex items-center gap-2">
                <TiWarning size={18} color='white'/>
                <p className='font-bold text-white'>{t('Attention')}</p>
            </div>

            <p className='font-bold text-white lg:mt-1'>
                {t(`${message}`)}
            </p>
        </div>
    )
}