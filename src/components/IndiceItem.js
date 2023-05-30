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

            <div className={`${open ? 'flex' : 'hidden'} flex-col lg:flex-row items-center gap-1 lg:h-[275px] mb-10`}>
                <div className="flex items-center lg:p-5 w-full lg:w-[180px] h-full bg-[#0A4303] border-2">
                    <p className="text-white text-center">{data.description}</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col w-full lg:w-[250px] h-full gap-1">
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#783E19] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Regenerative 3')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#A75722] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Regenerative 2')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#C66828] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Regenerative 1')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E79F34] rounded-sm border-2">
                            <p className="text-white text-center text-sm">Neutro</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E3BB4E] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Not Regenerative 1')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#c0ac74] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Not Regenerative 2')}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#cbc2a9] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{t('Not Regenerative 3')}</p>
                        </div>

                    </div>

                    <div className="flex flex-col w-full lg:w-[200px] h-full gap-1">
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.regenerative3}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.regenerative2}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.regenerative1}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.neutro}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.notRegenerative1}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.notRegenerative2}</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#0A4303] rounded-sm border-2">
                            <p className="text-white text-center text-sm">{data.notRegenerative3}</p>
                        </div>

                    </div>

                    <div className="flex flex-col w-full lg:w-[50px] h-full gap-1">
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#783E19] rounded-sm border-2">
                            <p className="text-white text-center text-sm">+20</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#A75722] rounded-sm border-2">
                            <p className="text-white text-center text-sm">+10</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#C66828] rounded-sm border-2">
                            <p className="text-white text-center text-sm">+5</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E79F34] rounded-sm border-2">
                            <p className="text-white text-center text-sm">0</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#E3BB4E] rounded-sm border-2">
                            <p className="text-white text-center text-sm">-5</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#c0ac74] rounded-sm border-2">
                            <p className="text-white text-center text-sm">-10</p>
                        </div>
                        <div className="flex w-full h-12 lg:h-9 items-center justify-center bg-[#cbc2a9] rounded-sm border-2">
                            <p className="text-white text-center text-sm">-20</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}