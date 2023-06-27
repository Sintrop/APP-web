import React, {useState, useEffect} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import axios from 'axios';

export function ModalViewPhoto({close, hash}){
    const {walletAddress} = useParams();
    const [loading, setLoading] = useState(false);
    const [photoBase64, setPhotoBase64] = useState('');

    useEffect(() => {
        getImage();
    }, [hash]);

    async function getImage(){
        try{
            setLoading(true);
            const response = await axios.get(`https://ipfs.io/ipfs/${hash}`)
            setPhotoBase64(response.data);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[600px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>View Photo</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                {photoBase64 === '' ? (
                    <p className='font-bold text-white'>Erro ao obter a imagem!</p>
                ) : (
                    <img
                        src={photoBase64}
                        className='lg:w-[490px] h-[530px] rounded-md object-contain'
                    />
                )}

                <div/>
            </Dialog.Content>

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}