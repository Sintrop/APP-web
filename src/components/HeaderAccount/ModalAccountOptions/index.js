import React, {useContext} from 'react';
import './modalAccountOptions.css';
import * as Dialog from '@radix-ui/react-dialog';
import {BiLogOut} from 'react-icons/bi';
import {BsPersonPlus} from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { MainContext } from '../../../contexts/main';

export function ModalAccountOptions({user, walletConnected, close}){
    const {chooseModalRegister} = useContext(MainContext)
    const navigate = useNavigate();

    return(
        <Dialog.Portal className='modal-account-options__portal'>
            <Dialog.Overlay className='modal-account-options__overlay'/>
            <Dialog.Content className='modal-account-options__content'>
                <button 
                    onClick={() => {
                        if(user === '0'){
                            close();
                            chooseModalRegister()
                        }else{
                            close();
                            navigate('/');
                        }
                    }}
                    className='modal-account-options__option-container'
                >
                    {user === '0' ? (
                        <>
                            <BsPersonPlus color='#000' size={25}/>
                            <p className='modal-account-options__option-container-label'>Register</p>
                        </>
                    ) : (
                        <>
                            <BiLogOut color='#000' size={25}/>
                            <p className='modal-account-options__option-container-label'>Logout</p>
                        </>
                    )}
                </button>
                
            </Dialog.Content>
        </Dialog.Portal>
    )
}