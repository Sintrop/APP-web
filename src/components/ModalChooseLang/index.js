import React from 'react';
import {useMainContext} from '../../hooks/useMainContext';
import IconBR from '../../assets/img/icon-br.png';
import IconUS from '../../assets/img/icon-us.png';
import * as Dialog from '@radix-ui/react-dialog';
import './modalChooseLang.css';

export function ModalChooseLang(){
    const {language, chooseLanguage} = useMainContext();
    return(
        <Dialog.Portal className='modal-choose-lang__portal'>
            <Dialog.Overlay className='modal-choose-lang__overlay'/>
            <Dialog.Content className='modal-choose-lang__content'>
                <Dialog.Title className='modal-choose-lang__title'>
                    Select your language
                </Dialog.Title>
                <Dialog.Close
                    className='modal-choose-lang__btn-option'
                    onClick={() => {chooseLanguage('en-us')}}
                >
                    <img
                        src={IconUS}
                        style={{width: 35, height: 25, objectFit: 'cover'}}
                    />
                    English
                </Dialog.Close>
                <Dialog.Close
                    className='modal-choose-lang__btn-option'
                    onClick={() => {chooseLanguage('pt-BR')}}
                >
                    <img
                        src={IconBR}
                        style={{width: 35, height: 25, objectFit: 'cover'}}
                    />
                    Português
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
}