import React from 'react';
import { useTranslation } from 'react-i18next';

export function IndiceItem({data}){
    const {t} = useTranslation();
    
    return(
        <div className="lg:w-[690px] flex flex-col gap-[1px] mb-10">
            <div className="w-full h-12 flex">
                <div className="flex items-center justify-center w-10 h-10 bg-[#783E19] border-2">
                    <p className="font-bold text-white">#{data.id}</p>
                </div>
                <div className="flex items-center justify-center w-full h-10 bg-[#0A4303] border-2">
                    <p className="font-bold text-white">{data.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-1 h-[195px]">
                <div className="flex items-center p-5 lg:w-[180px] h-full bg-[#0A4303] border-2">
                    <p className="text-white">{data.description}</p>
                </div>
                <div className="flex flex-col w-[250px] h-full gap-1">
                    <div className="flex w-full h-9 items-center justify-center bg-[#783E19] rounded-sm border-2">
                        <p className="text-white">{t('Totally Sustainable')}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#A75722] rounded-sm border-2">
                        <p className="text-white">{t('Partially Sustainable')}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#C66828] rounded-sm border-2">
                        <p className="text-white">Neutro</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#E79F34] rounded-sm border-2">
                        <p className="text-white">{t('Partially Not Sustainable')}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#E3BB4E] rounded-sm border-2">
                        <p className="text-white">{t('Totally Not Sustainable')}</p>
                    </div>

                </div>

                <div className="flex flex-col w-[250px] h-full gap-1">
                    <div className="flex w-full h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                        <p className="text-white">{data.totallySustainable}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                        <p className="text-white">{data.partiallySustainable}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                        <p className="text-white">{data.neutro}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                        <p className="text-white">{data.partiallyNotSustainable}</p>
                    </div>
                    <div className="flex w-full h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                        <p className="text-white">{data.totallyNotSustainable}</p>
                    </div>

                </div>
            </div>
        </div>
    )
}