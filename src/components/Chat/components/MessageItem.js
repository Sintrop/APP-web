import React, {useEffect, useState} from "react";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import { getImage } from "../../../services/getImage";

export function MessageItem({data}){
    const {userData} = useMainContext();
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
    return(
        <div className={`flex flex-col min-h-[50px] ${isMessageUser ? 'items-end mb-2' : 'items-start mb-4'}`}>
            <div className={`${isMessageUser ? 'bg-[#00FF84]' : 'bg-[#02c0a1]'} p-2 rounded-md min-w-[120px] max-w-[200px]`}>
                <p>{data?.message}</p>
            </div>
        </div>
    )
}