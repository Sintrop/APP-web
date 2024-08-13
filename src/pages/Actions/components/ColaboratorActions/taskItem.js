import React, { useState, useEffect } from 'react';
import { get } from '../../../../config/infura';
import { api } from '../../../../services/api';
import { FaRegComment } from 'react-icons/fa';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CommentItem } from './CommentItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalViewComments } from './ModalViewComments';
import { ModalConfirmAssign } from './ModalConfirmAssign';
import Loader from '../../../../components/Loader';
import { Marker } from './Marker';
import { getImage } from '../../../../services/getImage';
import { format } from 'date-fns';
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { toast, ToastContainer } from 'react-toastify';

export function TaskItem({ data, userData }) {
    const { t } = useTranslation();
    const { walletAddress } = useParams();
    const [loadingPostComment, setLoadingPostComment] = useState(false);
    const [img, setImg] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [status, setStatus] = useState(0);
    const [openAreaComment, setOpenAreaComment] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [modalComments, setModalComments] = useState(false);
    const [modalAssign, setModalAssign] = useState(false);
    const [responsible, setResponsible] = useState(null);
    const [responsibleData, setResponsibleData] = useState(null);
    const [loadingResponsible, setLoadingResponsible] = useState(false);
    const [imageProfile, setImageProfile] = useState('');
    const [viewAllComments, setViewAllComments] = useState(false);

    useEffect(() => {
        setStatus(Number(data.status));
        setComments(data.CommentTaskColaborator);
        if (data.responsible) {
            setResponsible(data?.responsible)
        }
        if (data?.photoHash) {
            setImg(JSON.parse(data.photoHash)[0]);
        }
    }, []);

    useEffect(() => {
        getResponsibleData();
    }, [responsible]);

    async function getResponsibleData() {
        try {
            setLoadingResponsible(true);
            const response = await api.get(`/user/${responsible}`);
            if (response.data.user) {
                setResponsibleData(response.data.user)
                getImageProfile(response.data.user.imgProfileUrl)
            }
        } catch (err) {

        } finally {
            setLoadingResponsible(false);
        }
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response)
    }

    async function updateStatus(value) {
        try {
            await api.put('/task/status', {
                id: data.id,
                status: Number(value)
            })
        } catch (err) {
            console.log(err);
        }
    }

    async function handleComment() {
        if (userData?.accountStatus !== 'blockchain') {
            toast.error(t('necessitaCadastroBlock'))
            return;
        }

        try {
            setLoadingPostComment(true);
            const createComment = await api.post('/task/comment', {
                walletAuthor: userData.wallet,
                comment: comment,
                taskId: data.id,
                userData: JSON.stringify(userData)
            })
            comments.unshift(createComment.data.createComment);
            setComment('');
        } catch (err) {
            toast.error(t('algoDeuErrado'))
        } finally {
            setLoadingPostComment(false)
        }
    }

    return (
        <div key={data.id} className='flex flex-col w-full bg-[#0a4303] rounded-md p-5 mb-5'>
            <div className='flex items-center justify-between border-b pb-2 px-5'>
                <div className='flex flex-col'>
                    <p className='font-bold text-blue-500 text-lg'>#{data.id} - {data.title}</p>
                    {data.createdAt && (
                        <p className='text-xs text-gray-300'>{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    {data.type === 'feedback' ? (
                        <Marker type='feedback' />
                    ) : (
                        <>
                            {data.priority === 1 && (
                                <Marker type='low' />
                            )}
                            {data.priority === 2 && (
                                <Marker type='average' />
                            )}
                            {data.priority === 3 && (
                                <Marker type='high' />
                            )}
                            {data.team === 1 && (
                                <Marker type='frontend' active />
                            )}
                            {data.team === 2 && (
                                <Marker type='contracts' active />
                            )}
                            {data.team === 3 && (
                                <Marker type='mobile' active />
                            )}
                            {data.team === 4 && (
                                <Marker type='design' active />
                            )}
                            {data.team === 5 && (
                                <Marker type='ux' active />
                            )}
                            {data.team === 6 && (
                                <Marker type='api' active />
                            )}
                            <Marker type='task' />
                        </>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-1 px-5 my-3'>
                <p className='text-justify text-white'>{data.description}</p>
                {img && (
                    <img
                        src={img}
                        className='lg:h-[350px] object-contain'
                    />
                )}
            </div>

            <div className='flex items-center w-full justify-between gap-3'>
                <div className='flex items-center gap-3 w-full'>
                    {responsible ? (
                        <>
                            {loadingResponsible ? (
                                <>
                                    <Loader
                                        type='spinning'
                                        color='white'
                                    />
                                </>
                            ) : (
                                <>
                                    <div className='flex items-center justify-between w-full px-5'>
                                        <div className='flex flex-col'>
                                            <p className='text-blue-500 font-bold text-sm'>{t('responsavelTask')}</p>
                                            <div className='flex gap-2 items-center mb-2'>
                                                <img
                                                    className='w-[40px] h-[40px] rounded-full border-2 object-cover'
                                                    src={imageProfile}
                                                />
                                                <p className='text-white font-bold text-sm'>{responsibleData?.name}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            {String(userData?.wallet).toUpperCase() === responsible && (
                                                <>
                                                    {editStatus ? (
                                                        <select
                                                            className='w-40'
                                                            value={String(status)}
                                                            onChange={(e) => {
                                                                setStatus(Number(e.target.value))
                                                                updateStatus(e.target.value)
                                                                setEditStatus(false);
                                                            }}
                                                        >
                                                            <option value='0'>Em Análise</option>
                                                            <option value='1'>Futuramente</option>
                                                            <option value='2'>Em Desenvolvimento</option>
                                                            <option value='3'>Recusada</option>
                                                            <option value='4'>Concluida</option>
                                                        </select>
                                                    ) : (
                                                        <p
                                                            className='text-sm border-b-2 text-blue-500 border-blue-500 cursor-pointer'
                                                            onClick={() => setEditStatus(true)}
                                                        >Editar Status</p>
                                                    )}
                                                </>
                                            )}
                                            {status === 0 && (
                                                <div className='px-4 py-1 bg-yellow-500 flex items-center justify-center rounded-md'>
                                                    <p className='font-bold text-white'>Em Análise</p>
                                                </div>
                                            )}
                                            {status === 1 && (
                                                <div className='px-4 py-1 bg-gray-500 flex items-center justify-center rounded-md'>
                                                    <p className='font-bold text-white'>Futuramente</p>
                                                </div>
                                            )}
                                            {status === 2 && (
                                                <div className='px-4 py-1 bg-blue-500 flex items-center justify-center rounded-md'>
                                                    <p className='font-bold text-white'>Em Desenvolvimento</p>
                                                </div>
                                            )}
                                            {status === 3 && (
                                                <div className='px-4 py-1 bg-red-500 flex items-center justify-center rounded-md'>
                                                    <p className='font-bold text-white'>Recusada</p>
                                                </div>
                                            )}
                                            {status === 4 && (
                                                <div className='px-4 py-1 bg-green-500 flex items-center justify-center rounded-md'>
                                                    <p className='font-bold text-white'>Concluida</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                        </>
                    ) : (
                        <>
                            {true ? (
                                <button
                                    className='px-3 py-2 bg-blue-500 rounded-md text-white font-bold text-sm'
                                    onClick={() => setModalAssign(true)}
                                >
                                    Atribuir tarefa
                                </button>
                            ) : (
                                <>

                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-1 border-t pt-2">
                <p className="text-white text-sm">Comentários ({comments.length})</p>

                {comments.length > 3 && (
                    <button
                        onClick={() => setViewAllComments(!viewAllComments)}
                        className="text-sm text-white underline"
                    >
                        {viewAllComments ? 'Ocultar todos os comentários' : 'Ver todos os comentários'}
                    </button>
                )}
            </div>

            <div className="flex w-full gap-5 mt-3">
                <input
                    className="w-[90%] h-10 bg-green-800 rounded-md px-2 text-white"
                    placeholder="Digite seu comentário aqui"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    className="w-[10%] bg-blue-500 h-10 rounded-md text-sm font-bold text-white"
                    onClick={handleComment}
                >
                    {loadingPostComment ? (
                        <ActivityIndicator size={25} />
                    ) : (
                        'Comentar'
                    )}
                </button>
            </div>


            <div className='flex flex-col w-full'>
                <div className='flex flex-col px-5 mt-3 gap-3'>
                    {viewAllComments ? (
                        <>
                            {comments.map(item => (
                                <CommentItem data={item} key={item.id} />
                            ))}
                        </>
                    ) : (
                        <>
                            {comments.slice(0, 3).map(item => (
                                <CommentItem data={item} key={item.id} />
                            ))}
                        </>
                    )}
                </div>
            </div>


            <Dialog.Root
                open={modalComments}
                onOpenChange={(open) => setModalComments(open)}
            >
                <ModalViewComments
                    data={data}
                    userData={userData}
                />
            </Dialog.Root>

            <Dialog.Root
                open={modalAssign}
                onOpenChange={(open) => setModalAssign(open)}
            >
                <ModalConfirmAssign
                    data={{
                        id: data.id,
                        wallet: userData?.wallet
                    }}
                    close={(data) => {
                        setModalAssign(false);
                        setResponsible(data.responsible);
                    }}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    )
}