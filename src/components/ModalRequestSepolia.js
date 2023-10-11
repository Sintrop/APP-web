import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import {Help} from './help';
import { api } from '../services/api';
import emailjs from '@emailjs/browser';

export function ModalRequestSepolia({close}){
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState('');

    async function handleRequestSepolia(){
        if(!wallet.trim()){
            toast.error('Preencha o campo wallet!')
            return;
        }

        try{
            setLoading(true);
            await api.post('/request-faucet', {
                wallet
            })
            emailjs.send('service_alygxgf', 'template_elsj08i', {wallet}, 'kuy2D_QzG95P7COQI')
            .then(() => {
                setWallet('');
                close();
            })
            .catch(() => {
                setWallet('');
                close();
            })
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[400px] h-[300px] bg-green-950 rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='hidden lg:flex w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Solicitar sepolia a nossa equipe</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="w-full lg:w-[380px] flex flex-col items-center">
                    <p className='font-bold text-[#ff9900] w-full'>Sua wallet:</p>
                    <input
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className='lg:h-10 h-8 w-full bg-[#0a4303] px-2 rounded-md text-white'
                        placeholder='Digite aqui sua wallet'
                    />

                    <Help
                        description='Copie sua wallet do metamask, e insira no campo acima. No menor tempo possível a nossa equipe te enviará SepoliaETH'
                    />
                </div>

                <div className='flex items-center justify-end w-full gap-3 mt-3'>
                    <button 
                        onClick={handleRequestSepolia}
                        className='px-3 h-8 lg:h-10 rounded-md text-white font-bold bg-[#ff9900]'
                    >Solicitar</button>
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