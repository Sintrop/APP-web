import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import {save, get} from '../config/infura';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../services/api';

export function ModalFeedback({close}){
    const {walletAddress} = useParams();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photoHash, setPhotoHash] = useState([]);
    const [base64, setBase64] = useState('');


    async function getPath(file){
        setLoading(true);
        const path = await save(file);
        photoHash.push(path);
        getBase64(path);
    }

    async function getBase64(path){
        const base64 = await get(path);
        setBase64(base64);
        setLoading(false);
    }

    async function handleSend(){
        if(!title.trim() || !description.trim()){
            toast.error('Preencha pelo menos o título e a descrição!')
            return;
        }
        
        try{
            setLoading(true);
            await api.post('/feedback', {
                wallet: String(walletAddress).toUpperCase(),
                title: title,
                description: description,
                photoHash: JSON.stringify(photoHash),
                type: 'feedback'
            })
            setTitle('');
            setDescription('');
            setPhotoHash([]);
            setBase64('');
            close()
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Feedback e melhorias</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="flex flex-col w-full">
                    <p className="font-bold text-[#ff9900]">Título do feedback:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-[#ff9900] mt-3">Descrição:</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 w-full text-white '
                    />

                    <p className="font-bold text-[#ff9900]">Anexe uma imagem(Opcional):</p>
                    <div className='flex flex-col items-center gap-3 mt-3'>
                        <input 
                            type='file' 
                            accept='.jpg, .jpeg, .png'
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
                        {base64 && (
                            <img
                                src={`data:image/png;base64,${base64}`}
                                className='w-[150px] h-[150px] object-cover'
                            />
                        )}
                    </div>
                </div>

                

                <div className='flex items-center justify-end w-full gap-3'>
                    <button 
                        onClick={handleSend}
                        className='px-3 py-2 rounded-md text-white font-bold bg-[#ff9900]'
                    >Enviar</button>
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