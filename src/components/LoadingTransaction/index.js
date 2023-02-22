import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './loadingTransaction.css';

export function LoadingTransaction({loading, logTransaction}){
    
    return(
        <Dialog.Portal className='loading-transaction__portal'>
            <Dialog.Overlay className='loading-transaction__overlay'/>
            <Dialog.Content className='loading-transaction__content'>
                <Dialog.Title className='loading-transaction__title'>
                    {loading && 'Your transaction is being processed... Be patient, this transaction can take a few minutes'}
                    {!loading && logTransaction.type === 'error' && 'Transaction error'}
                    {!loading && logTransaction.type === 'success' && 'Successful transaction'}
                </Dialog.Title>

                {!loading && logTransaction.type === 'error' && (
                    <p className="loading-transaction__error-log">{logTransaction.message}</p>
                )}
                {!loading && logTransaction.type === 'success' && (
                    <div className="loading-transaction__area-success">
                        <p>Click to view transaction details</p>
                        <a target='_blank' href={`https://goerli.etherscan.io/tx/${logTransaction.hash}`}>
                            {logTransaction.hash}
                        </a>
                    </div>
                )}

                {!loading && (
                    <Dialog.Close>Close</Dialog.Close>
                )}
            </Dialog.Content>
        </Dialog.Portal>
    )
}