import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './loadingTransaction.css';
import { useTranslation } from 'react-i18next';

export function LoadingTransaction({loading, logTransaction}){
    const {t} = useTranslation();
    
    return(
        <Dialog.Portal className='loading-transaction__portal'>
            <Dialog.Overlay className='loading-transaction__overlay'/>
            <Dialog.Content className='loading-transaction__content'>
                <Dialog.Title className='loading-transaction__title'>
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
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}