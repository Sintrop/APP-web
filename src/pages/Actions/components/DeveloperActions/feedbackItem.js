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
import { ModalFinishTask } from './ModalFinishTask';
import { toast } from 'react-toastify';

export function FeedbackItem({ data, userData }) {
    const { t } = useTranslation();
    const { walletAddress } = useParams();
    const [loadingPostComment, setLoadingPostComment] = useState(false);
    const [img, setImg] = useState('');
    const [modalFinish, setModalFinish] = useState(false);
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
    const [additionalData, setAdditionalData] = useState(null);

    useEffect(() => {
        setStatus(Number(data.status));
        setComments(data.CommentsFeedback);
        if (data.responsible) {
            setResponsible(data?.responsible)
        }
        if (data?.photoHash) {
            getImageFeedback();
        }
        if(data?.additionalData){
            setAdditionalData(JSON.parse(data?.additionalData));
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

    async function getImageFeedback() {
        const arrayImages = JSON.parse(data.photoHash)
        if (arrayImages.length > 0) {
            if (String(arrayImages[0]).includes('https://')) {
                setImg(arrayImages[0])
            } else {
                const response = await getImage(JSON.parse(data.photoHash)[0]);
                setImg(response);
            }
        }
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response)
    }

    async function handleComment() {
        try {
            setLoadingPostComment(true);
            const createComment = await api.post('/feedback/comment', {
                walletAuthor: userData.wallet,
                comment: comment,
                feedbackId: data.id,
                userData: JSON.stringify(userData)
            })
            comments.push(createComment.data.createComment);
            setComment('');
            setOpenAreaComment(false);
        } catch (err) {
            alert('erro')
        } finally {
            setLoadingPostComment(false)
        }
    }

    return (
        <div key={data.id} className='flex flex-col w-full bg-[#0a4303] rounded-md p-5 mb-5'>
            <div className='flex items-center justify-between'>
                <p className='font-bold text-blue-500 text-lg'>#{data.id} - {data.title}</p>

                <div className='flex items-center gap-2'>
                    <p className='text-white'>+{data?.pts} pts</p>
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
                                <Marker type='frontend' />
                            )}
                            {data.team === 2 && (
                                <Marker type='contracts' />
                            )}
                            {data.team === 3 && (
                                <Marker type='mobile' />
                            )}
                            {data.team === 4 && (
                                <Marker type='design' />
                            )}
                            {data.team === 5 && (
                                <Marker type='ux' />
                            )}
                            {data.team === 6 && (
                                <Marker type='api' />
                            )}
                            <Marker type='task' />
                        </>
                    )}
                </div>
            </div>
            <p className='text-justify text-white'>{data.description}</p>
            {img && (
                <img
                    src={img}
                    className='lg:h-[350px] object-contain'
                />
            )}

            {data.createdAt && (
                <p className='text-xs mt-3 text-gray-300'>{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
            )}

            <div className='flex items-center gap-3 border-t pt-2'>
                {responsible ? (
                    <>
                        {loadingResponsible ? (
                            <>
                                <ActivityIndicator size={50} />
                            </>
                        ) : (
                            <div className='flex items-center justify-between w-full'>
                                <div className='flex flex-col items-start'>
                                    <p className='text-blue-500 font-bold text-sm'>{t('Responsible for the task')}</p>
                                    <div className='flex gap-2 items-center mb-2'>
                                        <img
                                            className='w-[40px] h-[40px] rounded-full border-2 object-cover'
                                            src={imageProfile}
                                        />
                                        <p className='text-white font-bold text-sm'>{responsibleData?.name}</p>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        {status === 0 && (
                                            <div className='px-4 py-1 border-2 border-yellow-500 flex items-center justify-center rounded-md'>
                                                <p className='font-bold text-yellow-500'>Em Análise</p>
                                            </div>
                                        )}
                                        {status === 1 && (
                                            <div className='px-4 py-1 border-2 border-gray-500 flex items-center justify-center rounded-md'>
                                                <p className='font-bold text-gray-500'>Futuramente</p>
                                            </div>
                                        )}
                                        {status === 2 && (
                                            <div className='px-4 py-1 border-2 border-blue-500 flex items-center justify-center rounded-md'>
                                                <p className='font-bold text-blue-500'>Em Desenvolvimento</p>
                                            </div>
                                        )}
                                        {status === 3 && (
                                            <div className='px-4 py-1 border-2 border-red-500 flex items-center justify-center rounded-md'>
                                                <p className='font-bold text-red-500'>Recusada</p>
                                            </div>
                                        )}
                                        {status === 4 && (
                                            <div className='px-4 py-1 border-2 border-green-500 flex items-center justify-center rounded-md'>
                                                <p className='font-bold text-green-500'>Concluida</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {String(userData?.wallet).toUpperCase() === responsible && (
                                    <>
                                        {status !== 4 && (
                                            <button
                                                className='font-bold text-white px-3 rounded-md h-10 bg-green-700'
                                                onClick={() => setModalFinish(true)}
                                            >
                                                Finalizar task
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                    </>
                ) : (
                    <>
                        {userData?.userType === 4 ? (
                            <button
                                className='px-3 py-2 bg-blue-500 rounded-md text-white font-bold text-sm'
                                onClick={() => setModalAssign(true)}
                            >
                                Atribuir para mim
                            </button>
                        ) : (
                            <>

                            </>
                        )}
                    </>
                )}
            </div>

            {additionalData && (
                <div className='flex flex-col mt-3'>
                    <p className='text-gray-300 text-sm'>Dados:</p>
                    <a
                        href={additionalData?.urlPR}
                        target='_blank'
                        className='text-blue-400 underline'
                    >
                        {additionalData?.urlPR}
                    </a>
                    <p className='text-white text-sm'>{additionalData?.description}</p>
                </div>
            )}

            <div className="flex items-center justify-between mt-3">
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

            <Dialog.Root
                open={modalFinish}
                onOpenChange={(open) => setModalFinish(open)}
            >
                <ModalFinishTask
                    close={() => setModalFinish(false)}
                    taskId={data?.id}
                    success={() => {
                        toast.success('Task finalizada com sucesso!')
                        setStatus(4);
                    }}
                />
            </Dialog.Root>
        </div>
    )
}