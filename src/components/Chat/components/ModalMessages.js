import React, { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";
import { IoMdCloseCircleOutline, IoMdCloseCircle } from 'react-icons/io';
import { MdSend, MdGroups } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { api } from "../../../services/api";
import { ActivityIndicator } from "../../ActivityIndicator";
import { MessageItem } from "./MessageItem";
import CryptoJS from "crypto-js";
import { useMainContext } from "../../../hooks/useMainContext";
import { FaChevronLeft } from "react-icons/fa";
import { UserChatItem } from '../components/ModalNewChat/UserChatItem';
import { firestore } from "../../../services/firebase";
import { collection, doc, query, onSnapshot, setDoc, Timestamp, orderBy } from "firebase/firestore";
import { CropImage } from "../../CropImage";

export function ModalMessages({ chat, imageProfile, participant, typeChat, messages }) {
    const { userData } = useMainContext();
    const [sending, setSending] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [imageToSend, setImageToSend] = useState(null);
    const [detailsChat, setDetailsChat] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [cropImage, setCropImage] = useState(false);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (typeChat !== 'private') {
            getParticipants();
        }
    }, []);

    const messagesThreadsRef = collection(firestore, "MESSAGE_THREADS");
    const chatRef = doc(messagesThreadsRef, chat?.chatId)
    const messagesRef = collection(chatRef, 'MESSAGES');

    async function sendMessage() {
        let images = [];
        if (sending) {
            return;
        }

        if (!imageToSend && !inputMessage.trim()) {
            return;
        }

        setSending(true);
        if (image) {
            images.push(image);
        }

        const encrypt = CryptoJS.AES.encrypt(inputMessage, process.env.REACT_APP_DECRYPT_MESSAGE_KEY);
        const messageData = {
            chatId: chat?.chatId,
            message: encrypt.toString(),
            type: imageToSend ? 'image' : 'text',
            userId: userData.id,
            user: {
                id: userData.id,
                name: userData.name,
                wallet: userData?.wallet,
            },
            photos: JSON.stringify(images),
            participantData: JSON.stringify(participant),
            createdAt: Timestamp.fromDate(new Date()),
        }

        try {
            await setDoc(doc(messagesRef), messageData);
            api.put('/send-message', {
                chatId: chat?.chatId,
                message: encrypt.toString(),
                ownerName: userData?.name,
                ownerId: userData?.id,
                participantData: JSON.stringify(participant),
            });
        } catch (err) {

        } finally {
            setInputMessage('');
            setImage(null);
            setImageToSend(null);
            setSending(false);
        }
    }

    async function getParticipants() {
        setLoading(true);
        const response = await api.get(`/chat/participants/${chat?.chat?.id}`);
        setParticipants(response.data.participants);
        setLoading(false);
    }

    function onFormSubmit(event) {
        event.preventDefault();
        sendMessage();
    }

    function openFolderSelect() {
        const intpuFile = document.querySelector('#input-image-chat');
        intpuFile.click();
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[500px] bg-[#03364B] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                {detailsChat ? (
                    <div className="h-full flex flex-col">
                        <div className='flex items-center w-full justify-between border-b border-green-700 pb-2'>
                            <button className="flex items-center gap-2" onClick={() => setDetailsChat(false)}>
                                <FaChevronLeft color='white' size={20} />
                                <p className="font-bold text-white">Informações do chat</p>
                            </button>
                            <Dialog.Close>
                                <IoMdCloseCircleOutline size={25} color='white' />
                            </Dialog.Close>
                        </div>

                        <div className="flex flex-col items-center mt-10">
                            {typeChat === 'private' ? (
                                <div className="w-[120px] h-[120px] bg-gray-400 rounded-full">
                                    {imageProfile ? (
                                        <img
                                            src={imageProfile}
                                            className="w-[120px] h-[120px] object-cover rounded-full"
                                        />
                                    ) : (
                                        <img
                                            src={require('../../../assets/perfil_sem_foto.png')}
                                            className="w-[120px] h-[120px] object-cover rounded-full"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-[120px] h-[120px] bg-green-500 rounded-full items-center justify-center flex">
                                    {chat?.chat?.imageUrl ? (
                                        <img
                                            src={chat?.chat?.imageUrl}
                                            className="w-[120px] h-[120px] object-cover rounded-full"
                                        />
                                    ) : (
                                        <MdGroups size={23} color='white' />
                                    )}
                                </div>
                            )}

                            <h3 className="text-white font-bold text-center">
                                {chat?.chat?.type === 'private' ? participant?.name : chat?.chat?.title}
                            </h3>
                            <p className="text-white text-sm">
                                {chat?.chat?.type === 'private' && 'Conversa privada'}
                                {chat?.chat?.type === 'group-private' && 'Grupo privado'}
                                {chat?.chat?.type === 'group-public' && 'Grupo público'}
                            </p>
                        </div>

                        {chat?.chat?.type === 'private' ? (
                            <>
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-white text-sm mt-5">Participantes</h3>
                                {participants.map(item => (
                                    <UserChatItem
                                        key={item.id}
                                        data={item}
                                        participantChat
                                    />
                                ))}
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className='flex items-center w-full justify-between border-b border-green-700 pb-2'>
                            <button className="flex items-center gap-2" onClick={() => setDetailsChat(true)}>
                                {typeChat === 'private' ? (
                                    <div className="w-10 h-10 bg-gray-400 rounded-full">
                                        {imageProfile ? (
                                            <img
                                                src={imageProfile}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        ) : (
                                            <img
                                                src={require('../../../assets/perfil_sem_foto.png')}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-green-500 rounded-full items-center justify-center flex">
                                        {chat?.chat?.imageUrl ? (
                                            <img
                                                src={chat?.chat?.imageUrl}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                        ) : (
                                            <MdGroups size={23} color='white' />
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col items-start">
                                    <h3 className="text-white font-bold text-sm">
                                        {chat?.chat?.type === 'private' ? participant?.name : chat?.chat?.title}
                                    </h3>
                                    <p className="text-xs text-gray-300">Clique para mais detalhes</p>
                                </div>
                            </button>
                            <Dialog.Close>
                                <IoMdCloseCircleOutline size={25} color='white' />
                            </Dialog.Close>
                        </div>

                        <div className="flex flex-col-reverse w-full h-full overflow-y-auto overflow-x-hidden">
                            {messages.map((item, index) => (
                                <MessageItem
                                    key={item.id}
                                    data={item}
                                    typeChat={typeChat}
                                    messagesList={messages}
                                    index={index}
                                />
                            ))}

                            {loading && firstLoad && (
                                <ActivityIndicator size={50} />
                            )}
                        </div>

                        {image && (
                            <div className="w-[150px] h-[150px] bg-white p-1 flex rounded-md ml-5 relative">
                                <img
                                    src={image}
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        setImage(null);
                                        setImageToSend(null);
                                    }}
                                >
                                    <IoMdCloseCircle size={15} color='white' />
                                </button>
                            </div>
                        )}

                        <form
                            className="flex items-center w-full p-1"
                            onSubmit={onFormSubmit}
                        >
                            <input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Digite aqui"
                                className="w-[90%] h-10 bg-white rounded-full px-3 text-black"
                            />

                            <div className="flex gap-3 ml-4 items-center justify-center w-[15%]">
                                <button
                                    type="button"
                                    onClick={openFolderSelect}
                                >
                                    <GrGallery color='white' size={20} />
                                </button>

                                <button
                                    className="h-10 w-10 rounded-full flex items-center justify-center bg-green-600"
                                    type="submit"
                                >
                                    <MdSend color='white' size={20} />
                                </button>
                            </div>
                        </form>

                    </>
                )}

            </Dialog.Content>

            <input
                type='file'
                onChange={(e) => {
                    setFile(e.target.files[0])
                    setCropImage(true);
                }}
                accept="image/png, image/jpeg, image/jpg"
                id='input-image-chat'
                className="hidden"
            />

            {cropImage && (
                <CropImage
                    close={() => setCropImage(false)}
                    file={file}
                    returnType='url'
                    returnUri={(uri, hash) => {
                        setImage(uri);
                        setCropImage(false);
                        setImageToSend(true);
                    }}
                />
            )}

            <ToastContainer />
        </Dialog.Portal>
    )
}