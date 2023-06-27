import React from 'react';
import {useMainContext} from '../../hooks/useMainContext';
import IconBR from '../../assets/img/icon-br.png';
import IconUS from '../../assets/img/icon-us.png';
import * as Dialog from '@radix-ui/react-dialog';
import './modalChooseLang.css';
import {FaCheck} from 'react-icons/fa';

export function ModalChooseLang(){
    const {language, chooseLanguage} = useMainContext();
    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] lg:bg-transparent fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between px-2 w-[170px] h-[80px] bg-white rounded-md m-auto lg:m-0 inset-0 lg:inset-x-[85vw] lg:inset-y-12'>
                <Dialog.Close
                    className='modal-choose-lang__btn-option'
                    onClick={() => {chooseLanguage('en-us')}}
                >
                    <img
                        src={IconUS}
                        style={{width: 35, height: 25, objectFit: 'cover'}}
                    />
                    English
                    {language === 'en-us' && (
                        <FaCheck size={18} color='green'/>
                    )}
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
                    {language === 'pt-BR' && (
                        <FaCheck size={18} color='green'/>
                    )}
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    )
}