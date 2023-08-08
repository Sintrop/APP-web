import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {IoMdClose} from 'react-icons/io';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../hooks/useMainContext';
import { NotificationItem } from './NotificationItem';
import { api } from '../services/api';

export function ModalNotifications({user, walletConnected, close}){
    const {t} = useTranslation();
    const {notifications, getNotifications} = useMainContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleAllVisualized(){
        return;
        try{
            
        }catch(err){

        }finally{

        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'> 
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] lg:bg-transparent fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between lg:w-[350px] h-[200px] bg-[#0a4303] rounded-md m-auto lg:m-0 inset-0 lg:inset-x-[77vw] lg:inset-y-12 border-2'>
                <div className="flex items-center justify-between w-full px-3">
                    <div className="w-[20px]"/>
                    <Dialog.Title className="text-white">{t('Notifications')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdClose size={20} color='white'/>
                    </Dialog.Close>
                </div>

                <div className="flex flex-col w-full h-[150px] overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md mt-1">
                    {notifications.length > 0 ? (
                        <>
                        {notifications.map(item => (
                            <NotificationItem
                                data={item}
                            />
                        ))}
                        </>
                    ) : (
                        <p className='text-white text-center mt-10'>Nenhuma notificação</p>
                    )}
                </div>

                <div className='flex w-full h-10 border-t-2 border-green-950'>
                    <button className='flex items-center justify-center font-bold text-white gap-1 w-[50%] text-xs hover:bg-green-950 duration-300' onClick={handleAllVisualized}>
                        Marcar como lidas
                    </button>
                    <button className='flex items-center justify-center font-bold text-white gap-1 w-[50%] text-xs hover:bg-green-950 duration-300'>
                        Excluir todas
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}