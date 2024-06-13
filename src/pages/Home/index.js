import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Blocks } from 'react-loader-spinner';
import { api } from "../../services/api";
import { PublicationItem } from "./components/PublicationItem";
import { useMainContext } from '../../hooks/useMainContext';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../components/ModalConnectAccount";
import { IoMdHelp } from "react-icons/io";
import { ImBooks } from "react-icons/im";
import { FaCalculator, FaChevronRight } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { QRCode } from "react-qrcode-logo";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { Chat } from "../../components/Chat";
import { NewPubli } from "./components/NewPubli";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { ModalLogout } from "./components/ModalLogout";
import { TopBar } from "../../components/TopBar";
import { ModalSignOut } from "../../components/ModalSignOut";
import { Feedback } from "../../components/Feedback";

export function Home() {
    const navigate = useNavigate();
    const { walletConnected, userData, imageProfile, blockchainData } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(0);
    const [modalConnect, setModalConnect] = useState(false);
    const [modalLogout, setModalLogout] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [signOut, setSignOut] = useState(false);
    const [news, setNews] = useState([]);

    useEffect(() => {
        getPublications();
    }, [page]);

    useEffect(() => {
        getNews();
    }, []);

    async function getPublications() {
        if (firstLoad) {
            setLoading(true);
            setFirstLoad(false);
        } else {
            setLoadingMore(true);
        }

        const response = await api.get(`/publications/get-all/${page}`);
        const resPublis = response.data.publications;

        if (page === 0) {
            setPublications(resPublis);
        } else {
            for (var i = 0; i < resPublis.length; i++) {
                publications.push(resPublis[i]);
            }
        }

        setLoadingMore(false);
        setLoading(false);
    }

    async function getNews() {
        const response = await api.get('/news');
        setNews(response.data.news);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header routeActive='home' />

            <div className="flex flex-col items-center w-full pt-10 pb-16 lg:pb-5 lg:pt-32 overflow-auto">
                {loading ? (
                    <div className="mt-3 flex items-center justify-center h-[100vh]">
                        <ActivityIndicator size={180} />
                    </div>
                ) : (
                    <div className="flex gap-3 mt-3">
                        <div className="flex flex-col gap-3">
                            <div className="hidden lg:flex flex-col items-center w-[200px] h-[270px] p-3 bg-[#0a4303] rounded-md relative">
                                {walletConnected === '' ? (
                                    <>
                                        <img
                                            src={require('../../assets/anonimous.png')}
                                            className="w-14 h-14 object-contain rounded-full border-2 border-white"
                                        />

                                        <p className="font-bold text-white text-center text-sm mt-2">Você está no modo anônimo</p>

                                        <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                                            <Dialog.Trigger
                                                className="w-full p-2 bg-blue-500 rounded-md text-white font-bold mt-10"
                                            >
                                                Conectar wallet
                                            </Dialog.Trigger>

                                            <ModalConnectAccount close={() => setModalConnect(false)} />
                                        </Dialog.Root>

                                        <button
                                            className="text-white text-center mt-3 text-sm"
                                            onClick={() => setSignOut(true)}
                                        >
                                            Cadastre-se
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-gray-500 cursor-pointer" onClick={() => navigate('/profile')}>
                                            <img
                                                src={imageProfile}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                            />
                                        </div>

                                        <p className="font-bold text-white text-center text-sm mt-2 cursor-pointer hover:underline overflow-hidden text-ellipsis truncate w-[190px]" onClick={() => navigate('/profile')}>{userData?.name}</p>
                                        <p className="text-gray-300 text-center text-xs">
                                            {userData?.userType === 1 && 'Produtor(a)'}
                                            {userData?.userType === 2 && 'Inspetor(a)'}
                                            {userData?.userType === 3 && 'Pesquisador(a)'}
                                            {userData?.userType === 4 && 'Desenvolvedor(a)'}
                                            {userData?.userType === 5 && 'Contribuidor(a)'}
                                            {userData?.userType === 6 && 'Ativista'}
                                            {userData?.userType === 7 && 'Apoiador(a)'}
                                            {userData?.userType === 8 && 'Validador(a)'}
                                        </p>
                                        <p className="text-white text-center text-xs text-ellipsis overflow-hidden truncate w-[190px]">{walletConnected}</p>

                                        {userData?.userType === 0 ? (
                                            <div className="flex flex-col mt-5">
                                                <p className="text-center text-white">Wallet não cadastrada</p>

                                                <button
                                                    className="mt-2 text-white py-2 px-5 bg-blue-500 rounded-md font-semibold text-sm"
                                                    onClick={() => setSignOut(true)}
                                                >
                                                    Cadastre-se
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col mt-2 w-full items-center">
                                                {userData?.accountStatus === 'blockchain' ? (
                                                    <>
                                                        <div className="bg-activity bg-contain bg-no-repeat w-24 h-24 flex flex-col items-center justify-center">
                                                            {blockchainData && (
                                                                <p className={`${userData?.userType === 7 ? 'text-lg' : 'text-4xl'} font-bold text-green-500`}>
                                                                    {userData?.userType === 1 && parseInt(blockchainData?.producer?.isa?.isaScore)}
                                                                    {userData?.userType === 2 && parseInt(blockchainData?.inspector?.totalInspections)}
                                                                    {userData?.userType === 3 && parseInt(blockchainData?.researcher?.publishedWorks)}
                                                                    {userData?.userType === 4 && parseInt(blockchainData?.developer?.pool?.level)}
                                                                    {userData?.userType === 7 && Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(blockchainData?.tokensBurned)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-200">
                                                            {userData?.userType === 1 && 'Pontuação de regeneração'}
                                                            {userData?.userType === 2 && 'Inspeções realizadas'}
                                                            {userData?.userType === 3 && 'Pesquisas publicadas'}
                                                            {userData?.userType === 4 && 'Seu nível'}
                                                            {userData?.userType === 7 && 'Tokens contribuidos'}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-yellow-500 font-semibold text-center mt-3">Cadastro na blockchain pendente</p>
                                                        <button className="underline text-white" onClick={() => navigate('/profile')}>
                                                            Saiba mais aqui
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            className="absolute top-2 right-2"
                                            title="Desconectar"
                                            onClick={() => setModalLogout(true)}
                                        >
                                            <MdLogout color='white' size={18} />
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="hidden lg:flex flex-col items-center w-[200px] p-3 bg-[#0a4303] rounded-md">
                                <p className="text-gray-400 text-xs text-left">Atalhos</p>

                                <div className="flex flex-wrap justify-center gap-5 mt-3">
                                    <button
                                        className="flex flex-col items-center w-16"
                                        onClick={() => navigate('/impact-calculator')}
                                    >
                                        <div className="border-2 border-white w-14 h-14 rounded-full bg-green-950 flex flex-col items-center justify-center">
                                            <FaCalculator color='white' size={25} />
                                        </div>
                                        <p className="text-white text-xs text-center">Calculadora de impacto</p>
                                    </button>

                                    <a
                                        className="flex flex-col items-center w-16"
                                        href="https://docs.sintrop.com"
                                        target="_blank"
                                    >
                                        <div className="border-2 border-white w-14 h-14 rounded-full bg-green-950 flex flex-col items-center justify-center">
                                            <IoMdHelp color='white' size={30} />
                                        </div>
                                        <p className="text-white text-xs text-center">Ajuda</p>
                                    </a>

                                    <button
                                        className="flex flex-col items-center w-16"
                                        onClick={() => navigate('/education')}
                                    >
                                        <div className="border-2 border-white w-14 h-14 rounded-full bg-green-950 flex flex-col items-center justify-center">
                                            <ImBooks color='white' size={30} />
                                        </div>
                                        <p className="text-white text-xs text-center">Educação</p>
                                    </button>


                                    <button
                                        className="flex flex-col items-center w-16"
                                        onClick={() => alert('Disponível em breve!')}
                                    >
                                        <div className="border-2 border-white w-14 h-14 rounded-full bg-green-950 flex flex-col items-center justify-center">
                                            <p className="text-[9px] text-white">Consultoria</p>
                                        </div>
                                        <p className="text-white text-xs text-center">Consultoria</p>
                                    </button>
                                </div>
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

                            {userData?.accountStatus === 'blockchain' && (
                                <NewPubli attPublis={() => {
                                    setPage(0)
                                    getPublications();
                                    toast.success('Publicação feita com sucesso!')
                                }} />
                            )}
                            {publications.length > 0 && (
                                <>
                                    {publications.map(item => (
                                        <PublicationItem
                                            data={item}
                                            key={item.id}
                                        />
                                    ))}

                                    {loadingMore ? (
                                        <ActivityIndicator size={40} />
                                    ) : (
                                        <button onClick={() => setPage(page + 1)} className="underline text-white mb-3">
                                            Ver mais
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="hidden lg:flex flex-col gap-3">
                            <div className="flex flex-col items-center w-[200px] p-3 bg-[#0a4303] rounded-md">
                                <p className="font-bold text-white text-xs text-center mb-3">Baixe nosso aplicativo</p>
                                <QRCode
                                    value='https://www.sintrop.com/app'
                                    size={100}
                                    qrStyle="dots"
                                    logoPadding={2}
                                    logoPaddingStyle="square"
                                    logoWidth={30}
                                    removeQrCodeBehindLogo
                                    eyeColor='#0a4303'
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {modalLogout && (
                <ModalLogout
                    close={() => {
                        setModalLogout(false);
                        setModalConnect(false);
                    }}
                />
            )}

            {signOut && (
                <ModalSignOut
                    close={() => setSignOut(false)}
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