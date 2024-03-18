import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Blocks } from 'react-loader-spinner';
import { api } from "../../services/api";
import { PublicationItem } from "./components/PublicationItem";
import { useMainContext } from '../../hooks/useMainContext';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../components/ModalConnectAccount";

export function Home() {
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
                    <Blocks
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        visible={true}
                    />
                ) : (
                    <div className="flex gap-3 mt-3">
                        <div className="flex flex-col items-center w-[200px] h-[300px] p-3 bg-[#0a4303] ml-[-200px] rounded-md">
                            {walletConnected === '' ? (
                                <>
                                    <img
                                        src={require('../../assets/anonimous.png')}
                                        className="w-14 h-14 object-contain border-2 border-white"
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
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
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
                    </div>
                )}


            </div>
        </div>
    )
}