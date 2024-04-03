import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import format from "date-fns/format";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalMessages } from "./ModalMessages";
import CryptoJS from "crypto-js";

export function ChatItem({ data, socket }) {
    const { userData } = useMainContext();
    const participant = JSON.parse(data?.participantData);
    const [imageProfile, setImageProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [countNotVisualized, setCountNotVisualized] = useState(0);
    const [textMessage, setTextMessage] = useState('');
    const [modalMessages, setModalMessages] = useState(false);

    useEffect(() => {
        getImageProfile();
        getMessages()
    }, []);

    async function getImageProfile() {
        const response = await getImage(participant?.imgProfileUrl);
        setImageProfile(response);
    }

    async function getMessages() {
        const response = await api.get(`/chats/messages/${data.chatId}`);
        const msgs = response.data.messages;
        setMessages(msgs);
        checkNotVisualized(msgs);
        decryptMessage(msgs[0]?.message)
    }

    function checkNotVisualized(msgs) {
        let count = 0;
        for (var i = 0; i < msgs.length; i++) {
            if (!msgs[i].visualized && msgs[i].userId !== userData.id) {
                count += 1;
            }
        }

        setCountNotVisualized(count);
    }

    function decryptMessage(msg) {
        const decrypt = CryptoJS.AES.decrypt(msg, process.env.REACT_APP_DECRYPT_MESSAGE_KEY);
        setTextMessage(decrypt.toString(CryptoJS.enc.Utf8));
    }

    return (
        <Dialog.Root open={modalMessages} onOpenChange={(open) => setModalMessages(open)}>
            <Dialog.Trigger className="flex justify-between px-3 py-2">
                <div className="flex flex-2 gap-2">
                    <div className="w-10 h-10 bg-gray-400 rounded-full">
                        {imageProfile && (
                            <img
                                src={imageProfile}
                                className="w-10 h-10 object-cover rounded-full"
                            />
                        )}
                    </div>

                    <div className="flex flex-col items-start">
                        <p className="font-bold text-white text-sm max-w-[120px] text-ellipsis overflow-hidden truncate">{participant?.name}</p>
                        {messages[0]?.type === 'image' ? (
                            <div className="flex items-center mt-1">
                                <p className="text-xs text-white">{messages[0]?.userId === userData.id && 'Você: '} Imagem</p>
                            </div>
                        ) : (
                            <p className="text-white text-xs max-w-[200px] text-ellipsis overflow-hidden truncate">
                                {messages[0]?.userId === userData.id && 'Você: '}
                                {textMessage}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative right-3 top-0 flex flex-col items-end justify-between">
                    {messages[0] && (
                        <p className="text-xs text-white">
                            {format(new Date(), 'dd/MM/yyyy') === format(new Date(messages[0].createdAt), 'dd/MM/yyyy') ? format(new Date(messages[0].createdAt), 'kk:mm') : format(new Date(messages[0].createdAt), 'dd/MM/yyyy')}
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
                socket={socket}
            />
        </Dialog.Root>
    )
}