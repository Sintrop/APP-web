import React from "react";

export function ModalConfimation({close, data, accept}){
    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col items-center justify-center p-3 lg:w-[320px] lg:h-[250px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-50'>
                <p className="text-center text-white font-semibold">{data?.title}</p>
                <p className="text-center text-white font-semibold mt-3">{data?.description}</p>
                <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                        onClick={close}
                        className="text-white font-semibold text-center py-2 w-[50%] bg-gray-400 rounded-md px-10"
                    >
                        {data?.titleButtonDiscord}
                    </button>

                    <button
                        onClick={() => accept(data?.action)}
                        className="text-white font-semibold text-center py-2 w-[50%] bg-blue-500 rounded-md px-10"
                    >
                        {data?.titleButtonAccept}
                    </button>
                </div>
            </div>
        </div>
    )
}