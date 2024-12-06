import React, { useEffect, useState } from "react";
import { api } from "../../../../../../services/api";
import { getImage } from "../../../../../../services/getImage";
import { useNavigate } from "react-router";
import { FaFileAlt, FaShare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import { useMainContext } from "../../../../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../../../../components/ActivityIndicator/ActivityIndicator";
import { CommentResearche } from "./CommentResearche";
import { useTranslation } from "react-i18next";

export function ResearcheItem({ data }) {
    const {t} = useTranslation();
    const { userData } = useMainContext();
    const navigate = useNavigate();
    const [imageProfile, setImageProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [creatingComment, setCreatingComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [viewAllComments, setViewAllComments] = useState(false);

    useEffect(() => {
        getUser();
        getComments();
    }, []);

    async function getUser() {
        const response = await api.get(`/user/${data?.createdBy}`);
        const user = response.data.user;

        setUser(user);
        getImageProfile(user);
    }

    async function getImageProfile(user) {
        const response = await getImage(user?.imgProfileUrl);
        setImageProfile(response);
    }

    async function sendComment() {
        if (!input.trim()) {
            toast.warning(t('digiteComentario'));
            return
        }
        if (creatingComment) {
            return;
        }

        try {
            setCreatingComment(true);
            const response = await api.post('/comment-researche', {
                researcheId: Number(data?.id),
                comment: input,
                walletAuthor: userData?.wallet,
            });

            toast.success(t('comentarioFeito'));
            setInput('');
            comments.unshift(response.data.comment)
        } catch (err) {
            console.log(err);
            toast.error(t('algoDeuErrado'))
        } finally {
            setCreatingComment(false);
        }
    }

    async function getComments() {
        const response = await api.get(`/comments-researche/${data?.id}`);
        setComments(response.data.comments);
    }

    return (
        <div className="flex flex-col p-5 rounded-md bg-[#03364B] w-full">
            <div className="flex gap-2 mb-3 px-5">
                <div className="h-20 w-20 rounded-full bg-gray-400">
                    {imageProfile && (
                        <img
                            src={imageProfile}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col">
                    <p
                        className="text-white font-bold hover:underline hover:cursor-pointer"
                        onClick={() => navigate(`/user-details/${String(user?.wallet).toLowerCase()}`)}
                    >
                        {user?.name}
                    </p>
                    <p className="text-white text-sm">{String(user?.wallet).toLowerCase()}</p>
                    {data?.createdAtTimeStamp && (
                        <p className="text-white text-xs">{format(new Date(data?.createdAtTimeStamp * 1000), 'dd/MM/yyyy - kk:mm')}</p>
                    )}
                </div>
            </div>

            <p className="font-bold text-white mx-5">{t('pesquisa')} #{data?.id}</p>

            <div className="flex flex-col px-5 border-t border-white/50 mt-4 pt-4">
                <h1 className="font-bold text-white text-lg">{data?.title}</h1>
                <p className="text-white text-sm">{data?.thesis}</p>
            </div>

            <div className="flex items-center gap-5 border-b border-white/50 w-full mt-3 pb-5 pt-3 px-5">
                <a
                    href={`https://app.sintrop.com/view-pdf/${data?.file}`}
                    target="_blank"
                >
                    <button
                        className="flex flex-col items-center gap-1 font-bold text-white text-sm"
                    >
                        <FaFileAlt size={20} color='white' />
                        {t('verRelatorio')}
                    </button>
                </a>

                <button
                    className="flex flex-col items-center gap-1"
                    onClick={() => {
                        navigator.clipboard.writeText(`https://app.sintrop.com/researche/${data?.id}`);
                        toast.success('Link copiado para área de transferência.')
                    }}
                >
                    <FaShare color='white' size={20} />
                    <p className="text-white font-bold text-sm">{t('compartilhar')}</p>
                </button>
            </div>

            <div className="flex flex-col px-5">
                <div className="flex items-center justify-between mt-5">
                    <p className="text-white text-sm">{t('comentarios')} ({comments.length})</p>

                    {comments.length > 3 && (
                        <button
                            onClick={() => setViewAllComments(!viewAllComments)}
                            className="text-sm text-white underline"
                        >
                            {viewAllComments ? t('ocultarComentarios') : t('verTodosComentarios')}
                        </button>
                    )}
                </div>

                {userData?.userType === 2 && (
                    <>
                        {userData?.accountStatus === 'blockchain' && (
                            <div className="flex w-full gap-5 mt-3">
                                <input
                                    className="w-[90%] h-10 bg-green-800 rounded-md px-2 text-white"
                                    placeholder={t('digiteAqui')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />

                                <button
                                    className="w-[10%] bg-blue-500 h-10 rounded-md text-sm font-bold text-white"
                                    onClick={sendComment}
                                >
                                    {creatingComment ? (
                                        <ActivityIndicator size={25} />
                                    ) : (
                                        t('comentar')
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="flex flex-col mt-4">
                    {viewAllComments ? (
                        <>
                            {comments.map(item => (
                                <CommentResearche key={item.id} data={item} />
                            ))}
                        </>
                    ) : (
                        <>
                            {comments.slice(0, 3).map(item => (
                                <CommentResearche key={item.id} data={item} />
                            ))}
                        </>
                    )}

                </div>
            </div>

            <ToastContainer />
        </div>
    )
}