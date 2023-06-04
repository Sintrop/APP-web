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
            <Dialog.Content className='fixed flex flex-col items-center justify-between pb-3 lg:w-[500px] h-[530px] bg-green-950 rounded-md m-2 lg:m-auto inset-0 border-2 border-[#ff9900]'>
                <Dialog.Title className='w-full h-16 flex justify-between items-center rounded-t-md bg-[#0a4303] border-b-2 border-[#ff9900]'>
                    {t('Choose the type of denunciation')}
                </Dialog.Title>

                <button 
                    className='modal-choose-type-delation__btn-action'
                    onClick={() => {
                        setModalDelation(true);
                        setAnonymousReport(true);
                    }}
                >
                    <div style={{display: 'flex', width: 50, height: 50}}>
                        <RiUserUnfollowFill size={50} color='black' />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <h2 style={{fontWeight: 'bold', color: 'green', fontSize: 16, margin: 0}}>{t('Anonymous Delation')}</h2>
                        <p style={{margin: 0, textAlign: 'justify'}}>
                            {t('In the anonymous complaint, you register the complaint without identifying yourself, this record will later be analyzed by one of the validators of the system, if the complaint is valid, the validator will register it in the Blockchain')}.
                        </p>
                    </div>
                </button>

                <button 
                    className='modal-choose-type-delation__btn-action'
                    onClick={() => handleConnect()}
                >
                    <div style={{display: 'flex', width: 50, height: 50}}>
                        <SiHiveBlockchain size={50} color='black' />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <h2 style={{fontWeight: 'bold', color: 'green', fontSize: 16, margin: 0}}>{t('Blockchain Dealing')}</h2>
                        <p style={{margin: 0, textAlign: 'justify'}}>
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