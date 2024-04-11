import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../services/api";
import { ResearcheItem } from "./components/ResearcheItem";
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { useMainContext } from '../../hooks/useMainContext';
import * as Dialog from '@radix-ui/react-dialog';
import { PublishResearch } from "../../services/researchersService";
import { save } from "../../config/infura";
import { LoadingTransaction } from "../../components/LoadingTransaction";
import { TopBar } from '../../components/TopBar';
import { CategorieItem } from "./components/CategorieItem";
import { Item } from '../ImpactCalculator/components/Item';
import { ModalPublish } from "./components/ModalPublish";

export function ResearchesCenter() {
    const { userData, walletConnected, connectionType } = useMainContext();
    const [tabSelected, setTabSelected] = useState('researches');
    const [loading, setLoading] = useState(false);
    const [loadingPublish, setLoadingPublish] = useState(false);
    const [researches, setResearches] = useState([]);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [modalPublish, setModalPublish] = useState(false);
    const [publishType, setPublishType] = useState('normal');

    useEffect(() => {
        if (tabSelected === 'researches') {
            getResearches();
        }
        if (tabSelected === 'isa') getIndices();
        if (tabSelected === 'calculator-items') getCalculatorItens();
    }, [tabSelected]);

    async function getResearches() {
        setLoading(true);
        const response = await api.get('/web3/researches');
        setResearches(response.data.researches);
        setLoading(false);
    }

    async function getIndices() {
        setLoading(true);
        const response = await api.get('/isa-categories');
        setCategories(response.data.categories);
        setLoading(false);
    }

    async function getCalculatorItens() {
        setLoading(true);
        const response = await api.get('calculator/items')
        setItems(response.data.items)
        setLoading(false);
    }

    async function handlePublish(title, thesis, pdf) {
        if (loadingPublish) {
            return;
        }

        if(walletConnected === ''){
            toast.error('Você não está conectado!')
            return;
        }
        setLoadingPublish(true);
        const response = await save(pdf);

        if (connectionType === 'provider') {
            publishBlockchain(title, thesis, response);
        } else {

        }
    }

    function publishBlockchain(title, thesis, hash) {
        setModalTransaction(true);
        setLoadingTransaction(true);
        PublishResearch(walletConnected, title, thesis, hash)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });

                if (res.type === 'success') {
                    api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'publish-researche',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            userData,
                            title,
                            thesis,
                            file: hash
                        }),
                    });
                    toast.success('Pesquisa publicada com sucesso!');
                    setModalPublish(false);
                }
                setLoadingPublish(false);
                setLoadingTransaction(false);
            })
            .catch(err => {
                setLoadingPublish(false);
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Only allowed to researchers")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Only allowed to researchers!",
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            })
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-32 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    <p className="font-bold text-white text-xl">Centro de pesquisas</p>

                    <div className="flex items-center gap-8 mt-2">
                        <button
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'researches' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('researches')}
                        >
                            Pesquisas
                        </button>

                        <button
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'isa' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('isa')}
                        >
                            Índice de sustentabilidade
                        </button>

                        <button
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'calculator-items' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('calculator-items')}
                        >
                            Itens calculadora
                        </button>

                        {userData?.userType === 3 && (
                            <button
                                className={`font-bold py-1 border-b-2 ${tabSelected === 'publish' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                onClick={() => setTabSelected('publish')}
                            >
                                Publicar pesquisa
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <ActivityIndicator size={50} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-5 mb-5">
                            {tabSelected === 'researches' && (
                                <>
                                    {userData?.userType === 3 && (
                                        <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#0a4303] mb-1">
                                            <p className="font-semibold text-white">Deseja publicar uma nova pesquisa?</p>

                                            <button 
                                                className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                                onClick={() => {
                                                    setPublishType('normal');
                                                    setModalPublish(true);
                                                }}
                                            >
                                                Publicar
                                            </button>
                                        </div>
                                    )}
                                    {researches.map(item => (
                                        <ResearcheItem data={item} />
                                    ))}
                                </>
                            )}

                            {tabSelected === 'isa' && (
                                <>
                                    {categories.map(item => (
                                        <CategorieItem data={item} />
                                    ))}
                                </>
                            )}

                            {tabSelected === 'calculator-items' && (
                                <>
                                    {userData?.userType === 3 && (
                                        <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#0a4303] mb-1">
                                            <p className="font-semibold text-white">Deseja sugerir um novo item?</p>

                                            <button 
                                                className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                                onClick={() => {
                                                    setPublishType('calculator');
                                                    setModalPublish(true);
                                                }}
                                            >
                                                Sugerir
                                            </button>
                                        </div>
                                    )}
                                    {items.map(item => (
                                        <Item data={item} hiddenButton />
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {modalPublish && (
                <ModalPublish
                    close={() => setModalPublish(false)}
                    loadingPublish={loadingPublish}
                    publishType={publishType}
                    publish={(title, thesis, pdf) => handlePublish(title, thesis, pdf)}
                />
            )}

            <Dialog.Root
                open={modalTransaction}
                onOpenChange={(open) => {
                    if (!loadingTransaction) {
                        setModalTransaction(open);
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    )
}