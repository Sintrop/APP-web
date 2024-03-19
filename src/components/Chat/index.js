import React, {useEffect, useState} from 'react';
import {BsFillChatDotsFill} from 'react-icons/bs';
import {FaChevronUp, FaChevronDown} from 'react-icons/fa';
import { useMainContext } from '../../hooks/useMainContext';

export function Chat(){
    const {walletConnected} = useMainContext();
    const [open, setOpen] = useState(false);

    return(
        <div className='absolute right-5 bottom-0'>
            <div className={`flex flex-col rounded-t-md w-[300px] bg-[#0a4303] ${open ? 'h-[500px]' : 'h-[50px]'} duration-200`}>
                <div className='flex h-[50px] border-b border-green-700 px-3 items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsFillChatDotsFill color='white' size={25} />

                        <p className='font-bold text-white'>Chat</p>
                    </div>

                    <button onClick={() => setOpen(!open)}>
                        {open ? <FaChevronDown color='white' size={20}/> : <FaChevronUp color='white' size={20}/>}
                    </button>
                </div>

                {open && (
                    <>
                    {walletConnected === '' ? (
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <p className='text-white font-bold'>Você não está conectado!</p>
                        </div>
                    ) : (
                        <div>

                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    )
}