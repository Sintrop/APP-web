import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { MdClose } from "react-icons/md";

export function ViewImageMessage({uri}){
    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0 z-40'/>
            <Dialog.Content className='absolute flex flex-col rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 z-50'>
                <img
                    src={uri}
                    className="w-full h-full object-contain"    
                />

                <Dialog.Close
                    className="absolute right-6 top-6"
                >
                    <MdClose size={40} color='white'/>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
}