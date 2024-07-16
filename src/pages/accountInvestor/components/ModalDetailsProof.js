import React from "react";
import { MdClose } from "react-icons/md";
import { ProofReduce } from "../../Home/components/PublicationItem/ProofReduce";

export function ModalDetailsProof({close, data}){
    return(
        <div className='flex justify-center items-center inset-0 z-50 absolute'>
            <div className='bg-black/90 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col items-center justify-center m-auto inset-0 p-2'>
                <ProofReduce data={data}/>
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