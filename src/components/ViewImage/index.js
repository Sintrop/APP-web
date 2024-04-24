import React from "react";
import {MdClose} from 'react-icons/md';

export function ViewImage({close, uri}){
    return(
        <div className='flex justify-center items-center inset-0 z-50'>
            <div className='bg-black/90 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col items-center justify-center m-auto inset-0 p-2'>
                <img
                    src={uri}
                    className="w-full lg:max-w-[500px] h-full lg:max-h-[700px] object-contain"
                />
            </div>

            <button
                className="absolute top-3 right-3 lg:top-7 lg:right-10 text-white"
                onClick={close}
            >
                <MdClose color='white' size={40}/>
            </button>
        </div>
    )
}