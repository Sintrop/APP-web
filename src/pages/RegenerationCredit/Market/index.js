import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaChevronRight } from "react-icons/fa";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { useNavigate } from "react-router";
import { TopBar } from "../../../components/TopBar";
import { api } from "../../../services/api";
import { OfferItem } from "./components/OfferItem";
import { Chat } from '../../../components/Chat';
import { ModalCreateOffer } from "./components/ModalCreateOffer";
import { useMainContext } from "../../../hooks/useMainContext";
import { ToastContainer, toast } from "react-toastify";

export function Market() {
    const {walletConnected, userData} = useMainContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState([]);
    const [modalCreateOffer, setModalCreateOffer] = useState(false);
    const [openChat, setOpenChat] = useState(false);

    useEffect(() => {
        getOffers();
    }, []);

    async function getOffers() {
        setLoading(true);
        const response = await api.get('/offers');
        setOffers(response.data.offers);
        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex flex-col gap-1 w-full lg:max-w-[1024px] mt-3 items-start px-2 lg:px-0">
                    <p className="font-bold text-white text-lg mt-3">Comprar</p>
                    <div className="flex flex-wrap justify-center gap-3 w-full">
                        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col gap-1 w-full lg:w-[49%] border-green-600 border">
                            <h3 className="font-bold text-green-600 text-lg">Pré venda de tokens reais</h3>
                            <h4 className="font-bold text-white">1 RC = R$ 0,0282</h4>

                            <button
                                className="font-bold text-white px-2 py-1 rounded-md bg-blue-600 mt-2"
                                onClick={() => navigate('/pre-sale')}
                            >
                                Comprar
                            </button>
                        </div>

                        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col gap-1 w-full lg:w-[49%]">
                            <h3 className="font-bold text-green-600 text-lg">ICO - Initial Coin Offer</h3>
                            <h4 className="font-bold text-white">1 RC = 0,0000125 ETH</h4>

                            <button
                                className="font-bold text-white px-2 py-1 rounded-md bg-blue-600 mt-2"
                                onClick={() => navigate('/ico')}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 w-full mt-5">
                        <p className="font-bold text-white text-lg">Ofertas</p>

                        <button
                            className="bg-blue-500 rounded-md text-white font-semibold px-5 py-1 w-fit"
                            onClick={() => {
                                if(walletConnected === ''){
                                    toast.error('Você não está conectado!')
                                    return;
                                }
                                if(userData?.accountStatus !== 'blockchain'){
                                    toast.error('Você precisa estar cadastrado no sistema!')
                                    return;
                                }
                                if(userData?.userType === 7){
                                    toast.error('Um apoiador não pode criar oferta de venda!')
                                    return;
                                }
                                setModalCreateOffer(true)
                            }}
                        >
                            Criar oferta
                        </button>
                    </div>
                    {loading ? (
                        <ActivityIndicator size={60} />
                    ) : (
                        <>
                            {offers.length === 0 && (
                                <p className="text-white text-center my-5 w-full">Nenhuma oferta no momento!</p>
                            )}
                        </>
                    )}
                    <div className="flex flex-wrap gap-3">
                        {offers.map(item => (
                            <OfferItem
                                data={item}
                                attOffers={getOffers}
                                buy={() => setOpenChat(true)}
                            />
                        ))}
                    </div>
                    <p className="font-bold text-white text-lg mt-3">Vender</p>
                    <a
                        className="flex items-center justify-between gap-2 px-2 py-3 border-2 border-white rounded-md w-full"
                        href="https://app.uniswap.org/"
                        target="_blank"
                    >
                        <img
                            src={require('../../../assets/uniswap.png')}
                            className="w-26 h-8 "
                        />

                        <FaChevronRight size={20} color='white' />
                    </a>

                    <a
                        className="flex items-center justify-between gap-2 px-2 py-3 border-2 border-white rounded-md w-full mt-3"
                        href="https://conta.mercadobitcoin.com.br/cadastro?mgm_token=0d304a9086d7032fe736027f74013a2ab815933c7df44cc08f8b7aa3a81d4d05&utm_campaign=mgm&utm_source=web&utm_medium=link-copy"
                        target="_blank"
                    >
                        <img
                            src={require('../../../assets/mercado-bitcoin.png')}
                            className="w-26 h-8 "
                        />

                        <FaChevronRight size={20} color='white' />
                    </a>
                </div>
            </div>

            <div className="hidden lg:flex">
                <Chat 
                    openChat={openChat}
                />
            </div>

            {modalCreateOffer && (
                <ModalCreateOffer
                    close={() => setModalCreateOffer(false)}
                    offerCreated={() => {
                        setModalCreateOffer(false);
                        getOffers();
                    }}
                />
            )}

            <ToastContainer/>
        </div>
    )
}