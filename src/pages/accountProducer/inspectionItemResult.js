import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {format} from 'date-fns';

export function InspectionItemResult({data}){
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    console.log(data)
    return(
        <div className='flex flex-col w-full mb-5'>
            <div 
                className='flex items-center justify-between w-full h-16 bg-[#ff9900] p-3 rounded-t-md cursor-pointer'
                onClick={() => setOpen(!open)}
            >
                <div className='flex items-center gap-5'>
                    {open ? (
                        <AiFillCaretUp size={30} color='white'/>
                    ) : (
                        <AiFillCaretDown size={30} color='white'/>
                    )}

                    <p className='font-bold text-white'>{t('Result')} {t('Inspection')} #{data.id}</p>     
                </div>
                <div className='hidden lg:w-[400px] lg:flex flex-col'>
                    <p className='font-bold text-white'>{t('Activist')} {t('Wallet')}:</p>
                    <p className=' text-white'>{data.acceptedBy}</p>
                </div>
            </div>

            {open && (
                <div className='p-2 bg-white w-full flex flex-col'>
                    <div className='flex items-center justify-center lg:w-52 bg-[#0A4303] p-2 rounded-md'>
                        <p className='font-bold text-white'>ISA {t('Score')}: {data?.isaScore}</p>
                    </div>
                    
                    <p className='font-bold text-black mt-2'>{t('Created At')}: <span className='font-normal'>{data.createdAtTimestamp}</span></p>
                    <p className='font-bold text-black'>{t('Accepted At')}: <span className='font-normal'>{data.acceptedAtTimestamp}</span></p>
                    <p className='font-bold text-black'>{t('Inspected At')}: <span className='font-normal'>{data.inspectedAtTimestamp}</span></p>
                </div>
            )}
        </div>
    )
}