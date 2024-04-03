import React, {useState, useEffect} from 'react';
import {get} from '../../../../config/infura';
import { api } from '../../../../services/api';
import {FaRegComment} from 'react-icons/fa';
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

export function FeedbackItem({data, userData}){
    const {t} = useTranslation();
    const {walletAddress} = useParams();
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

    useEffect(() => {
        getImageFeedback();
        setStatus(Number(data.status));
        setComments(data.CommentsFeedback);
        if(data.responsible){
            setResponsible(data?.responsible)
        }
    },[]);

    useEffect(() => {
        getResponsibleData();
    },[responsible]);

    async function getResponsibleData(){
        try{
            setLoadingResponsible(true);
            const response = await api.get(`/user/${responsible}`);
            if(response.data.user){
                setResponsibleData(response.data.user)
                getImageProfile(response.data.user.imgProfileUrl)
            }
        }catch(err){

        }finally{
            setLoadingResponsible(false);
        }
    }

    async function getImageFeedback(){
        const response = await getImage(JSON.parse(data.photoHash)[0]);
        setImg(response);
    }

    async function getImageProfile(hash){
        const response = await getImage(hash);
        setImageProfile(response)
    }

    async function updateStatus(value){
        try{
            await api.put('/feedback/status',{
                id: data.id,
                status: Number(value)
            })
        }catch(err){
            console.log(err);
        }
    }

    async function handleComment(){
        try{
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
        }catch(err){
            alert('erro')
        }finally{
            setLoadingPostComment(false)
        }
    }

    return(
        <div key={data.id} className='flex flex-col w-full bg-[#0a4303] rounded-md p-5 mb-5'>
            <div className='flex items-center justify-between'>
                <p className='font-bold text-blue-500 text-lg'>#{data.id} - {data.title}</p>

                <div className='flex items-center gap-2'>
                    {data.type === 'feedback' ? (
                        <Marker type='feedback'/>
                    ) : (
                        <>
                        {data.priority === 1 && (
                            <Marker type='low'/>
                        )}
                        {data.priority === 2 && (
                            <Marker type='average'/>
                        )}
                        {data.priority === 3 && (
                            <Marker type='high'/>
                        )}
                        {data.team === 1 && (
                            <Marker type='frontend' active/>
                        )}
                        {data.team === 2 && (
                            <Marker type='contracts' active/>
                        )}
                        {data.team === 3 && (
                            <Marker type='mobile' active/>
                        )}
                        {data.team === 4 && (
                            <Marker type='design' active/>
                        )}
                        {data.team === 5 && (
                            <Marker type='ux' active/>
                        )}
                        {data.team === 6 && (
                            <Marker type='api' active/>
                        )}
                        <Marker type='task'/>
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

            {openAreaComment ? (
                <div className='flex w-full gap-3'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.imgProfileUrl}`}
                        className='w-[50px] h-[50px] rounded-full border-2'
                    />

                    <div className='flex flex-col w-full mt-[-5px]'>
                        <p className='font-bold text-blue-500 mb-1'>{userData.name}</p>
                        <textarea
                            className='bg-green-950 border rounded-md w-full p-2 h-20 text-white'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Escreva aqui seu comentário'
                            style={{resize: 'none'}}
                        />

                        <div className='flex items-center gap-4 w-full justify-end mt-2'>
                            <button
                                className='p-3 text-white font-bold'
                                onClick={() => {
                                    setComment('');
                                    setOpenAreaComment(false)
                                }}
                            >
                                {t('Cancel')}
                            </button>

                            <button
                                className='px-3 py-2 text-white font-bold rounded-md bg-blue-500'
                                onClick={handleComment}
                            >
                                {t('Comment')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col w-full'>
                    <div className='flex items-center w-full justify-between gap-3'>
                        <div className='flex items-center gap-1'>
                            {userData?.userType === 4 && (
                                <>
                                <button
                                    onClick={() => setOpenAreaComment(true)}
                                >
                                    <FaRegComment size={25} color='white'/>
                                </button>
                                <p className='text-white'>{comments.length}</p>
                                </>
                            )}
                        </div>

                        <div className='flex items-center gap-3'>
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
                                            <div className='flex flex-col items-end'>
                                                <p className='text-blue-500 font-bold text-sm'>{t('Responsible for the task')}</p>
                                                <div className='flex gap-2 items-center mb-2'>
                                                    <p className='text-white font-bold text-sm'>{responsibleData?.name}</p>
                                                    <img
                                                        className='w-[40px] h-[40px] rounded-full border-2'
                                                        src={imageProfile}
                                                    />
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
                    </div>

                    {comments.length === 0 ? (
                        <p className='text-gray-500'>Nenhum comentário</p>
                    ) : (
                        <div className='flex flex-col mt-2'>
                            <CommentItem data={comments[comments.length - 1]}/>
                            {comments.length > 1 && (
                                <p 
                                    onClick={() => setModalComments(true)}
                                    className='cursor-pointer text-gray-300 text-sm mt-2'
                                >
                                    Ver todos os comentários
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

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
        </div>
    )
}