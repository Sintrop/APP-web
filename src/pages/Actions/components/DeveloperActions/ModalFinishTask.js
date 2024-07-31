import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { api } from '../../../../services/api';
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { useMainContext } from '../../../../hooks/useMainContext';
import { saveImageFirebase } from '../../../../services/saveImageFirebase';

export function ModalFinishTask({ close, success, taskId }) {
    const { userData } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [pts, setPts] = useState(1);
    const [urlPR, setURLPR] = useState(''); 

    async function handleFinish() {
        if (userData?.accountStatus !== 'blockchain') {
            toast.error('Você precisa estar cadastrado na blockchain!');
            return;
        }

        if (loading) {
            return;
        }
        if (!urlPR.trim()) {
            toast.error('É necessário inserir o link do PR!');
            return;
        }

        setLoading(true);

        try {
            await api.put('/feedback/finish', {
                id: taskId,
                additionalData: JSON.stringify({
                    urlPR,
                    image,
                    description,
                }) 
            });
            success();
            close();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-green-950 rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]' />
                    <Dialog.Title className='font-bold text-white'>Finalizar task</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white' />
                    </Dialog.Close>
                </div>

                <div className="flex flex-col w-full overflow-y-auto pb-3">
                    <p className="font-bold text-white">URL do pull request:</p>
                    <input
                        value={urlPR}
                        onChange={(e) => setURLPR(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 py-2 w-full text-white'
                        maxLength={50}
                    />

                    <p className="font-bold text-white mt-3">Descrição (Opcional):</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Digite aqui'
                        className='bg-[#0a4303] rounded-md border-2 px-2 w-full text-white '
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
                </div>



                <div className='flex items-center justify-end w-full gap-3'>
                    <button
                        onClick={handleFinish}
                        className='w-32 h-10 rounded-md text-white font-bold bg-blue-500'
                    >
                        {loading ? (
                            <ActivityIndicator size={25} />
                        ) : (
                            'Finalizar'
                        )}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}