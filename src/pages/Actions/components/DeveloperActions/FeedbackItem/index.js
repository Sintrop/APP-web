import React, { useState, useEffect } from 'react';
import { api } from '../../../../../services/api';
import { useTranslation } from 'react-i18next';
import { CommentItem } from './components/CommentItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalViewComments } from './components/ModalViewComments';
import { ModalConfirmAssign } from './components/ModalConfirmAssign';
import { Marker } from './components/Marker';
import { getImage } from '../../../../../services/getImage';
import { format } from 'date-fns';
import { ActivityIndicator } from '../../../../../components/ActivityIndicator';
import { ModalFinishTask } from './components/ModalFinishTask';
import { toast } from 'react-toastify';
import { ModalEditFeedback } from './components/ModalEditFeedback';
import { ModalConfirmDiscard } from './components/ModalConfirmDiscard';

export function FeedbackItem({ data, userData, discardTask }) {
    const { t } = useTranslation();
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
    const [modalEdit, setModalEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(1);
    const [team, setTeam] = useState(1);
    const [pts, setPts] = useState(1);
    const [modalDiscard, setModalDiscard] = useState(false);

    useEffect(() => {
        setTitle(data?.title);
        setDescription(data?.description);
        setTeam(data?.team);
        setPriority(data?.priority);
        setPts(data?.pts);
        setStatus(Number(data.status));
        setComments(data.CommentsFeedback);
        if (data.responsible) {
            setResponsible(data?.responsible)
        }
        if (data?.photoHash) {
            getImageFeedback();
        }
        if (data?.additionalData) {
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
                <div className='flex flex-col items-start mb-1'>
                    <p className='font-bold text-blue-500 text-lg'>#{data.id} - {title}</p>
                    {String(userData?.wallet).toUpperCase() === String(data?.wallet).toUpperCase() && (
                        <button
                            className='text-white underline text-sm'
                            onClick={() => setModalEdit(true)}
                        >
                            {t('editarTask')}
                        </button>
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    <p className='text-white'>+{pts} pts</p>
                    {data.type === 'feedback' ? (
                        <Marker type='feedback' />
                    ) : (
                        <>
                            {priority === 1 && (
                                <Marker type='low' />
                            )}
                            {priority === 2 && (
                                <Marker type='average' />
                            )}
                            {priority === 3 && (
                                <Marker type='high' />
                            )}
                            {team === 1 && (
                                <Marker type='frontend' />
                            )}
                            {team === 2 && (
                                <Marker type='contracts' />
                            )}
                            {team === 3 && (
                                <Marker type='mobile' />
                            )}
                            {team === 4 && (
                                <Marker type='design' />
                            )}
                            {team === 5 && (
                                <Marker type='ux' />
                            )}
                            {team === 6 && (
                                <Marker type='api' />
                            )}
                            <Marker type='task' />
                        </>
                    )}
                </div>
            </div>
            <p className='text-justify text-white'>{description}</p>
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
                {status === 3 ? (
                    <>
                        {status === 3 && (
                            <div className='px-4 py-1 border-2 border-red-500 flex items-center justify-center rounded-md'>
                                <p className='font-bold text-red-500'>{t('descartada')}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {responsible ? (
                            <>
                                {loadingResponsible ? (
                                    <>
                                        <ActivityIndicator size={50} />
                                    </>
                                ) : (
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='flex flex-col items-start'>
                                            <p className='text-blue-500 font-bold text-sm'>{t('responsavelTask')}</p>
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
                                                        <p className='font-bold text-yellow-500'>{t('emAnalise')}</p>
                                                    </div>
                                                )}
                                                {status === 1 && (
                                                    <div className='px-4 py-1 border-2 border-gray-500 flex items-center justify-center rounded-md'>
                                                        <p className='font-bold text-gray-500'>{t('futuramente')}</p>
                                                    </div>
                                                )}
                                                {status === 2 && (
                                                    <div className='px-4 py-1 border-2 border-blue-500 flex items-center justify-center rounded-md'>
                                                        <p className='font-bold text-blue-500'>{t('emDesenvolvimento')}</p>
                                                    </div>
                                                )}
                                                {status === 4 && (
                                                    <div className='px-4 py-1 border-2 border-green-500 flex items-center justify-center rounded-md'>
                                                        <p className='font-bold text-green-500'>{t('concluida')}</p>
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
                                                        {t('finalizarTask')}
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
                                    <div className='flex items-center gap-5'>
                                        <button
                                            className='px-3 py-2 bg-blue-500 rounded-md text-white font-bold text-sm'
                                            onClick={() => setModalAssign(true)}
                                        >
                                            {t('atribuir')}
                                        </button>

                                        <button
                                            className='text-white underline text-sm'
                                            onClick={() => setModalDiscard(true)}
                                        >
                                            {t('descartar')}
                                        </button>
                                    </div>
                                ) : (
                                    <>

                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {additionalData && (
                <div className='flex flex-col mt-3'>
                    <p className='text-gray-300 text-sm'>{t('dados')}:</p>
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

            <div className="flex w-full gap-5 mt-3">
                <input
                    className="w-[90%] h-10 bg-green-800 rounded-md px-2 text-white"
                    placeholder={t('digiteAqui')}
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
                        t('comentar')
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
                    close={() => setModalAssign(false)}
                    success={(data) => {
                        setResponsible(data.responsible);
                        setStatus(2);
                    }}
                />
            </Dialog.Root>

            <Dialog.Root
                open={modalDiscard}
                onOpenChange={(open) => setModalDiscard(open)}
            >
                <ModalConfirmDiscard
                    close={() => setModalDiscard(false)}
                    data={data}
                    success={() => {
                        toast.success('Task descartada!');
                        setStatus(3);
                        discardTask(data?.id)
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

            <Dialog.Root
                open={modalEdit}
                onOpenChange={(open) => setModalEdit(open)}
            >
                <ModalEditFeedback
                    close={() => setModalEdit(false)}
                    success={(feedback) => {
                        toast.success('Alterações salvas!');
                        setTitle(feedback?.title);
                        setDescription(feedback?.description);
                        setTeam(feedback?.team);
                        setPriority(feedback?.priority);
                        setPts(feedback?.pts);
                    }}
                    data={data}
                />
            </Dialog.Root>
        </div>
    )
}