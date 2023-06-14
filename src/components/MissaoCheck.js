import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMainContext } from '../hooks/useMainContext';
import { api } from '../services/api';

export function MissaoCheck({action}){
    const {user, userData, getUserDataApi} = useMainContext();

    useEffect(() => {
        attLevel();
    },[action])

    async function attLevel(){
        if(user === '1'){
            if(userData?.level === 1){
                await api.put('/user/level',{
                    id: userData?.id,
                    level: 2
                })
                getUserDataApi();
            }
        }
        if(user === '2'){
            if(userData?.level === 1){
                await api.put('/user/level',{
                    id: userData?.id,
                    level: 2
                })
                getUserDataApi();
            }
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='fixed flex flex-col items-center justify-between pb-3 lg:w-[500px] h-[580px] bg-green-950 rounded-md m-2 lg:m-auto inset-0 border-2 border-[#ff9900] p-4'>
                <img
                    src={require('../assets/logo-branco.png')}
                    className='w-[120px] object-contain'
                />

                {action === 'register' && (
                    <img
                        src={require('../assets/tutorial-registro-8.png')}
                        className='w-full h-[450px] object-contain'
                    />
                )}

                {user === '1' && (
                    <>
                        {userData?.level === 1 && (
                            <img
                                src={require('../assets/tutorial-req-inspection-6.png')}
                                className='w-full h-[450px] object-contain'
                            />
                        )}
                    </>
                )}

                {user === '2' && (
                    <>
                        {userData?.level === 1 && (
                            <img
                                src={require('../assets/tutorial-accept-inspection-4.png')}
                                className='w-full h-[450px] object-contain'
                            />
                        )}
                    </>
                )}

                <Dialog.Close
                    className='px-3 py-2 bg-[#ff9900] font-bold text-white rounded-md'
                >
                    Continuar a regeneração
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
}