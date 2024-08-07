import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../../../../../services/api';
import Loading from '../../../../../../components/Loading';

export function ModalConfirmDiscard({data, close, success}){
    const [loading, setLoading] = useState(false);

    async function handleAssign(){
        try{
            setLoading(true);
            const updatedFeedback = await api.put('/feedback/status', {
                id: data.id,
                status: 3,
            })
            success(updatedFeedback.data.feedbackUpdated);
            close();
        }catch(err){
            console.log(err)
            toast.error('Algo deu errado, tente novamente!')
        }finally{
            setLoading(false)
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-black/60 fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[300px] h-[250px] bg-black rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between mb-5'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Descartar</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <p className='text-white text-center'>Deseja descartar a task?</p>

                <div className='flex items-center justify-between w-full'>
                    <Dialog.Close
                        className='p-3 text-white font-bold'
                    >
                        Cancelar
                    </Dialog.Close>

                    <button
                        className='px-3 py-2 text-white font-bold rounded-md bg-blue-500'
                        onClick={handleAssign}
                    >   
                        Descartar
                    </button>
                </div>
            </Dialog.Content>

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}