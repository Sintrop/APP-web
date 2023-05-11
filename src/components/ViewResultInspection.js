import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { InspectionItemResult } from '../pages/accountProducer/inspectionItemResult';
import {AiOutlineClose} from 'react-icons/ai';

export function ViewResultInspection({data}){
    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col p-3 lg:w-[1000px] lg:h-[600px] bg-white rounded-md m-auto inset-0'>
                <div className='flex items-center w-full justify-between'>
                    <div/>
                    <Dialog.Title className='font-bold text-center text-xl mb-3'>Resultado inspeção</Dialog.Title>
                    <Dialog.Close>
                        <AiOutlineClose size={25} color='black'/>
                    </Dialog.Close>
                </div>
                <div className='flex flex-col overflow-auto'>
                    <InspectionItemResult
                        data={data}
                        initialVisible={true}
                    />
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}