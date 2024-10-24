import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Loading from '../../components/Loading';
import {LoadingTransaction} from '../../components/LoadingTransaction';
import {PublishResearch} from '../../services/web3/researchersService';
import {save} from '../../config/infura';
import { useTranslation } from 'react-i18next';
import {MdOutlineFileDownload} from 'react-icons/md';
import { api } from '../../services/api';
import {ToastContainer, toast} from 'react-toastify';

export function ModalPublishResearche({close, walletAddress}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [file, setFile] = useState('');
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserApi();
    },[]);

    async function getUserApi(){
        const response = await api.get(`/user/${walletAddress}`);
        setUserData(response.data.user);
    }

    function handlePublish(e){
        e.preventDefault();
        if(loading){
            return;
        }
        setModalTransaction(true);
        setLoadingTransaction(true);
        PublishResearch(walletAddress, title, thesis, file)
        .then(async(res) => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            });

            if(res.type === 'success'){
                api.post('/publication/new', {
                    userId: userData?.id,
                    type: 'publish-researche',
                    origin: 'platform',
                    additionalData: JSON.stringify({
                        userData,
                        title,
                        thesis, 
                        file
                    }),
                });

                toast.success('Pesquisa publicada!');
            }
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
            <Dialog.Content className='absolute lg:w-[500px] lg:h-[450px] bg-white rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className='w-full h-full flex flex-col items-center justify-between bg-centro-pesquisa p-5 bg-[#8CE5F366]'>
                <Dialog.Title className='font-bold text-[#1B7A74]'>
                    {t('Publish Research')}
                </Dialog.Title>

                <form onSubmit={handlePublish} className='flex flex-col w-full'>
                    <label htmlFor='title' className='font-bold text-[#1B7A74]'>{t('Title of Research')}:</label>
                    <input
                        className='bg-[#00BFE3] p-2 rounded-md text-white'
                        name='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('Title of Research')}
                        required
                    />

                    <label htmlFor='thesis' className='font-bold text-[#1B7A74]'>{t('Thesis')}:</label>
                    <textarea
                        style={{resize:'none', height: '100px'}}
                        className='bg-[#00BFE3] p-2 rounded-md text-white'
                        name='thesis'
                        type='text'
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                        placeholder={t('thesis')}
                        required
                    />
                    
                    <label htmlFor='pdf' className='font-bold text-[#1B7A74] text-sm text-center mt-2 mb-1'>{t('Upload PDF report')}:</label>
                    <div className='flex flex-col items-center justify-center gap-2'>
                        <a href='https://docs.google.com/document/d/1hcL2WAGjfyXY3seOo5xuydHz5eGz6NSILuhxKn23A_o/edit?pli=1' target='_blank' className='w-full flex justify-center'>
                            <button
                                className='px-2 py-2 rounded-md bg-[#1B7A74] text-white font-bold text-xs flex items-center justify-center'
                                type='button'
                            >
                                <MdOutlineFileDownload color='white' size={20}/>
                                {t('Survey Template')}
                            </button>
                        </a>

                        <div className='flex flex-col'>
                            <input 
                                accept='.pdf'
                                className='text-xs'
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
                        </div>
                    </div>

                </form>
                
                <div className='flex items-center gap-2 justify-between w-full'>
                    <Dialog.Close
                        className='px-4 py-2 bg-orange-500 text-white font-bold rounded-md'
                    >
                        {t('Cancel')}
                    </Dialog.Close>
                    <button
                        className='px-4 py-2 bg-[#1B7A74] text-white font-bold rounded-md'
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
                </div>  
            </Dialog.Content>

                {loading && <Loading/>}

                <ToastContainer position='top-center'/>
        </Dialog.Portal>
    )
}