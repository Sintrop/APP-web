import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './loadingTransaction.css';
import { useTranslation } from 'react-i18next';

export function LoadingTransaction({loading, logTransaction}){
    const {t} = useTranslation();
    const [count, setCount] = useState(1);

    useEffect(() => {
        if(count === 5){
            setTimeout(() => setCount(1), 1000)
            return;
        }
        setTimeout(() => setCount(count + 1), 1000)
    },[count]);
    
    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-center rounded-md m-auto inset-0 bg-folha-papiro bg-no-repeat bg-center bg-contain md:w-[450px] px-5'>

                <div className='flex flex-col absolute items-center h-[300px]'>
                    <img
                        src={require('../../assets/logo-cinza.png')}
                        className='w-[200px] object-contain'
                    />

                    <Dialog.Title className='font-bold text-black text-center px-5 mt-5'>
                        {loading && `${t('Your transaction is being processed... Be patient, this transaction can take a few minutes')}`}
                        {!loading && logTransaction.type === 'error' && `${t('Transaction error')}`}
                        {!loading && logTransaction.type === 'success' && `${t('Successful transaction')}`}
                    </Dialog.Title>

                    {loading && (
                        <p className="font-bold text-3xl w-20">
                            {count === 1 && '.'}
                            {count === 2 && '. .'}
                            {count === 3 && '. . .'}
                            {count === 4 && '. . . .'}
                            {count === 5 && '. . . . .'}
                        </p>
                    )}

                    {!loading && logTransaction.type === 'error' && (
                        <p className="font-bold text-red-500 text-center px-5">{t(`${logTransaction.message}`)}</p>
                    )}

                    {!loading && logTransaction.type === 'success' && (
                        <div className="flex flex-col mt-5">
                            <p>{t('Click to view transaction details')}</p>
                            <a 
                                target='_blank' 
                                href={`https://goerli.etherscan.io/tx/${logTransaction.hash}`}
                                className='max-w-[35ch] overflow-hidden text-ellipsis underline-offset-2 text-blue-500 border-b-2 border-blue-500'
                            >
                                {logTransaction.hash}
                            </a>
                        </div>
                    )}

                    {!loading && (
                        <Dialog.Close className='px-5 py-2 bg-[#ff9900] rounded-md font-bold text-white mt-5'>
                            {t('Close')}
                        </Dialog.Close>
                    )}
                </div>
                
                {/* <Dialog.Title className='loading-transaction__title'>
                    {loading && `${t('Your transaction is being processed... Be patient, this transaction can take a few minutes')}`}
                    {!loading && logTransaction.type === 'error' && `${t('Transaction error')}`}
                    {!loading && logTransaction.type === 'success' && `${t('Successful transaction')}`}
                </Dialog.Title>

                {!loading && logTransaction.type === 'error' && (
                    <p className="loading-transaction__error-log">{t(`${logTransaction.message}`)}</p>
                )}
                {!loading && logTransaction.type === 'success' && (
                    <div className="loading-transaction__area-success">
                        <p>{t('Click to view transaction details')}</p>
                        <a target='_blank' href={`https://goerli.etherscan.io/tx/${logTransaction.hash}`}>
                            {logTransaction.hash}
                        </a>
                    </div>
                )}

                {!loading && (
                    <Dialog.Close>{t('Close')}</Dialog.Close>
                )} */}
            </Dialog.Content>
        </Dialog.Portal>
    )
}