import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../../../services/api';
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { useMainContext } from '../../../../hooks/useMainContext';
import { saveImageFirebase } from '../../../../services/saveImageFirebase';

export function ModalCreateTask({close, success}){
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [priority, setPriority] = useState(1);
    const [team, setTeam] = useState(1);
    const [pts, setPts] = useState(1);

    async function handleSend() {
        if(userData?.accountStatus !== 'blockchain'){
            toast.error('Você precisa estar cadastrado na blockchain!');
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
            await api.post('/feedback', {
                wallet: userData?.wallet,
                title: title,
                description: description,
                photoHash: image ? JSON.stringify([image]) : JSON.stringify([]),
                type: 'task',
                priority: Number(priority),
                team: Number(team),
                pts: Number(pts)
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
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Criar task</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className="flex flex-col w-full overflow-y-auto pb-3">
                    <p className="font-bold text-white">Título da task:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-white mt-3">Descrição:</p>
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 py-2 w-full text-white'
                    />

                    <p className="font-bold text-white mt-2">Anexe uma imagem(Opcional):</p>
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

                    <p className="font-bold text-white mt-3">Prioridade:</p>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className='w-full py-2 bg-[#0a4303] px-3 rounded-md text-white'
                    >
                        <option value={1}>Baixa</option>
                        <option value={2}>Média</option>
                        <option value={3}>Alta</option>
                    </select>

                    <p className="font-bold text-white mt-3">Time:</p>
                    <select
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className='w-full py-2 bg-[#0a4303] px-3 rounded-md text-white'
                    >
                        <option value={1}>Front-end</option>
                        <option value={2}>Contratos Inteligents</option>
                        <option value={3}>Mobile</option>
                        <option value={4}>Design</option>
                        <option value={5}>UX</option>
                        <option value={6}>API</option>
                    </select>

                    <p className="font-bold text-white mt-3">Pontos da task:</p>
                    <select
                        value={pts}
                        onChange={(e) => setPts(e.target.value)}
                        className='w-full py-2 bg-[#0a4303] px-3 rounded-md text-white'
                    >
                        <option value={1}>+1</option>
                        <option value={2}>+2</option>
                        <option value={4}>+4</option>
                        <option value={8}>+8</option>
                        <option value={16}>+16</option>
                        <option value={25}>+25</option>
                    </select>
                </div>

                

                <div className='flex items-center justify-end w-full gap-3'>
                    <button 
                        onClick={handleSend}
                        className='w-32 h-10 rounded-md text-white font-bold bg-blue-500'
                    >
                        {loading ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            'Criar'
                        )}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}