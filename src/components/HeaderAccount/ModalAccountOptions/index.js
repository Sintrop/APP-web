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
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] lg:bg-transparent fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between w-[120px] h-[80px] bg-white rounded-md m-auto lg:m-0 inset-0 lg:inset-x-[91vw] lg:inset-y-12' style={{height: user === '0' && '120px'}}>
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