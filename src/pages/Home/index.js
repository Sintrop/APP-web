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
import { QRCode } from "react-qrcode-logo";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { Chat } from "../../components/Chat";
import { NewPubli } from "./components/NewPubli";
import { toast, ToastContainer } from "react-toastify";
import {useNavigate} from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    const { walletConnected, userData, imageProfile } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(0);
    const [modalConnect, setModalConnect] = useState(false);

    useEffect(() => {
        getPublications();
    }, [page]);

    async function getPublications() {
        setLoading(true);

        const response = await api.get(`/publications/get-all/${page}`);
        const resPublis = response.data.publications;

        if (page === 0) {
            setPublications(resPublis);
        } else {
            for (var i = 0; i < resPublis.length; i++) {
                publications.push(resPublis[i]);
            }
        }

        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header routeActive='home' />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                {loading ? (
                    <div className="mt-3 flex items-center justify-center h-[100vh]">
                        <ActivityIndicator size={180} />
                    </div>
                ) : (
                    <div className="flex gap-3 mt-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col items-center w-[200px] h-[300px] p-3 bg-[#0a4303] rounded-md">
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
                                    </>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 rounded-full bg-gray-500">
                                            <img
                                                src={imageProfile}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                                            />
                                        </div>

                                        <p className="font-bold text-white text-center text-sm mt-2">{userData?.name}</p>
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

                                        <button
                                            className="w-full flex items-center justify-between text-semibold text-white text-sm mt-5"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Accessar perfil
                                            <FaChevronRight size={15} color='white' />
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col items-center w-[200px] p-3 bg-[#0a4303] rounded-md">
                                <p className="text-gray-400 text-xs text-left">Atalhos</p>

                                <div className="flex flex-wrap justify-center gap-5 mt-3">
                                    <button
                                        className="flex flex-col items-center w-16"
                                        onClick={() => alert('Disponível em breve!')}
                                    >
                                        <div className="border-2 border-white w-14 h-14 rounded-full bg-green-950 flex flex-col items-center justify-center">
                                            <IoMdHelp color='white' size={30} />
                                        </div>
                                        <p className="text-white text-xs text-center">Ajuda</p>
                                    </button>

                                    <button
                                        className="flex flex-col items-center w-16"
                                        onClick={() => alert('Disponível em breve!')}
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
                                            <FaCalculator color='white' size={25} />
                                        </div>
                                        <p className="text-white text-xs text-center">Calculadora de impacto</p>
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

                        <div className="flex flex-col gap-3">
                            {walletConnected !== '' && (
                                <NewPubli attPublis={() => {
                                    setPage(0)
                                    getPublications();
                                    toast.success('Publicação feita com sucesso!')
                                }}/>
                            )}
                            {publications.length > 0 && (
                                <>
                                    {publications.map(item => (
                                        <PublicationItem
                                            data={item}
                                            key={item.id}
                                        />
                                    ))}

                                    <button onClick={() => setPage(page + 1)}>
                                        Ver mais
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
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
            
            <ToastContainer/>
            <Chat />
        </div>
    )
}