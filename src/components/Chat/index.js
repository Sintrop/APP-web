import React, {useEffect, useState} from 'react';
import {BsFillChatDotsFill} from 'react-icons/bs';
import {FaChevronUp, FaChevronDown, FaPlus} from 'react-icons/fa';
import { useMainContext } from '../../hooks/useMainContext';
import { api } from '../../services/api';
import { ActivityIndicator } from '../ActivityIndicator';
import io from 'socket.io-client';
import { ChatItem } from './components/ChatItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalNewChat } from './components/ModalNewChat';
import { toast, ToastContainer } from 'react-toastify';

export function Chat({openChat}){
    const {walletConnected, userData} = useMainContext();
    const [open, setOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [modalNewChat, setModalNewChat] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if(openChat){
            setOpen(true)
        }
        getChats();
    }, [openChat])

    useEffect(() => {
        if(userData){
            getChats();
        };
    }, [userData]);

    async function getChats() {
        //setLoading(true);
        const response = await api.get(`/chats/${userData?.id}`);
        setChats(response.data.chats);
        setLoading(false);
    }

    return(
        <div className='absolute right-5 bottom-0'>
            <div className={`flex flex-col rounded-t-md w-[320px] bg-[#0a4303] ${open ? 'h-[500px]' : 'h-[50px]'} duration-200`}>
                <div className='flex h-[50px] border-b border-green-700 px-3 items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <BsFillChatDotsFill color='white' size={25} />

                        <p className='font-bold text-white'>Chat</p>
                    </div>

                    <button onClick={() => setOpen(!open)}>
                        {open ? <FaChevronDown color='white' size={20}/> : <FaChevronUp color='white' size={20}/>}
                    </button>
                </div>

                {open && (
                    <>
                    {walletConnected === '' ? (
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <p className='text-white font-bold'>Você não está conectado!</p>
                        </div>
                    ) : (
                        <div className='flex flex-col overflow-y-auto overflow-x-hidden gap-1'>
                            {loading ? (
                                <ActivityIndicator size={50}/>
                            ) : (
                                <>
                                    <Dialog.Root open={modalNewChat} onOpenChange={(open) => setModalNewChat(open)}>
                                        <Dialog.Trigger className='my-2 flex items-center gap-2 px-3'>
                                            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-green-500'>
                                                <FaPlus size={20} color='white'/>
                                            </div>
                                            <p className='font-bold text-white text-sm'>Iniciar conversa</p>
                                        </Dialog.Trigger>

                                        <ModalNewChat 
                                            chats={chats} 
                                            chatCreated={() => {
                                                getChats();
                                                setModalNewChat(false);
                                                toast.success('Chat criado com sucesso!')
                                            }}
                                        />
                                    </Dialog.Root>
                                    {chats.length === 0 ? (
                                        <p className='text-white text-center mt-10'>Você não tem nenhum chat ativo no momento</p>
                                    ) : (
                                        <>
                                            {chats.map(item => (
                                                <ChatItem data={item} key={item.chatId} socket={socket} attChats={getChats}/>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                            
                        </div>
                    )}
                    </>
                )}
            </div>

            <ToastContainer/>
        </div>
    )
}