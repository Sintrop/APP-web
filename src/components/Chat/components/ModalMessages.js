import React, {useState, useEffect} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { MdSend } from "react-icons/md";
import { api } from "../../../services/api";
import { ActivityIndicator } from "../../ActivityIndicator";
import { MessageItem } from "./MessageItem";
import CryptoJS from "crypto-js";
import { useMainContext } from "../../../hooks/useMainContext";

export function ModalMessages({chat, imageProfile, participant, socket}) {
    const {userData} = useMainContext();
    const [sending, setSending] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [imageToSend, setImageToSend] = useState(null);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_message', data => {
            reicevedMessage(data);
        })

    }, [socket]);

    useEffect(() => {
        getMessages();
    }, []);

    function reicevedMessage(message_data) {
        if (chat.chatId !== message_data.chatId) {
            return;
        }
        let array = [];
        array = messagesList;
        array.unshift(message_data);
        setMessagesList(array);
        getMessages();
    }

    async function getMessages() {
        setLoading(true);
        const response = await api.get(`/chats/messages/${chat.chatId}`);
        const messages = response.data.messages
        setMessagesList(messages);

        setFirstLoad(false);
        setLoading(false);
    }

    async function sendMessage() {
        let hashPhotos = [];
        if(sending){
            return;
        }
        
        if(!imageToSend && !inputMessage.trim()){
            return;
        }

        setSending(true);
        // if(imageToSend){
        //     const hash = await addPhotoIPFS(imageToSend);
        //     hashPhotos.push(hash);
        // }

        const encrypt = CryptoJS.AES.encrypt(inputMessage, process.env.REACT_APP_DECRYPT_MESSAGE_KEY);

        try {
            await api.post('/chat/message', {
                chatId: chat.chatId,
                message: encrypt.toString(),
                type: imageToSend ? 'image' : 'text',
                userId: userData.id,
                userData: JSON.stringify(userData),
                participantData: JSON.stringify(participant),
                photos: JSON.stringify(hashPhotos)
            })
        } catch (err) {
            console.log(err)
        }
        await socket.emit('message', { message: encrypt.toString(), chatId: chat.chatId, userId: userData.id });
        setInputMessage('');
        getMessages();
        setImageToSend(null);
        setSending(false);
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

                    {loading && firstLoad && (
                        <ActivityIndicator size={50}/>
                    )}
                </div>

                <div className="flex items-center w-full p-1">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Digite aqui"
                        className="w-[90%] h-10 bg-white rounded-full px-3 text-black"
                    />

                    <div className="flex items-center justify-center w-[15%]">
                        <button
                            className="h-10 w-10 rounded-full flex items-center justify-center bg-green-600"
                            onClick={sendMessage}
                        >
                            <MdSend color='white' size={20} />
                        </button>
                    </div>
                </div>

            </Dialog.Content>

            <ToastContainer />
        </Dialog.Portal>
    )
}