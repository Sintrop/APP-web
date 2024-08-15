import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../../../../../services/api';
import { useTranslation } from 'react-i18next';
import Loading from '../../../../../../components/Loading';

export function ModalConfirmAssign({data, close, success}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);

    async function handleAssign(){
        try{
            setLoading(true);
            const updatedFeedback = await api.put('/feedback/assign', {
                id: data.id,
                wallet: data.wallet,
            })
            close();
            success(updatedFeedback.data.feedbackUpdated);
        }catch(err){
            console.log(err)
            toast.error(t('algoDeuErrado'))
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
                    <Dialog.Title className='font-bold text-white'>{t('atribuirTask')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <p className='text-white text-center'>{t('desejaSerResponsavelTask')}?</p>

                <div className='flex items-center justify-between w-full'>
                    <Dialog.Close
                        className='p-3 text-white font-bold'
                    >
                        {t('cancelar')}
                    </Dialog.Close>

                    <button
                        className='px-3 py-2 text-white font-bold rounded-md bg-[#ff9900]'
                        onClick={handleAssign}
                    >   
                        {t('atribuir')}
                    </button>
                </div>
            </Dialog.Content>

            <ToastContainer
                position='top-center'
            />

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}