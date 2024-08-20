import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { api } from "../../../../services/api";
import { useMainContext } from '../../../../hooks/useMainContext';
import { ModalConfimation } from "../../../../components/ModalConfirmation";
import CryptoJS from "crypto-js";
import { ActivityIndicator } from "../../../../components/ActivityIndicator";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function OfferItem({ data, attOffers, buy }) {
    const { t } = useTranslation();
    const { userData: user, walletConnected, impactToken } = useMainContext();
    const [userData, setUserData] = useState(null);
    const [imageProfile, setImageProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalConfirmationData, setModalConfirmationData] = useState({});

    useEffect(() => {
        getUserData();
    }, [data]);

    async function getUserData() {
        const response = await api.get(`/user/by-id/${data?.ownerOffer}`);
        setUserData(response.data.user);

        getImageProfile(response.data.user.imgProfileUrl);
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash)
        setImageProfile(response);
    }

    function handleBuy() {
        setModalConfirmationData({
            title: t('comprarRC'),
            description: t('negociacaoViaChat'),
            titleButtonDiscord: t('cancelar'),
            titleButtonAccept: t('comprar'),
            action: 'buy-offer'
        });
        setModalConfirmation(true);
    }

    async function buyOffer() {
        if (loading) {
            return;
        }

        setLoading(true);
        const response = await api.get(`/chats/${user.id}`);
        const chats = response.data.chats;

        let chatId = '';
        let participantData = {}
        for (var i = 0; i < chats.length; i++) {
            const participant = JSON.parse(chats[i].participantData);
            if (participant?.id === data?.ownerOffer) {
                chatId = chats[i].chatId
                participantData = participant;
            }
        }

        if (chatId !== '') {
            let hashPhotos = [];
            const encrypt = CryptoJS.AES.encrypt(`Olá, tenho interesse na sua oferta de venda de ${Intl.NumberFormat('pt-BR').format(data?.tokens)} RC`, '84uriuUGjged76382Gdsj28ydsajjdb');
            try {
                await api.post('/chat/message', {
                    chatId,
                    message: encrypt.toString(),
                    type: 'text',
                    userId: user.id,
                    userData: JSON.stringify(user),
                    participantData: JSON.stringify(participantData),
                    photos: JSON.stringify(hashPhotos)
                })
                toast.success('Foi enviada uma mensagem para o comprador, acesse seu chat!');
                buy(chatId);
            } catch (err) {
                console.log(err)
                toast.error('Algo deu errado, tente novamente!');
            }
            //await socket.emit('message', { message: encrypt.toString(), chatId, userId: user.id });
        } else {
            try {
                const response = await api.post('/chat/create', {
                    userId: user.id,
                    userData: JSON.stringify(user),
                    participantId: userData.id,
                    participantData: JSON.stringify(userData),
                });

                let hashPhotos = [];
                const encrypt = CryptoJS.AES.encrypt(`Olá, tenho interesse na sua oferta de venda de ${Intl.NumberFormat('pt-BR').format(data?.tokens)} RC`, '84uriuUGjged76382Gdsj28ydsajjdb');

                await api.post('/chat/message', {
                    chatId: response.data.chat.id,
                    message: encrypt.toString(),
                    type: 'text',
                    userId: user.id,
                    userData: JSON.stringify(user),
                    participantData: JSON.stringify(userData),
                    photos: JSON.stringify(hashPhotos)
                });
                toast.success('Foi enviada uma mensagem para o comprador, acesse seu chat!');
                buy(response.data.chat.id);
                //await socket.emit('message', { message: encrypt.toString(), chatId, userId: user.id });
            } catch (err) {
                console.log(err);
                toast.error('Algo deu errado, tente novamente!');
            }
        }
        setLoading(false);
    }

    function handleDelete() {
        setModalConfirmationData({
            title: t('atencao'),
            description: t('desejaExcluirOferta'),
            titleButtonDiscord: t('cancelar'),
            titleButtonAccept: t('excluir'),
            action: 'delete-offer'
        });
        setModalConfirmation(true);
    }

    async function deleteOffer() {
        try {
            setLoading(true);
            await api.delete(`/offer/${data?.id}/${user?.id}`);
            attOffers();
            toast.success(t('ofertaExcluida'))
        } catch (err) {
            toast.error(t('algoDeuErrado'))
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col w-[333px] rounded-md bg-[#03364B] border-4 border-white overflow-hidden pb-3 justify-between">
            <div className="flex flex-col">
                <div className="flex w-full h-[100px] bg-florest bg-cover bg-center bg-no-repeat">
                    {userData?.bannerUrl && (
                        <img
                            src={userData?.bannerUrl}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col mt-[-50px] pl-3">
                    <div className="w-20 h-20 rounded-full bg-gray-400 border-4 border-white">
                        {imageProfile && (
                            <img
                                src={imageProfile}
                                className="w-full h-full object-cover rounded-full"
                            />
                        )}
                    </div>

                    <a
                        className="font-bold text-white hover:underline"
                        href={`https://app.sintrop.com/user-details/${String(userData?.wallet).toUpperCase()}`}
                    >
                        {userData?.name}
                    </a>

                    <p className="text-sm mt-5 text-gray-400">{t('estaVendendo')}</p>
                    <div className="flex items-center gap-2">
                        <img
                            src={require('../../../../assets/token.png')}
                            className="w-10 h-10 object-contain"
                        />

                        <p className="font-bold text-white text-lg">
                            {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(data?.tokens)} RC
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-end">
                <div className="flex flex-col gap-1 px-3 mt-3">
                    <p
                        className="text-xs text-gray-300"
                    >
                        {t('impactoDisponivel')}
                    </p>

                    <div className="flex items-center">
                        <div className='flex flex-col items-center w-[50%]'>
                            <p className="font-bold text-white text-xs">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactToken.carbon * data?.tokens)} kg</p>
                            <p className="text-xs text-gray-100">{t('carbono')}</p>
                        </div>

                        <div className='flex flex-col items-center w-[50%]'>
                            <p className="font-bold text-white text-xs">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactToken.soil * data?.tokens)} m²</p>
                            <p className="text-xs text-gray-100">{t('solo')}</p>
                        </div>
                        
                        <div className='flex flex-col items-center w-[50%]'>
                            <p className="font-bold text-white text-xs">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactToken.water * data?.tokens)} m³</p>
                            <p className="text-xs text-gray-100">{t('agua')}</p>
                        </div>

                        <div className='flex flex-col items-center w-[50%]'>
                            <p className="font-bold text-white text-xs">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactToken.bio * data?.tokens)} uv</p>
                            <p className="text-xs text-gray-100">{t('bio')}</p>
                        </div>
                    </div>

                    <div className="flex items-center mt-3">
                    </div>
                </div>

                <button
                    className={`font-bold h-10 rounded-md mx-2 mt-2 ${user?.id === data?.ownerOffer ? 'bg-red-500 text-white' : 'bg-[#3E9EF5] text-white'}`}
                    onClick={() => {
                        if (walletConnected === '') {
                            return;
                        }
                        if (user?.id === data?.ownerOffer) {
                            handleDelete();
                        } else {
                            handleBuy();
                        }
                    }}
                >
                    {loading ? (
                        <ActivityIndicator size={20} />
                    ) : (
                        <>
                            {user?.id === data?.ownerOffer ? t('excluirOferta') : t('comprar')}
                        </>
                    )}
                </button>
            </div>

            {modalConfirmation && (
                <ModalConfimation
                    data={modalConfirmationData}
                    close={() => setModalConfirmation(false)}
                    accept={(action) => {
                        setModalConfirmation(false);
                        if (action === 'delete-offer') {
                            deleteOffer();
                        }
                        if (action === 'buy-offer') {
                            buyOffer();
                        }
                    }}
                />
            )}

            <ToastContainer />
        </div>
    )
}