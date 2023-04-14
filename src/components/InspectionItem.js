import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export function InspectionItem({data, type}){
    const {t} = useTranslation();
   
    return(
        <div className="flex items-center w-full py-2 gap-3 bg-[#0a4303]">
            <div className='flex items-center lg:w-[300px] bg-[#0A4303] px-2'>
                <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.createdBy}</p>
            </div>

            {type === 'manage' && (
                <div className='flex items-center h-full w-full bg-[#0A4303]'>
                    <p className='text-white'>Cidade - BR, Complemento</p>
                </div>
            )}

            <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.acceptedBy}</p>
            </div>

            <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                <p className='text-white '>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
            </div>

            {type === 'manage' && (
                <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white'>0 Blocks to expire</p>
                </div>
            )}

            <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                {data.status === '0' && (
                    <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#F4A022]'>
                        <p className='text-xs text-white font-bold'>{t('OPEN')}</p>
                    </div>
                )}

                {data.status === '1' && (
                    <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#3E9EF5]'>
                        <p className='text-xs text-white font-bold'>{t('ACCEPTED')}</p>
                    </div>
                )}

                {data.status === '2' && (
                    <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#2AC230]'>
                        <p className='text-xs text-white font-bold'>{t('INSPECTED')}</p>
                    </div>
                )}

                {data.status === '3' && (
                    <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#C52A15]'>
                        <p className='text-xs text-white font-bold'>{t('EXPIRED')}</p>
                    </div>
                )}
            </div>
            
            {type === 'history' && (
                <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white'>{data.isaScore}</p>
                </div>
            )}

            <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                <p className='text-white'>Actions</p>
            </div>
        </div>
    )
}