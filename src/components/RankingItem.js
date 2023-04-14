import React from 'react';
import { useTranslation } from 'react-i18next';

export function RankingItem({data, position}){
    const {t} = useTranslation();
    console.log(data)
    return(
        
            <div className="flex flex-col w-[300px] h-[400px] bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md">
                <img
                    src={require('../assets/ex-producer.png')}
                    className='w-full h-[250px] object-cover rounded-t-md'
                />

                <div className="flex flex-col w-full py-1 items-center">
                    <p className='font-bold text-center text-lg text-white'>{data?.name}</p>

                    {data?.userType === '1' && (
                        <>
                            <p className='text-xs text-center text-white'>{data?.producerWallet}</p> 
                            <p className='font-bold text-center text-white mt-3'>{t('Inspections Reiceved')}: {data?.totalInspections}</p> 
                            <p className='font-bold text-center text-white'>ISA {t('Score')}: {data?.isa?.isaScore}</p>
                            <p className='font-bold text-center text-white'>ISA {t('Average')}: {data?.isa?.isaAverage}</p>  
                        </>
                    )}

                    {data?.userType === '2' && (
                        <>
                            <p className='text-xs text-center text-white'>{data?.activistWallet}</p> 
                            <p className='font-bold text-center text-white mt-3'>{t('Inspections Realized')}: {data?.totalInspections}</p> 
                            <p className='font-bold text-center text-white'>{t('Give Ups')}: {data?.giveUps}</p>
                            <p className='font-bold text-center text-white'>.</p>  
                        </>
                    )}

                    {data?.userType === '3' && (
                        <>
                            <p className='text-xs text-center text-white'>{data?.researcherWallet}</p> 
                            <p className='font-bold text-center text-white mt-3'>{t('Published Works')}: {data?.publishedWorks}</p>
                            <p className='font-bold text-center text-white'>.</p>
                            <p className='font-bold text-center text-white'>.</p> 
                        </>
                    )}
                </div>
                {position === 1 && (
                    <img
                        src={require('../assets/med-ouro.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-387px] ml-[-10px]'
                    />
                )}
                {position === 2 && (
                    <img
                        src={require('../assets/med-prata.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-387px] ml-[-10px]'
                    />
                )}

                {position === 3 && (
                    <img
                        src={require('../assets/med-bronze.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-387px] ml-[-10px]'
                    />
                )}
            </div>
    )
}