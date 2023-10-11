import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { Help } from './help';

export function ModalDownloadCertificate({close, long, short, social}){
    const {walletAddress} = useParams();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[300px] h-[230px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white text-center'>{t('Choose which certificate you want to download')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="w-[250px] flex flex-col gap-2">
                    <button className="px-2 py-2 rounded-md bg-[#ff9900] text-white font-bold" onClick={() => long()}>
                        {t('Long Certificate')}
                    </button>
                    <button className="px-2 py-2 rounded-md bg-[#ff9900] text-white font-bold" onClick={() => short()}>
                        {t('Short Certificate')}
                    </button>
                    <button className="px-2 py-2 rounded-md bg-[#ff9900] text-white font-bold" onClick={() => social()}>
                        {t('Social Networks')}
                    </button>

                    <div>
                        {/* <Help
                            description='É indicado que o download seja feito a partir de um computador'
                        /> */}
                    </div>
                </div>
            </Dialog.Content>

            <ToastContainer
                position='top-center'
            />

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}