import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import format from "date-fns/format";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalMessages } from "./ModalMessages";
import CryptoJS from "crypto-js";
import { MdGroups } from "react-icons/md";
import { collection, doc, query, onSnapshot, setDoc, Timestamp, orderBy } from "firebase/firestore";
import { firestore } from "../../../services/firebase";

export function ChatItem({ data, attChats }) {
    const { userData } = useMainContext();
    const participant = JSON.parse(data?.participantData);
    const [imageProfile, setImageProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [countNotVisualized, setCountNotVisualized] = useState(0);
    const [textMessage, setTextMessage] = useState('');
    const [modalMessages, setModalMessages] = useState(false);

    useEffect(() => {
        getImageProfile();
    }, []);

    const messagesThreadsRef = collection(firestore, "MESSAGE_THREADS");
    const chatRef = doc(messagesThreadsRef, data?.chatId);
    const messagesRef = collection(chatRef, 'MESSAGES');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    useEffect(() => {
        const subscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => {
                const firebaseData = doc.data();
                const messageData = {
                    id: doc.id,
                    ...firebaseData
                }

                return messageData;
            });

            decryptMessage(messages[0].message);
            setMessages(messages);
        });

        return () => subscribe;
    }, []);

    async function getImageProfile() {
        const response = await getImage(participant?.imgProfileUrl);
        setImageProfile(response);
    }

    function decryptMessage(msg) {
        const decrypt = CryptoJS.AES.decrypt(msg, process.env.REACT_APP_DECRYPT_MESSAGE_KEY);
        setTextMessage(decrypt.toString(CryptoJS.enc.Utf8));
    }

    return (
        <Dialog.Root open={modalMessages} onOpenChange={(open) => {
            setModalMessages(open)
            attChats();
        }}>
            <Dialog.Trigger className="flex justify-between px-3 py-2">
                <div className="flex flex-2 gap-2">
                    {data?.chat?.type === 'private' ? (
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
                            {data?.chat?.imageUrl ? (
                                <img
                                    src={data?.chat?.imageUrl}
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                            ) : (
                                <MdGroups size={23} color='white' />
                            )}
                        </div>
                    )}

                    <div className="flex flex-col items-start">
                        <p className="font-bold text-white text-sm max-w-[120px] text-ellipsis overflow-hidden truncate">
                            {data?.chat?.type === 'private' ? participant.name : data?.chat?.title}
                        </p>
                        {messages[0]?.type === 'image' ? (
                            <div className="flex items-center mt-1">
                                <p className="text-xs text-white">{messages[0]?.userId === userData.id && 'Você: '} Imagem</p>
                            </div>
                        ) : (
                            <p className="text-white text-xs max-w-[200px] text-ellipsis overflow-hidden truncate">
                                {messages[0]?.user?.id === userData.id && 'Você: '}
                                {textMessage}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative right-3 top-0 flex flex-col items-end justify-between">
                    {messages[0] && (
                        <p className="text-xs text-white">
                            {format(new Date(), 'dd/MM/yyyy') === format(new Date(messages[0].createdAt.toDate()), 'dd/MM/yyyy') ? format(new Date(messages[0].createdAt.toDate()), 'kk:mm') : format(new Date(messages[0].createdAt.toDate()), 'dd/MM/yyyy')}
                        </p>
                    )}

                    {countNotVisualized > 0 && (
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500">
                            <p className="text-xs text-white">{countNotVisualized > 99 ? '+99' : countNotVisualized}</p>
                        </div>
                    )}
                </div>
            </Dialog.Trigger>

            <ModalMessages
                chat={data}
                imageProfile={imageProfile}
                participant={participant}
                messages={messages}
                typeChat={data?.chat?.type}
            />
        </Dialog.Root>
    )
}