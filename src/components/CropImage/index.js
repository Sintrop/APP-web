import React, { useEffect, useState, useRef } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../services/firebase";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { ActivityIndicator } from "../ActivityIndicator";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../services/api";
import { save } from "../../config/infura";
import * as Dialog from '@radix-ui/react-dialog';

export function CropImage({ close, file, returnType, returnUri }) {
    const [base64, setBase64] = useState('');
    const [urlToEdit, setUrlToEdit] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        prepareImage();
    }, [file]);

    async function prepareImage(){
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => {setUrlToEdit(reader.result)}
    }

    const onChange = (cropper) => {
        const canvas = cropper.getCanvas();
        if(canvas){
            setBase64(canvas.toDataURL());
        }
    }

    function handleContinue(){
        if(base64 === ''){
            toast.error('Ajuste sua imagem!')
            return
        }
        if(loading)return;

        if(returnType === 'hash'){
            saveIpfs();
        }else{
            uploadReturnUrl();
        }
    }

    async function uploadReturnUrl() {
        setLoading(true);

        const res = await fetch(base64);
        const blob = await res.blob()
        
        const storageRef = ref(storage, `/images/${parseInt(Math.random() * 13546584654)}`);
        uploadBytesResumable(storageRef, blob)
        .then(async (res) => {
            const url = await getDownloadURL(storageRef)
            returnUri(url, 'hash');
            setLoading(false);
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
        })
    }   

    async function saveIpfs(){
        const res = await fetch(base64);
        const blob = await res.blob();

        setLoading(true);
        const hash = await save(blob);

        const storageRef = ref(storage, `/images/${hash}.png`);
        uploadBytesResumable(storageRef, blob)
        .then(async (res) => {
            const url = await getDownloadURL(storageRef);
            returnUri(url, hash)
            createImageDB(url, hash)
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

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">

                        <p className="font-semibold text-white">Editar imagem</p>
                    </div>
                </div>

                {urlToEdit !== '' ? (
                    <Cropper
                        className="h-[400px] bg-gray-300"
                        src={urlToEdit}
                        onChange={onChange}
                        crossOrigin='use-credentials'
                        
                    />
                ) : (
                    <div className="gap-2 flex flex-col">
                        <ActivityIndicator size={50}/>
                        <p className="text-center text-white">Processando, aguarde...</p>
                    </div>
                )}

                <div className="flex items-center w-full justify-between">
                    <button 
                        className="px-4 h-10 rounded-md font-bold text-white bg-gray-400"
                        onClick={close}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="w-28 h-10 rounded-md font-bold text-white bg-green-600"
                        onClick={handleContinue}
                    >
                        {loading ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            'Continuar'
                        )}
                    </button>
                </div>
            </Dialog.Content>

            <ToastContainer/>
        </Dialog.Portal>
    )
}