import React, {useContext} from 'react';
import './modalAccountOptions.css';
import * as Dialog from '@radix-ui/react-dialog';
import {BiLogOut, BiWorld} from 'react-icons/bi';
import {BsPersonPlus} from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { MainContext } from '../../../contexts/main';
import { useTranslation } from 'react-i18next';
import { ModalChooseLang } from '../../ModalChooseLang';

export function ModalAccountOptions({user, walletConnected, close}){
    const {t} = useTranslation();
    const {chooseModalRegister, toggleModalChooseLang, modalChooseLang} = useContext(MainContext)
    const navigate = useNavigate();

    return(
        <Dialog.Portal className='modal-account-options__portal'>
            <Dialog.Overlay className='modal-account-options__overlay'/>
            <Dialog.Content className='modal-account-options__content' style={{height: user === '0' && '120px'}}>
                <button
                    onClick={() => {toggleModalChooseLang()}}
                    className='modal-account-options__option-container'
                >
                    <BiWorld color='#000' size={25}/>
                    <p className='modal-account-options__option-container-label'>{t('Language')}</p>
                </button>

                {user === '0' && (
                    <button 
                        onClick={() => {
                            close();
                            chooseModalRegister();
                        }}
                        className='modal-account-options__option-container'
                    >
                        <BsPersonPlus color='#000' size={25}/>
                        <p className='modal-account-options__option-container-label'>{t('Register')}</p>
                    </button>
                )}

                <button
                    onClick={() => {
                        close();
                        navigate('/');
                    }}
                    className='modal-account-options__option-container'
                >
                    <BiLogOut color='#000' size={25}/>
                    <p className='modal-account-options__option-container-label'>{t('Logout')}</p>
                </button>
            </Dialog.Content>

            <Dialog.Root
                open={modalChooseLang}
                onOpenChange={() => toggleModalChooseLang()}
            >
                <ModalChooseLang/>
            </Dialog.Root>
        </Dialog.Portal>
    )
}