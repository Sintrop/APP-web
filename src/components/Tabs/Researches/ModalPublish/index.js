import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './modalPublish.css';
import Loading from '../../../Loading';
import {LoadingTransaction} from '../../../LoadingTransaction';
import {PublishResearch} from '../../../../services/researchersService';
import {save} from '../../../../config/infura';
import { useTranslation } from 'react-i18next';

export function ModalPublish({walletAddress, close}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [file, setFile] = useState('');
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    function handlePublish(e){
        e.preventDefault();
        if(loading){
            return;
        }
        setModalTransaction(true);
        setLoadingTransaction(true);
        PublishResearch(walletAddress, title, thesis, file)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Only allowed to researchers")){
                setLogTransaction({
                    type: 'error',
                    message: "Only allowed to researchers!",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
    }

    async function getPath(file){
        setLoading(true);
        const response = await save(file);
        setFile(response);
        setLoading(false);
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[400px] lg:h-[450px] bg-green-950 rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <Dialog.Title className='font-bold text-white'>
                    {t('Publish Research')}
                </Dialog.Title>

                <form onSubmit={handlePublish} className='flex flex-col w-full'>
                    <label htmlFor='title' className='font-bold text-[#ff9900]'>{t('Title of Research')}:</label>
                    <input
                        className='bg-[#0a4303] p-2 rounded-md text-white'
                        name='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('Title of Research')}
                        required
                    />

                    <label htmlFor='thesis' className='font-bold text-[#ff9900]'>{t('Thesis')}:</label>
                    <textarea
                        style={{resize:'none', height: '100px'}}
                        className='bg-[#0a4303] p-2 rounded-md text-white'
                        name='thesis'
                        type='text'
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                        placeholder={t('thesis')}
                        required
                    />

                    <a href='https://docs.google.com/document/d/1hcL2WAGjfyXY3seOo5xuydHz5eGz6NSILuhxKn23A_o/edit?pli=1' target='_blank' className='w-full flex justify-center'>
                        <button
                            className='px-2 py-2 rounded-md bg-[#ff9900] text-white font-bold my-3'
                            type='button'
                        >
                            {t('Download Survey Template')}
                        </button>
                    </a>

                    <label htmlFor='pdf' className='font-bold text-[#ff9900]'>{t('Upload PDF report')}:</label>
                    <input 
                        type='file' 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                                const arrayBuffer = reader.result
                                const file = new Uint8Array(arrayBuffer);
                                getPath(file);
                            };
                        }}
                    />
                </form>
                
                <div className='flex items-center gap-2 justify-end w-full'>
                    <Dialog.Close
                        className='px-2 py-2 bg-gray-200 text-black font-bold rounded-md'
                    >
                        {t('Cancel')}
                    </Dialog.Close>
                    <button
                        className='px-2 py-2 bg-[#ff9900] text-white font-bold rounded-md'
                        onClick={handlePublish}
                        type='submit'
                    >
                        {t('Publish')}
                    </button>
                </div>

                <Dialog.Root 
                    open={modalTransaction} 
                    onOpenChange={(open) => {
                        if(!loadingTransaction){
                            setModalTransaction(open);
                            setTitle('');
                            setThesis('');
                            close();
                        }
                    }}
                >
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>

            </Dialog.Content>
                {loading && <Loading/>}
        </Dialog.Portal>
    )
}