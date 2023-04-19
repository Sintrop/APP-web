import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';

export function IndiceItem({data}){
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);

    return(
        <div className="lg:w-[690px] flex flex-col gap-[1px]">
            <div 
                className="w-full h-12 flex cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center justify-center w-10 h-10 bg-[#783E19] border-2">
                    <p className="font-bold text-white">#{data.id}</p>
                </div>
                <div className="flex items-center justify-center w-full h-10 bg-[#0A4303] border-2 border-r-0 ">
                    <p className="font-bold text-white">{data.name}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-[#0A4303] border-2 border-l-0">
                    {open ? (
                        <AiFillCaretUp
                            size={30}
                            color='white'
                        />
                    ) : (
                        <AiFillCaretDown
                            size={30}
                            color='white'
                        />
                    )}
                </div>
            </div>

            <div className={`${open ? 'flex' : 'hidden'} flex-col lg:flex-row items-center gap-1 lg:h-[195px] mb-10`}>
                <div className="flex items-center lg:p-5 w-full lg:w-[180px] h-full bg-[#0A4303] border-2">
                    <p className="text-white text-center">{data.description}</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col w-full lg:w-[250px] h-full gap-1">
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#783E19] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Totally Sustainable')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#A75722] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Partially Sustainable')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#C66828] rounded-sm border-2">
                            <p className="text-white text-center text-sm">Neutro</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E79F34] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Partially Not Sustainable')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E3BB4E] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Totally Not Sustainable')}</p>
                        </div>

                    </div>

                    <div className="flex flex-col w-full lg:w-[250px] h-full gap-1">
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.totallySustainable}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.partiallySustainable}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.neutro}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.partiallyNotSustainable}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.totallyNotSustainable}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}