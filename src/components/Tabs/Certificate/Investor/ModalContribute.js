import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './modalContribute.css';
import {GetTokensBalance} from '../../../../services/voteService';
import {BurnTokens} from '../../../../services/sacTokenService';
import Loading from '../../../Loading';
import { LoadingTransaction } from '../../../LoadingTransaction';

export function ModalContribute({wallet, onFinished}){
    const [balanceTokens, setBalanceTokens] = useState(0);
    const [inputTokens, setInputTokens] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    useEffect(() => {
        getTokensWallet();
    },[]);

    async function getTokensWallet(){
        const response = await GetTokensBalance(wallet);
        setBalanceTokens(Number(response) / 10**18);
        console.log(response);
    }

    async function burnTokens(){
        if(balanceTokens === 0){
            //return;
        }
        if(loading){
            return;
        }
        setModalTransaction(true);
        setLoadingTransaction(true);
        BurnTokens(wallet, inputTokens + '000000000000000000')
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Burn amount exceeds balance")){
                setLogTransaction({
                    type: 'error',
                    message: "Burn amount exceeds balance",
                    hash: ''
                })
                return;
            }
            if(message.includes("Burn from the zero address")){
                setLogTransaction({
                    type: 'error',
                    message: "Burn from the zero address",
                    hash: ''
                })
                return;
            }
            if(message.includes("You don't have SAC Tokens")){
                setLogTransaction({
                    type: 'error',
                    message: "You don't have SAC Tokens",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
    }

    return(
        <Dialog.Portal className='modal-contribute__portal'>
            <Dialog.Overlay className='modal-contribute__overlay'/>
            <Dialog.Content className='modal-contribute__content'>
                <Dialog.Title className='modal-contribute__title'>
                    Contribute
                </Dialog.Title>
                <p>Your balance: {balanceTokens} SAC Tokens</p>

                <div className='modal-contribute__container-input'>
                    <p className='modal-contribute__label'>Number of tokens to donate</p>
                    <input
                        className='modal-contribute__input'
                        type='number'
                        value={inputTokens}
                        onChange={(e) => setInputTokens(e.target.value)}
                    />
                </div>

                <div className='modal-contribute__area-btn'>
                    <Dialog.Close className='modal-contribute__btn-close'>Cancel</Dialog.Close>
                    <button 
                        className='modal-contribute__btn-contribute'
                        onClick={burnTokens}    
                    >Contribute</button>
                </div>
            <Dialog.Root 
                open={modalTransaction} 
                onOpenChange={(open) => {
                    if(!loadingTransaction){
                        setModalTransaction(open);
                        getTokensWallet();
                        setInputTokens('');
                        onFinished();
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
            </Dialog.Content>
            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}