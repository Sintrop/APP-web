import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import './modalRegister.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';

export default function ModalRegister(){
    const {walletAddress, walletSelected} = useParams();

    return(
        <Dialog.Portal className='modal-register__portal'>
            <Dialog.Overlay className='modal-register__overlay'/>
            <Dialog.Content className='modal-register__content'>
                <Dialog.Title className='modal-register__title'>
                    Register
                </Dialog.Title>

                

                <div className='modal-register__area-btn'>
                    <Dialog.Close
                        className='modal-register__btn-cancel'
                    >
                        Cancel
                    </Dialog.Close>
                </div>

                
            </Dialog.Content>
        </Dialog.Portal>
    )
}