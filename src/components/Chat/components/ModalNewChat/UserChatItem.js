import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { api } from "../../../../services/api";
import { ActivityIndicator } from "../../../ActivityIndicator";

export function UserChatItem({ data, chats, chatCreated }) {
    const {userData} = useMainContext();
    const [isChatActive, setIsChatActive] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);

    useEffect(() => {
        //getImageProfile();
        if(chats){
            verifyChatsActive();
        }
    }, []);

    function verifyChatsActive(){
        let ids = [];

        for(var i = 0; i < chats.length; i++){
            const participant = JSON.parse(chats[i].participantData);
            ids.push(participant.id);
        }

        for(var b = 0; b < ids.length; b++){
            if(ids[b] === data.id){
                setIsChatActive(true);
            }
        }
    }

    async function createChat() {
        if(loadingCreate)return;

        setLoadingCreate(true);

        try {
            const response = await api.post('/chat/create', {
                userId: userData?.id,
                userData: JSON.stringify(userData),
                participantId: data.id,
                participantData: JSON.stringify(data),
                type: 'private'
            });

            chatCreated();
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingCreate(false);
        }
    }

    if(userData?.id === data?.id || isChatActive){
        return <div/>
    }

    return (
        <button 
            className="flex items-center gap-2 mb-2 px-2 hover:bg-green-900/40 duration-500 p-1"
            onClick={createChat}
        >
            <div className="w-10 h-10 rounded-full bg-green-500">

            </div>
            {loadingCreate ? (
                <ActivityIndicator size={40} color='white' hiddenIcon/>
            ) : (
                <div className="flex flex-col items-start">
                    <p className="text-sm text-white font-bold">{data?.name}</p>
                    <p className="text-sm text-white">
                        {data?.userType === 1 && 'Produtor(a)'}
                        {data?.userType === 2 && 'Inspetor(a)'}
                        {data?.userType === 3 && 'Pesquisador(a)'}
                        {data?.userType === 4 && 'Desenvolvedor(a)'}
                        {data?.userType === 7 && 'Apoiador(a)'}
                        {data?.userType === 8 && 'Validador(a)'}
                    </p>
                </div>
            )}
        </button>
    )
}