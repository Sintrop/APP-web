import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import {Help} from './help';
import { api } from '../services/api';
import {save, get} from '../config/infura';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export function ModalChangePhoto({close, userId}){
    const {t} = useTranslation();
    const {walletAddress} = useParams();
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState('');
    const [base64, setBase64] = useState('');
    const [hash, setHash] = useState('');

    async function handleChangePhoto(){
        if(!hash.trim())return;
        try{
            setLoading(true);
            await api.put('/user/updatePhoto', {
                id: String(userId),
                hashPhoto: String(hash)
            });
            close()
        }catch(err){
            console.log(err);
            toast.error('Erro ao atualizar a foto do perfil. Tente novamente!')
        }finally{
            setLoading(false);
        }
    }

    async function getPath(file){
        setLoading(true);
        const response = await save(file);
        setHash(response);
        setLoading(false);
        getBase64(response);
    }

    async function getBase64(hash){
        setLoading(true);
        const response = await get(hash);
        setBase64(response);
        setLoading(false);
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[400px] h-[350px] bg-green-950 rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='hidden lg:flex w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>{t('Change Profile Picture')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="w-full lg:w-[380px] flex flex-col items-center">
                    <p className='font-bold text-[#ff9900] w-full'>{t('Select an Image')}:</p>
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
                        className='w-full'
                        accept='.jpg, .jpeg, .png'
                    />

                    {base64 === '' ? (
                        <div
                            className='w-[150px] h-[150px] rounded-md border-4 border-[#ff9900] flex items-center justify-center mt-3'
                        >
                            <p className='text-white font-bold'>{t('No Photo')}</p>
                        </div>
                    ) : (
                        <img
                            src={`data:image/png;base64,${base64}`}
                            className='w-[150px] h-[150px] object-cover mt-3 border-4 border-[#ff9900] rounded-md'
                        />
                    )}
                </div>

                <div className='flex items-center justify-end w-full gap-3 mt-3'>
                    <button 
                        onClick={handleChangePhoto}
                        className='px-3 h-8 lg:h-10 rounded-md text-white font-bold bg-[#ff9900]'
                    >
                        {t('To Alter')}
                    </button>
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