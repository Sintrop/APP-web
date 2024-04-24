import React, {useEffect, useState} from "react";
import { MdClose } from "react-icons/md";
import {Info} from '../../../components/Info';
import { save } from "../../../config/infura";
import { storage } from "../../../services/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { api } from "../../../services/api";
import { ToastContainer, toast } from "react-toastify";
import {ActivityIndicator} from '../../../components/ActivityIndicator';
import {useMainContext} from '../../../hooks/useMainContext';

export function ModalProofReduce({close, nameItem}){
    const {userData} = useMainContext();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingPubli, setLoadingPubli] = useState(false);
    const [hashImage, setHashImage] = useState('');

    async function getPath(buffer){
        setLoading(true);
        const hash = await save(buffer);
        setHashImage(hash);

        const storageRef = ref(storage, `/images/${hash}.png`);
        uploadBytesResumable(storageRef, buffer)
        .then(async (res) => {
            const url = await getDownloadURL(storageRef);
            setImage(url);
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

    async function publiProof(){
        if(loadingPubli){
            return;
        }

        if(!description.trim()){
            toast.error('Digite uma descrição!');
            return;
        }

        if(!image){
            toast.error('Anexe uma imagem!');
            return
        }

        const additionalData = {
            userData,
            nameItem
        }

        let imagesPubli = [];
        imagesPubli.push(hashImage);

        try{
            setLoadingPubli(true);
            await api.post('/publication/new', {
                userId: userData.id,
                type: 'proof-reduce',
                origin: 'platform',
                description,
                images: JSON.stringify(imagesPubli),
                additionalData: JSON.stringify(additionalData)
            });
            toast.success('Prova publicada com sucesso! Veja no seu feed.');
            setImage(null);
            setDescription('');

            setTimeout(() => {
                close();
            }, 2000)
        }catch(err){
            console.log(err);
        }finally{
            setLoadingPubli(false);
        }
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-black/60 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[450px] h-[420px] bg-[#0a4303] rounded-md m-auto inset-0 border-2 z-50'>
                <div className="flex items-center justify-between">
                    <div className="w-[25px]"/>
                    <p className="font-bold text-white">Provar redução</p>
                    <button onClick={close}>
                        <MdClose size={25} color='white'/>
                    </button>
                </div>

                <div className="flex flex-col">
                    <Info
                        text1='Para provar a redução, você deve anexar uma foto e contar um pouco do que você fez para isso, essa prova vira uma publicação no feed comprovando sua luta para a regeneração!'
                    />

                    <label className="font-bold text-white mt-3 text-sm">Anexar imagem</label>
                    <input 
                        type='file' 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setFile(file);
                            const reader = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                                const arrayBuffer = reader.result
                                const file = new Uint8Array(arrayBuffer);
                                getPath(file);
                            };
                        }}
                        className='w-full text-white'
                        accept='.jpg, .jpeg, .png'
                    />

                    <div className="flex flex-col items-center mt-2">
                        {image ? (
                            <img
                                src={image}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ) : (
                            <>
                                {loading ? (
                                    <ActivityIndicator size={50}/>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </div>

                    <label className="font-bold text-white mt-3 text-sm">Conte um pouco da sua mudança</label>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 bg-green-950 rounded-md text-white"
                        placeholder="Digite aqui"
                    />

                    {image && (
                        <button
                            className="w-full h-10 rounded-md bg-blue-500 font-semibold text-white mt-3"
                            onClick={publiProof}
                        >
                            {loadingPubli ? (
                                <ActivityIndicator size={20}/>
                            ) : (
                                'Publicar'
                            )}
                        </button>
                    )}
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}