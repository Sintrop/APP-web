import React from "react";
import { ToastContainer, toast } from "react-toastify";

export function ModalTransactionCreated({close}){
    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>

            <div className='absolute flex flex-col justify-between p-3 lg:w-[400px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <p className="font-bold text-white text-center">Solicitação registrada</p>
                <p className="text-white text-center text-sm">Para confirmar essa ação, você deve agora entrar no Metamask Mobile ou algum navegador com provedor Ethereum, sicronizar com sua carteira, e confirmar a transação.</p>
                
                <div className="flex justify-center w-full">
                    <video
                        src={require('../../assets/gif-checkout.mp4')}
                        className="w-[150px] h-[300px]"
                        autoPlay 
                        loop={true}
                    />
                </div>

                <div className="flex items-center justify-center flex-col gap-2">
                    <button
                        className="text-white font-bold px-3 py-2 rounded-md bg-blue-600"
                        onClick={async() => {
                            await navigator.clipboard.writeText('https://v5-sintrop.netlify.app/checkout')
                            toast.success('Link copiado para a área de transferência!')
                        }}
                    >
                        Copiar link
                    </button>

                    <button
                        className="text-white font-bold"
                        onClick={close}
                    >Entendi</button>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}