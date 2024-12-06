import React from "react";
import { useMainContext } from "../../../hooks/useMainContext";

interface Props{
    close: () => void;
}

export function ModalChooseLanguage({close}: Props) {
    //@ts-ignore
    const {chooseLanguage} = useMainContext()
    return (
        <div className='flex justify-center items-center inset-0 z-30'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col items-center w-[200px] h-[200px] justify-center p-3 bg-[#0a4303] rounded-md my-auto mx-auto inset-0 border-2 z-50'>
                <p className="text-white font-bold text-center">Select you language</p>
                <button
                    onClick={() => chooseLanguage('pt-BR')}
                    className="flex items-center gap-5 w-full mt-1 hover:bg-green-950 duration-300 py-2 px-2"
                >
                    <img
                        src={require('../../../assets/icon-br.png')}
                        className="w-10 h-7 object-cover"
                        alt='bandeira do brasil'
                    />

                    <p className="font-bold text-white">Português</p>
                </button>

                <button
                    onClick={() => chooseLanguage('en-US')}
                    className="flex items-center gap-5 w-full mt-1 hover:bg-green-950 duration-300 py-2 px-2"
                >
                    <img
                        src={require('../../../assets/icon-brit.png')}
                        className="w-10 h-7 object-cover"
                        alt='bandeira da inglaterra'
                    />

                    <p className="font-bold text-white">English</p>
                </button>

                <button
                    onClick={() => chooseLanguage('es')}
                    className="flex items-center gap-5 w-full mt-1 hover:bg-green-950 duration-300 py-2 px-2"
                >
                    <img
                        src={require('../../../assets/icon-spa.png')}
                        className="w-10 h-7 object-cover"
                        alt='bandeira da espanha'
                    />

                    <p className="font-bold text-white">Español</p>
                </button>
            </div>
        </div>
    )
}