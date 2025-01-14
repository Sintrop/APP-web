import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/header";
import { api } from "../../services/api";
import { useMainContext } from '../../hooks/useMainContext';
import { IoMdHelp } from "react-icons/io";
import { ImBooks } from "react-icons/im";
import { FaCalculator } from "react-icons/fa";
import { QRCode } from "react-qrcode-logo";
import { Chat } from "../../components/Chat";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { ModalLogout } from "./components/ModalLogout";
import { TopBar } from "../../components/TopBar";
import { ModalSignUp } from "../../components/ModalSignUp/ModalSignUp.js";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { UserConnection } from "./components/UserConnection/UserConnection";
import { ModalTransactionCreated } from "../../components/ModalTransactionCreated/index.js";
import { ModalWhereExecuteTransaction } from "../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { Web3Feed } from "./components/Web3Feed/Web3Feed";
import { SocialFeed } from "./components/SocialFeed/SocialFeed";
import { FeedSelector } from "./components/FeedSelector";

export function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userData, newFlowConnectUser, walletConnected } = useMainContext();
    const [modalLogout, setModalLogout] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [news, setNews] = useState([]);
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [feedType, setFeedType] = useState('social');

    useEffect(() => {
        getNews();
    }, []);

    async function getNews() {
        const response = await api.get('/news');
        setNews(response.data.news);
    }

    function successRegister(type) {
        setShowModalWhereExecuteTransaction(false);
        if (type === 'blockchain') {
            newFlowConnectUser(walletConnected, true);
            toast.success(t('cadastroRealizadoSucesso'))
        }
        if (type === 'checkout') {
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{t('cr')}</title>
                <link rel="canonical" href={`https://app.sintrop.com`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
                <meta name="og:title" property="og:title" content={t('cr')} />
                <meta name="og:description" property="og:description" content="Sistema Descentralizado de Regeneração da Natureza" />
            </Helmet>
            <TopBar />
            <Header routeActive='home' />

            <div className="flex flex-col items-center w-full pt-10 pb-16 lg:pb-5 lg:pt-32 overflow-auto">

                <div className="flex gap-3 mt-3">
                    <div className="flex flex-col gap-3 w-[250px]">
                        <UserConnection
                            handleShowSignUp={() => setSignUp(true)}
                            showLogout={() => setModalLogout(true)}
                            showTransactionCreated={() => setCreatedTransaction(true)}
                            showModalWhereExecuteTransaction={() => setShowModalWhereExecuteTransaction(true)}
                        />

                        <div className="flex flex-wrap justify-center gap-5 mt-3 w-full">
                            <button
                                className="flex flex-col items-center w-16"
                                onClick={() => navigate('/impact-calculator')}
                            >
                                <div className="border-2 border-white w-14 h-14 rounded-full bg-[#03364B] flex flex-col items-center justify-center">
                                    <FaCalculator color='white' size={25} />
                                </div>
                                <p className="text-white text-xs text-center">{t('calculadoraDeImpacto')}</p>
                            </button>

                            <a
                                className="flex flex-col items-center w-16"
                                href="https://docs.sintrop.com"
                                target="_blank"
                            >
                                <div className="border-2 border-white w-14 h-14 rounded-full bg-[#03364B] flex flex-col items-center justify-center">
                                    <IoMdHelp color='white' size={30} />
                                </div>
                                <p className="text-white text-xs text-center">{t('ajuda')}</p>
                            </a>

                            <button
                                className="flex flex-col items-center w-16"
                                onClick={() => navigate('/education')}
                            >
                                <div className="border-2 border-white w-14 h-14 rounded-full bg-[#03364B] flex flex-col items-center justify-center">
                                    <ImBooks color='white' size={30} />
                                </div>
                                <p className="text-white text-xs text-center">{t('educacao')}</p>
                            </button>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-3 w-[100vw] lg:w-auto`}>
                        {news.length > 0 && (
                            <div className="flex w-full lg:max-w-[600px] h-[150px] rounded-md overflow-hidden">
                                {news.map(item => (
                                    <button
                                        key={item?.id}
                                    >
                                        {item?.action === 'open-url' ? (
                                            <a href={item?.link} target="_blank">
                                                <img
                                                    src={item?.bannerUrl}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={item?.bannerUrl}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <FeedSelector
                            selectedFeed={feedType}
                            onChange={setFeedType}
                        />

                        {feedType === 'web3' && (
                            <Web3Feed />
                        )}

                        {feedType === 'social' && (
                            <SocialFeed />
                        )}

                    </div>

                    <div className="hidden lg:flex flex-col gap-3">
                        <div className="flex flex-col items-center w-[200px] p-3 bg-[#03364B] rounded-md">
                            <p className="font-bold text-white text-xs text-center mb-3">{t('baixeNossoApp')}</p>
                            <QRCode
                                value='https://www.sintrop.com/app'
                                size={100}
                                qrStyle="dots"
                                logoPadding={2}
                                logoPaddingStyle="square"
                                logoWidth={30}
                                removeQrCodeBehindLogo
                                eyeColor='#03364B'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <button
                className="flex items-center gap-2 justify-end px-2 h-10 w-[120px] bg-red-500 absolute bottom-20 left-[-60px] hover:left-0 duration-500 rounded-r-md"
            >
                <MdOutlineFeedback color='white' size={20}/>
            </button> */}

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => {
                        setCreatedTransaction(false);
                    }}
                />
            )}

            {modalLogout && (
                <ModalLogout
                    close={() => {
                        setModalLogout(false);
                    }}
                />
            )}

            {signUp && (
                <ModalSignUp
                    close={() => setSignUp(false)}
                    success={() => {
                        newFlowConnectUser(userData.wallet, true);
                        setSignUp(false)
                    }}
                />
            )}

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData=""
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successRegister}
                    transactionType="register"
                />
            )}
            <ToastContainer />

            <div className="hidden lg:flex">
                <Chat />
                <Feedback />
            </div>

        </div>
    )
}