import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './loadingTransaction.css';
import { useTranslation } from 'react-i18next';
import { MissaoCheck } from '../MissaoCheck';
import { useMainContext } from '../../hooks/useMainContext';
import Loader from '../Loader';
import format from 'date-fns/format';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export function LoadingTransaction({loading, logTransaction, action}){
    const {userData} = useMainContext();
    const {t} = useTranslation();
    const [count, setCount] = useState(1);
    const [missaoCheck, setMissaoCheck] = useState(false);

    useEffect(() => {
        if(!loading && logTransaction.type === 'success'){
            
        }
    }, [logTransaction])
    
    return(
        <Dialog.Portal className='flex justify-center items-center inset-0 z-50'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center bg-[#0a4303] h-[400px] rounded-md m-auto inset-0 md:w-[400px] px-5 z-50'>

                <div className='flex flex-col p-3 justify-between h-full w-full'>

                    <div className='flex flex-col items-center w-full'>
                        <img
                            src={require('../../assets/logo-branco.png')}
                            className='w-[150px] object-contain'
                        />
                    </div>

                    <div>
                        <Dialog.Title className='font-bold text-white text-center px-5 my-5'>
                            {loading && `${t('Your transaction is being processed... Be patient, this transaction can take a few minutes')}`}
                            {!loading && logTransaction.type === 'error' && `${t('Transaction error')}`}
                            {!loading && logTransaction.type === 'success' && `${t('Successful transaction')}`}
                        </Dialog.Title>

                        {!loading && logTransaction.type === 'error' && (
                            <p className="font-bold text-red-500 text-center px-5">{t(`${logTransaction.message}`)}</p>
                        )}

                        {!loading && logTransaction.type === 'success' && (
                            <div className="flex flex-col mt-5 w-full">
                                <p className="text-gray-300">Hash da transação:</p>
                                <a 
                                    target='_blank' 
                                    href={`https://sepolia.etherscan.io/tx/${logTransaction.hash}`}
                                    className='max-w-[40ch] overflow-hidden text-ellipsis underline-offset-2 text-blue-500 border-b-2 border-blue-500'
                                    >
                                    {logTransaction.hash}
                                </a>

                                <p className="text-gray-300 mt-3">Horário e data:</p>
                                <p className="text-white">{format(new Date(), 'dd/MM/yyyy - kk:mm')}</p>
                            </div>
                        )}
                    </div>

                    {loading && (
                        <Loader
                            type='hash'
                            color='white'
                            noText   
                        />
                    )}

                    {!loading && (
                        <Dialog.Close className='px-5 py-2 bg-[#2066CF] rounded-md font-bold text-white mt-5'>
                            {t('Close')}
                        </Dialog.Close>
                    )}
                </div>
            </Dialog.Content>

            <Dialog.Root
                open={missaoCheck}
                onOpenChange={(open) => setMissaoCheck(open)}
            >
                <MissaoCheck
                    action={action}
                />
            </Dialog.Root>

            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}