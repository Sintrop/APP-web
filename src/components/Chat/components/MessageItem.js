import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import { getImage } from "../../../services/getImage";
import CryptoJS from 'crypto-js';
import format from "date-fns/format";

export function MessageItem({ data }) {
    const { userData } = useMainContext();
    const [isMessageUser, setIsMessageUser] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const [image, setImage] = useState(null);
    const [viewImage, setViewImage] = useState(false);

    useEffect(() => {
        if (data.userId === userData.id) {
            setIsMessageUser(true);
        } else {
            setIsMessageUser(false);
        }
    }, [data]);

    useEffect(() => {
        visualizedMsg();
        decryptMessage(data?.message);

        if (data.type === 'image') {
            const photos = JSON.parse(data.photos);
            getImages(photos[0]);
        }
    }, []);

    async function getImages(hash) {
        const response = await getImage(hash);
        setImage(response);
    }

    async function visualizedMsg() {
        if (data.visualized) {
            return;
        }
        if (data.userId === userData.id) {
            return;
        }

        await api.put('/chat/message/visualized', {
            messageId: data.id
        })
    }

    function decryptMessage(msg) {
        const decrypt = CryptoJS.AES.decrypt(msg, process.env.REACT_APP_DECRYPT_MESSAGE_KEY);
        setTextMessage(decrypt.toString(CryptoJS.enc.Utf8));
    }

    return (
        <div className={`flex flex-col mb-2 ${isMessageUser ? 'items-end' : 'items-start'}`}>
            <div className={`${isMessageUser ? 'bg-[#00FF84]' : 'bg-[#02c0a1]'} p-2 rounded-md min-w-[120px] max-w-[200px]`}>
                {data.type === 'image' && (
                    <div className="w-[150px] h-[150px] rounded-md bg-gray-400">
                        {image && (
                            <img
                                src={image}
                                className="w-[150px] h-[150px] rounded-md object-cover"
                            />
                        )}
                    </div>
                )}
                <p>{textMessage}</p>
                {data.createdAt && (
                    <p className={`${isMessageUser ? 'text-right' : 'text-left'} text-xs text-gray-800 mt-1`}>
                        {format(new Date(), 'dd/MM/yyyy') === format(new Date(data.createdAt), 'dd/MM/yyyy') ? format(new Date(data.createdAt), 'kk:mm') : format(new Date(data.createdAt), 'dd/MM/yyyy')}
                    </p>
                )}
            </div>
        </div>
    )
}