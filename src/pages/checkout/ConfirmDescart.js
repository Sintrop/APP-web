import React from 'react';

export function ConfirmDescart({close}){
    return(
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 m-auto"
        >
            <div className="flex flex-col items-center justify-between p-5 w-[250px] h-[250px] bg-[#222831] rounded-lg">
                <h3 className='font-bold text-white text-center text-lg'>Atenção!</h3>

                <p className='text-white text-center'>Você deseja mesmo descartar essa transação? Não é possível desfazer essa ação</p>

                <div className='flex items-center justify-between w-full'>
                    <button
                        className='font-bold text-white'
                        onClick={() => close(false)}
                    >
                        Voltar
                    </button>

                    <button
                        className='font-bold text-white px-3 py-2 bg-[#2c96ff] rounded-lg'
                        onClick={() => close(true)}
                    >
                        Descartar
                    </button>
                </div>
            </div>
        </div>
    )
}