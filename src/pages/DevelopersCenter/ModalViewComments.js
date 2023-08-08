import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import { CommentItem } from './CommentItem';
import Loading from '../../components/Loading';

export function ModalViewComments({data, userData}){
    const {walletAddress} = useParams();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loadingPostComment, setLoadingPostComment] = useState(false);

    useEffect(() => {
        getComments();
    },[]);

    async function getComments() {
        setLoading(true);
        const response = await api.get(`/feedback/comments/${Number(data.id)}`);
        setComments(response.data.comments);
        setLoading(false);
    }

    async function handleComment(){
        try{
            setLoadingPostComment(true);
            const createComment = await api.post('/feedback/comment', {
                walletAuthor: userData.wallet,
                comment: comment,
                feedbackId: data.id,
            })
            comments.push(createComment.data.createComment);
            setComment('');
            toast.success('Comentário publicado!')
        }catch(err){
            toast.error(`${t('Algo deu errado, tente novamente!')}`)
        }finally{
            setLoadingPostComment(false)
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-black/60 fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[800px] h-[500px] bg-black rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between mb-5'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>{t('Comments')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>
                
                <div className='flex flex-col w-full h-full gap-5 overflow-auto'>
                    {loading ? (
                        <Loader
                            type='hash'
                            color='white'
                        />
                    ) : (
                        <>
                            {comments.map(item => (
                                <CommentItem
                                    data={item}
                                />
                            ))}
                        </>
                    )}
                </div>

                <div className='flex w-full gap-3'>
                    <div className='flex flex-col w-full mt-[-5px]'>
                        <div className='flex items-center gap-4 w-full justify-end mt-2'>
                        <textarea
                            className='bg-black border rounded-md w-full p-2 h-12 text-white'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Escreva aqui seu comentário'
                            style={{resize: 'none'}}
                        />


                            <button
                                className='px-3 py-2 text-white font-bold rounded-md bg-[#ff9900]'
                                onClick={handleComment}
                            >
                                {t('Comment')}
                            </button>
                        </div>
                    </div>
                </div> 
            </Dialog.Content>

            {loadingPostComment && (
                <Loading/>
            )}

            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}