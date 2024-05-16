import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router";

import { getImage } from "../../../../services/getImage";

//icons
import { FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { BsChat } from "react-icons/bs";

//components
import { AcceptInspectionPubli } from "./AcceptInspectionPubli";
import { DevReportPubli } from "./DevReportPubli";
import { WithdrawTokensPubli } from "./WithdrawTokensPubli";
import { ContributeTokensPubli } from "./ContributeTokensPubli";
import { RealizeInspectionPubli } from "./RealizeInspectionPubli";
import { NewUserPubli } from "./NewUserPubli";
import { PubliUser } from "./PubliUser";
import { InvalidateUserPubli } from "./InvalidateUserPubli";
import { useMainContext } from '../../../../hooks/useMainContext';
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../../../services/api";
import { InvalidateInspectionPubli } from "./InvalidateInspectionPubli";
import { ModalLikes } from "../ModalLikes";
import { ModalComments } from "../ModalComments";
import { PublishResearche } from "./PublishResearche";
import { ProofReduce } from "./ProofReduce";
import { InviteWalletPubli } from "./InviteWalletPubli";

export function PublicationItem({ data }) {
    const { walletConnected, userData: user } = useMainContext();
    const navigate = useNavigate();
    const additionalData = JSON.parse(data.additionalData);
    const userData = additionalData.userData;
    const [imageProfile, setImageProfile] = useState(null);
    const [visiblePubli, setVisiblePubli] = useState(true);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [modalLikes, setModalLikes] = useState(false);
    const [modalComments, setModalComments] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getImageProfile();
        setLikes(data.LikesPublication.length);
        setComments(data?.CommentsPublication)
    }, []);

    useEffect(() => {
        if (walletConnected !== '') checkLiked();
    }, [walletConnected]);

    async function getImageProfile() {
        const imageUrl = await getImage(userData?.imgProfileUrl);
        setImageProfile(imageUrl);
    }

    async function handleLike() {
        if (walletConnected === '') {
            toast.error('Você não está conectado!')
            return;
        }

        if (user?.accountStatus === 'guest' || user?.accountStatus === 'pending') {
            toast.error('Você ainda não efetivou seu cadastro na Blockchain')
            return;
        }
        setLiked(!liked);
        if (liked) {
            setLikes(likes - 1);
            try {
                await api.delete(`/publication/like/${data.id}/${user.id}`);
            } catch (err) {
                console.log(err)
            }
        } else {
            setLikes(likes + 1);
            toast.success('Você curtiu uma publicação!')
            await api.post('/publication/like', {
                idPubli: data.id,
                userData: JSON.stringify(user),
                userId: user.id,
                ownerId: data?.userId
            })
            await api.post('/notifications/send', {
                from: user.wallet,
                for: userData?.wallet,
                type: 'like-publication',
                data: JSON.stringify({
                    text1: 'Liked your post',
                    publiId: data.id
                }),
            })
        }
    }

    async function checkLiked() {
        const response = await api.get(`/check-liked/${user?.id}/${data?.id}`);
        if (response.data.liked) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }

    if (!visiblePubli) {
        return <div />
    }

    return (
        <div className="w-[93%] mx-2 lg:mx-0 lg:w-[600px] bg-[#0a4303] p-2 rounded-lg flex flex-col gap-3">
            <div className="flex justify-between w-full">
                <div className="flex">
                    <div className="w-14 h-14 rounded-full bg-gray-400">
                        {userData.userType === 8 ? (
                            <img
                                src={require('../../../../assets/icon-validator.png')}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                        ) : (
                            <>
                                {imageProfile ? (
                                    <img
                                        src={imageProfile}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={require('../../../../assets/icon-validator.png')}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex flex-col ml-2">
                        <p
                            className="text-white font-bold text-sm hover:underline hover:cursor-pointer"
                            onClick={() => navigate(`/user-details/${String(userData?.wallet).toLowerCase()}`)}
                        >
                            {userData?.userType === 8 ? 'Validador(a)' : userData?.name}
                        </p>
                        <p className="text-gray-300 text-xs">
                            {userData?.userType === 1 && 'Produtor(a)'}
                            {userData?.userType === 2 && 'Inspetor(a)'}
                            {userData?.userType === 3 && 'Pesquisador(a)'}
                            {userData?.userType === 4 && 'Desenvolvedor(a)'}
                            {userData?.userType === 5 && ''}
                            {userData?.userType === 6 && 'Ativista'}
                            {userData?.userType === 7 && 'Apoiador(a)'}
                            {userData?.userType === 8 && 'Validador(a)'}
                        </p>
                        <p className="text-gray-300 text-xs">{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
                    </div>
                </div>
            </div>

            <div>
                {data.type === 'publi-user' && (
                    <PubliUser data={data} />
                )}

                {data.type === 'accept-inspection' && (
                    <AcceptInspectionPubli data={data} />
                )}

                {data.type === 'request-inspection' && (
                    <div className="">
                        <p className="text-white">Requisitou uma nova inspeção</p>
                    </div>
                )}

                {data.type === 'dev-report' && (
                    <DevReportPubli additionalData={additionalData} />
                )}

                {data.type === 'withdraw-tokens' && (
                    <WithdrawTokensPubli data={data} changeVisible={() => setVisiblePubli(false)} />
                )}

                {data.type === 'contribute-tokens' && (
                    <ContributeTokensPubli data={data} />
                )}

                {data.type === 'realize-inspection' && (
                    <RealizeInspectionPubli data={data} />
                )}

                {data.type === 'new-user' && (
                    <NewUserPubli userData={userData} />
                )}

                {data.type === 'vote-invalidate-user' && (
                    <InvalidateUserPubli additionalData={additionalData} />
                )}

                {data.type === 'vote-invalidate-inspection' && (
                    <InvalidateInspectionPubli additionalData={additionalData} />
                )}

                {data.type === 'publish-researche' && (
                    <PublishResearche data={data} />
                )}

                {data.type === 'proof-reduce' && (
                    <ProofReduce data={data} />
                )}

                {data.type === 'invite-wallet' && (
                    <InviteWalletPubli data={data} />
                )}
            </div>
            
            {additionalData?.hash && (
                <div>
                    <p className="text-gray-200 text-xs">
                        Hash da transação: 
                        <a 
                            className="ml-1 underline text-blue-300"
                            href={`https://sepolia.etherscan.io/tx/${additionalData?.hash}`}
                            target="_blank"
                        >
                            {additionalData?.hash}
                        </a>
                    </p>
                </div>
            )}

            {likes > 0 && (
                <button className="w-fit" onClick={() => setModalLikes(true)}>
                    <p className="text-white ">{likes} Curtida{likes > 1 && 's'}</p>
                </button>
            )}

            <div className="flex items-center border-t border-green-950 pt-2 gap-5">
                <button className="flex flex-col items-center" onClick={handleLike}>
                    {liked ? <FaHeart color='red' size={20} /> : <FaRegHeart color='white' size={20} />}
                    <p className="text-white font-bold text-sm">Curtir</p>
                </button>

                <button className="flex flex-col items-center" onClick={() => setModalComments(true)}>
                    <BsChat color='white' size={20} />
                    <p className="text-white font-bold text-sm">Comentar</p>
                </button>

                <button
                    className="flex flex-col items-center"
                    onClick={() => {
                        navigator.clipboard.writeText(`https://app.sintrop.com/publication/${data?.id}`);
                        toast.success('Link copiado para área de transferência.')
                    }}
                >
                    <FaShare color='white' size={20} />
                    <p className="text-white font-bold text-sm">Compartilhar</p>
                </button>
            </div>

            {comments.length > 0 && (
                <>
                    <div className="flex flex-col">
                        <p className="text-white text-sm font-bold">{JSON.parse(comments[Number(comments?.length) - 1]?.userData).name}</p>
                        <p className="text-white text-sm">{comments[Number(comments?.length) - 1]?.text}</p>
                    </div>

                    {comments.length > 1 && (
                        <p className="text-gray-400 text-sm cursor-pointer" onClick={() => setModalComments(true)}>Ver todos os comentários</p>
                    )}
                </>
            )}

            {modalLikes && (
                <ModalLikes close={() => setModalLikes(false)} publiId={data.id} />
            )}

            {modalComments && (
                <ModalComments close={() => setModalComments(false)} dataPubli={data} />
            )}

            <ToastContainer />
        </div>
    );
}