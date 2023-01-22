import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './modalContribute.css';
import {GetTokensBalance} from '../../../../services/voteService';
import {BurnTokens} from '../../../../services/sacTokenService';
import Loading from '../../../Loading';

export function ModalContribute({wallet, onFinished}){
    const [balanceTokens, setBalanceTokens] = useState(0);
    const [inputTokens, setInputTokens] = useState('');
    const [loading, setLoading] = useState(false);

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
            return;
        }
        if(loading){
            return;
        }
        setLoading(true);
        await BurnTokens(wallet, inputTokens + '000000000000000000');
        getTokensWallet();
        setInputTokens('');
        onFinished();
        setLoading(false);
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
            </Dialog.Content>
            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}