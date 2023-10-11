import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import {save, get} from '../config/infura';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../services/api';

export function ModalChangePassword({close}){
    const {walletAddress} = useParams();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    async function handleChangePassword(){
        if(!password.trim() || !confirmPassword.trim()){
            toast.error('Prrencha todos os campos');
            return
        }

        if(password !== confirmPassword){
            toast.error('As senhas não conferem!')
            return;
        }

        try{
            setLoading(true);
            await api.put('/auth/update-password',{
                wallet: walletAddress,
                password
            })
            setPassword('');
            setConfirmPassword('');
            close()
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[300px] h-[300px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Alterar Senha</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="w-[250px] flex flex-col">
                    <p className='font-bold text-[#ff9900]'>Nova senha:</p>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='h-10 bg-[#0a4303] px-2 rounded-md text-white'
                        placeholder='Digite a nova senha'
                    />

                    <p className='font-bold text-[#ff9900] mt-3'>Confirme a nova senha:</p>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='h-10 bg-[#0a4303] px-2 rounded-md text-white'
                        placeholder='Confirme a nova senha'
                    />
                </div>
                

                <div className='flex items-center justify-end w-full gap-3'>
                    <button 
                        onClick={handleChangePassword}
                        className='px-3 py-2 rounded-md text-white font-bold bg-[#ff9900]'
                    >Alterar</button>
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