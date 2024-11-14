import React, {useEffect, useState} from "react";
import {FaChevronLeft} from 'react-icons/fa';
import { api } from "../../../../services/api";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { UserCommentItem } from "./UserCommentItem";
import { IoMdSend } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useMainContext } from "../../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";

export function ModalComments({close, dataPubli}){
    const {t} = useTranslation();
    const {walletConnected, userData} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingSend, setLoadingSend] = useState(false);
    const [input, setInput] = useState('');

    useEffect(() => {
        getComments();
    }, []);

    async function getComments(){
        setLoading(true);
        const response = await api.get(`/comments/${dataPubli?.id}`);
        setComments(response.data.comments);
        setLoading(false);
    }

    async function handleSendComment(){
        if(walletConnected === ''){
            toast.error('Você não está conectado!');
            return;
        }
        if(loadingSend || !input.trim()){
            return;
        }

        try{
            setLoadingSend(true);
            const comment = await api.post('/publication/comment', {
                text: input,
                userData: JSON.stringify(userData),
                userId: userData?.id,
                publicationId: dataPubli?.id,
                ownerId: dataPubli?.userId
            });
            getComments();
            setInput('');
            toast.success('Comentário enviado com sucesso!')

            api.post('/notifications/send', {
                from: userData.wallet,
                for: JSON.parse(dataPubli.additionalData).userData.wallet,
                type: 'comment-publication',
                data: JSON.stringify({
                    text1: 'Commented on your post',
                    publiId: dataPubli.id
                }),
            })
        }catch(err){
            console.log(err);
            toast.error('Algo deu errado, tente novamente!');
        }finally{
            setLoadingSend(false);
        }
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close}/>
            <div className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-50'>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={close}
                        >
                            <FaChevronLeft size={17} color='white'/>
                        </button>
                        <p className="font-semibold text-white">{t('comentarios')}</p>
                    </div>

                    <div className="flex flex-col w-full overflow-y-auto mt-3 gap-4">
                        {loading ? (
                            <ActivityIndicator size={50}/>
                        ) : (
                            <>
                                {comments.length > 0 ? (
                                    <>
                                    {comments.map(item => (
                                        <UserCommentItem
                                            key={item.id}
                                            data={item}
                                        />
                                    ))}
                                    </>
                                ) : (
                                    <p className="text-white font-regular text-center mt-10">{t('nenhumComentarioComente')}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <input
                        className="w-[90%] px-2 py-2 rounded-md bg-green-950 text-white"
                        placeholder={t('digiteAqui')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center" onClick={handleSendComment}>
                        {loadingSend ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            <IoMdSend size={22} color='white'/>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}