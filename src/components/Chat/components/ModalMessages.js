import React, {useState, useEffect} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from "../../../services/api";
import { ActivityIndicator } from "../../ActivityIndicator";
import { MessageItem } from "./MessageItem";

export function ModalMessages({chat, imageProfile, participant, socket}) {
    const [sending, setSending] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [imageToSend, setImageToSend] = useState(null);

    useEffect(() => {
        getMessages();
    }, []);

    async function getMessages() {
        setLoading(true);
        const response = await api.get(`/chats/messages/${chat.chatId}`);
        const messages = response.data.messages
        setMessagesList(messages);

        setFirstLoad(false);
        setLoading(false);
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>

                <div className='flex items-center w-full justify-between border-b border-green-700 pb-2'>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-400 rounded-full">
                            <img
                                src={imageProfile}
                                className="w-8 h-8 object-cover rounded-full"
                            />
                        </div>

                        <h3 className="text-white font-bold text-sm">{participant?.name}</h3>
                    </div>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white' />
                    </Dialog.Close>
                </div>

                <div className="flex flex-col-reverse w-full h-full overflow-y-auto overflow-x-hidden">
                    {messagesList.map(item => (
                        <MessageItem
                            key={item.id}
                            data={item}
                        />
                    ))}

                    {loading && (
                        <ActivityIndicator size={50}/>
                    )}
                </div>

                <div />

            </Dialog.Content>

            <ToastContainer />
        </Dialog.Portal>
    )
}