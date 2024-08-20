import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../../../services/api';
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { useMainContext } from '../../../../hooks/useMainContext';
import { saveImageFirebase } from '../../../../services/saveImageFirebase';
import { useTranslation } from 'react-i18next';

export function ModalCreateTask({close, success}){
    const {t} = useTranslation();
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null)

    async function handleSend() {
        if(userData?.accountStatus !== 'blockchain'){
            toast.error(t('necessitaCadastroBlock'));
            return;
        }

        if(loading){
            return;
        }
        if(!title.trim() || !description.trim()){
            toast.error('Preencha pelo menos o título e a descrição!');
            return;
        }

        setLoading(true);

        try {
            await api.post('/task', {
                wallet: userData?.wallet,
                title: title,
                description: description,
                photoHash: image ? JSON.stringify([image]) : JSON.stringify([]),
                type: 'task'
            });
            success();
            close();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-[#03364B] rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>{t('criarTask')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="flex flex-col w-full">
                    <p className="font-bold text-white">{t('tituloTask')}:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('digiteAqui')}
                        className='bg-[#012939] rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-white mt-3">{t('descricao')}:</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('digiteAqui')}
                        className='bg-[#012939] rounded-md border-2 px-2 w-full text-white '
                    />

                    <p className="font-bold text-white mt-2">{t('anexeImgOpc')}:</p>
                    <div className='flex flex-col items-center gap-3 mt-3'>
                        <input 
                            type='file' 
                            accept='.jpg, .jpeg, .png'
                            className='text-white w-full'
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                const response = await saveImageFirebase(file)
                                setImage(response)
                            }}
                        />
                        {image && (
                            <img
                                src={image}
                                className='w-[150px] h-[150px] object-cover'
                            />
                        )}
                    </div>
                </div>

                

                <div className='flex items-center justify-end w-full gap-3'>
                    <button 
                        onClick={handleSend}
                        className='w-32 h-10 rounded-md text-white font-bold bg-blue-500'
                    >
                        {loading ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            t('criarTask')
                        )}
                    </button>
                </div>
            </Dialog.Content>

            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}