import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import {save, get} from '../../config/infura';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../services/api';
import { ActivityIndicator } from '../ActivityIndicator';
import { storage } from '../../services/firebase';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
import { useMainContext } from '../../hooks/useMainContext';

export function ModalFeedback({close, success}){
    const {walletAddress} = useParams();
    const {userData} = useMainContext();
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
        uploadImageForFirebase(base64);
        setLoading(false);
    }

    async function uploadImageForFirebase(base64){
        const res = await fetch(`data:image/png;base64,${base64}`);
        const blob = await res.blob();

        const storageRef = ref(storage, `/images/${photoHash[0]}.png`);
        uploadBytesResumable(storageRef, blob)
        .then(async (res) => {
            const url = await getDownloadURL(storageRef);
            console.log(url)
            createImageDB(url, photoHash[0])
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            toast.error('Algo deu errado, tente novamente!')
        })
    }

    async function createImageDB(url, hash){
        await api.post('/image', {
            url,
            hash
        })
    }

    async function handleSend() {
        if(loading){
            return;
        }
        if(!title.trim() || !description.trim()){
            toast.error('Preencha pelo menos o título e a descrição!')
            return;
        }

        setLoading(true);

        try {
            await api.post('/feedback', {
                wallet: userData?.wallet,
                title: title,
                description: description,
                photoHash: JSON.stringify(photoHash),
                type: 'feedback'
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
                    <Dialog.Title className='font-bold text-white'>Feedback e melhorias</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="flex flex-col w-full">
                    <p className="font-bold text-white">Título do feedback:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#012939] rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-white mt-3">Descrição:</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#012939] rounded-md border-2 px-2 w-full text-white '
                    />

                    <p className="font-bold text-white mt-2">Anexe uma imagem(Opcional):</p>
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
                        className='w-32 h-10 rounded-md text-white font-bold bg-blue-500'
                    >
                        {loading ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            'Enviar'
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