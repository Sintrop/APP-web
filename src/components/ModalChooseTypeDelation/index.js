import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import './modalChooseTypeDelation.css';
import {RiUserUnfollowFill} from 'react-icons/ri';
import {SiHiveBlockchain} from 'react-icons/si';
import ModalDelation from '../ModalDelation';
import { useNavigate } from 'react-router';
import {useMainContext} from '../../hooks/useMainContext';

export function ModalChooseTypeDelation(){
    const {Sync, setWalletConnected} = useMainContext();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [modalDelation, setModalDelation] = useState(false);
    const [anonymousReport, setAnonymousReport] = useState(false);

    async function handleConnect(){
        const sync = await Sync();
        setWalletConnected(sync.wallet[0]);
        console.log(sync.wallet[0])
        setModalDelation(true)
        setAnonymousReport(false);
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='fixed flex flex-col items-center justify-between p-3 lg:w-[500px] h-[350px] bg-green-950 rounded-md m-2 lg:m-auto inset-0 border-2 border-[#ff9900]'>
                <Dialog.Title className='text-white font-bold text-center'>
                    {t('Choose the type of denunciation')}
                </Dialog.Title>

                <button 
                    className='flex gap-2 hover:bg-green-900 p-2 duration-200'
                    onClick={() => {
                        setModalDelation(true);
                        setAnonymousReport(true);
                    }}
                >
                    <div style={{display: 'flex', width: 50, height: 50}}>
                        <RiUserUnfollowFill size={50} color='#ff9900' />
                    </div>
                    <div className='flex flex-col items-start'>
                        <h2 className='font-bold text-[#ff9900]'>{t('Anonymous Delation')}</h2>
                        <p className='text-white text-justify'>
                            {t('In the anonymous complaint, you register the complaint without identifying yourself, this record will later be analyzed by one of the validators of the system, if the complaint is valid, the validator will register it in the Blockchain')}.
                        </p>
                    </div>
                </button>

                <button 
                    className='flex gap-2 hover:bg-green-900 p-2 duration-200'
                    onClick={() => {
                        setModalDelation(true);
                        setAnonymousReport(false);
                    }}
                >
                    <div style={{display: 'flex', width: 50, height: 50}}>
                        <SiHiveBlockchain size={50} color='#ff9900' />
                    </div>
                    <div className='flex flex-col items-start'>
                        <h2 className='font-bold text-[#ff9900]'>{t('Blockchain Dealing')}</h2>
                        <p className='text-white text-justify'>
                            {t('It is necessary that you are registered on the Sintrop platform, in this way you will register the complaint directly on the Blockchain')}.
                        </p>
                    </div>
                </button>
            </Dialog.Content>

            <Dialog.Root open={modalDelation} onOpenChange={(open) => setModalDelation(open)}>
                <ModalDelation
                    anonymousReport={anonymousReport}
                    close={() => setModalDelation(false)}
                />
            </Dialog.Root>
        </Dialog.Portal>
    )
}