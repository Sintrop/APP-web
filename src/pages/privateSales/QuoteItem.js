import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalReserve } from './ModalReserve';

export function QuoteItem({data, index, attQuots}){
    const {t} = useTranslation();
    const [modalReserve, setModalReserve] = useState(false);

    return(
        <div className={`flex flex-col justify-between p-3 rounded-md w-60 h-32 ${data.reservedBy ? 'bg-[#7C3C3C]' : 'bg-[#2F6394]'}`}>
            <p className="font-bold text-white text-center">{t('Quot')} {index}</p>

            {data.reservedBy ? (
                <div className='w-full h-12 bg-gray-400 font-bold rounded-md text-green-700 px-1 items-center flex flex-col'>
                    <p className='text-white'>Reserved by:</p>
                    <p className='text-white max-w-[20ch] overflow-hidden text-ellipsis'>{JSON.parse(data.reservedBy).wallet}</p>
                </div>
            ) : (
                <button
                    className='w-full h-10 bg-[#F4DF22] font-bold rounded-md text-green-700'
                >
                    {t('Avaliable')}
                </button>
            )}
        </div>
    )
}