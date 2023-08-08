import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import Loading from '../../components/Loading';
import {save} from '../../config/infura';

export function ModalCreateTask({userData, close}){
    const {walletAddress} = useParams();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(0);
    const [team, setTeam] = useState(0);
    const [photoHash, setPhotoHash] = useState([]);

    useEffect(() => {
        
    },[]);

    async function handleCreate(){
        if(loading){
            return;
        }
        if(!title.trim()){
            return;
        }
        if(!description.trim()){
            return;
        }
        if(priority === 0){
            return;
        }
        if(team === 0){
            return;
        }
        try{
            setLoading(true);
            const createdFeedback = await api.post('/feedback', {
                title,
                description,
                wallet: userData.wallet,
                photoHash: JSON.stringify(photoHash),
                type: 'task',
                priority: Number(priority),
                team: Number(team)
            })

            const dataNotification = {
                text1: 'Created a new task', 
                text2: title
            }
            await api.post('/notifications/send', {
                from: userData.wallet,
                for: 'devs',
                type: 'create-task',
                data: JSON.stringify(dataNotification),
                group: 'devs'
            });

            setTitle("");
            setDescription('');
            setPriority(0);
            setTeam(0);
            setPhotoHash([]);
            close(createdFeedback.data.feedback);
        }catch(err){
            console.log(err)
            toast.error(`${t('Algo deu errado, tente novamente!')}`)
        }finally{
            setLoading(false)
        }
    }

    async function getPath(file){
        setLoading(true);
        const path = await save(file);
        photoHash.push(path);
        setLoading(false);
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-black/60 fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[450px] h-[500px] bg-black rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between mb-5'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>{t('Create Task')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="flex flex-col w-full">
                    <p className="font-bold text-[#ff9900]">{t('Task title')}:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-[#ff9900] mt-3">{t('Task description')}:</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-gray-800 rounded-md border-2 px-2 w-full text-white h-20'
                    />

                    <div className='flex items-center justify-center w-full mt-5 gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-[#ff9900] font-bold'>{t('Priority')}</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className=''
                            >
                                <option value={0} defaultValue>Select an option</option>
                                <option value={1}>Low</option>
                                <option value={2}>Average</option>
                                <option value={3}>High</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-[#ff9900] font-bold'>{t('Team')}</label>
                            <select
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                className=''
                            >
                                <option value={0} defaultValue>Select an option</option>
                                <option value={1}>Front-End</option>
                                <option value={2}>Smart Contracts</option>
                                <option value={3}>Mobile</option>
                                <option value={4}>Design</option>
                                <option value={5}>User Experience</option>
                                <option value={6}>API</option>
                            </select>
                        </div>
                    </div>

                    <label className='text-[#ff9900] font-bold'>{t('Attach photo')}</label>
                    <input 
                        className='text-white'
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
                </div>

                <div className='flex items-center justify-between w-full'>
                    <Dialog.Close
                        className='p-3 text-white font-bold'
                    >
                        {t('Cancel')}
                    </Dialog.Close>

                    <button
                        className='px-3 py-2 text-white font-bold rounded-md bg-[#ff9900]'
                        onClick={handleCreate}
                    >   
                        {t('Create')}
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