import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../../../services/api";
import { ResearcheItem } from "./components/ResearcheItem";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { useMainContext } from '../../../../hooks/useMainContext';
import * as Dialog from '@radix-ui/react-dialog';
import { PublishResearch } from "../../../../services/researchersService";
import { save } from "../../../../config/infura";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { CategorieItem } from "./components/CategorieItem";
import { Item } from '../../../ImpactCalculator/components/Item';
import { ModalPublish } from "./components/ModalPublish";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { UserRankingItem } from "../../../Ranking/components/UserRankingItem";

export function ResearcherActions() {
    const navigate = useNavigate();
    const { userData, walletConnected, connectionType } = useMainContext();
    const [tabSelected, setTabSelected] = useState('users');
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
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (tabSelected === 'researches') {
            getResearches();
        }
        if (tabSelected === 'isa') getIndices();
        if (tabSelected === 'calculator-items') getCalculatorItens();
        if (tabSelected === 'users') getUsers();
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

    async function getUsers() {
        setLoading(true);
        const response = await api.get('/web3/researchers');
        setUsers(response.data.researchers);
        setLoading(false);
    }

    async function handlePublish(title, thesis, pdf) {
        if (loadingPublish) {
            return;
        }

        if (walletConnected === '') {
            toast.error('Você não está conectado!')
            return;
        }
        setLoadingPublish(true);
        const response = await save(pdf);

        if (connectionType === 'provider') {
            publishBlockchain(title, thesis, response);
        } else {
            toast.error('Conecte-se em um navegador com provedor Ethereum!')
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
        <div>
            <div className="flex flex-col w-full lg:w-[1024px] mt-3">
                <div className="flex items-center gap-8 mt-2 overflow-x-auto">
                    <button
                        className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('users')}
                    >
                        Perquisadores
                    </button>

                    <button
                        className={`font-bold py-1 border-b-2 ${tabSelected === 'researches' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('researches')}
                    >
                        Pesquisas
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 ${tabSelected === 'isa' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('isa')}
                    >
                        Índice de regeneração
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 ${tabSelected === 'calculator-items' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('calculator-items')}
                    >
                        Itens calculadora
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 ${tabSelected === 'methods' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('methods')}
                    >
                        Métodos de avaliação
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <ActivityIndicator size={50} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-2 lg:mt-5 mb-5">
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

                        {tabSelected === 'methods' && (
                            <>
                                {userData?.userType === 3 && (
                                    <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#0a4303] mb-1">
                                        <p className="font-semibold text-white">Deseja sugerir um novo método?</p>

                                        <button
                                            className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                            onClick={() => {
                                                setPublishType('method');
                                                setModalPublish(true);
                                            }}
                                        >
                                            Sugerir
                                        </button>
                                    </div>
                                )}

                                <button className="w-full p-3 rounded-md bg-[#0a4303] flex items-center justify-between" onClick={() => navigate('/methods/sintrop')}>
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-white text-lg mb-1">Método Sintrop</p>
                                        <img
                                            src={require('../../../../assets/logo-branco.png')}
                                            className="w-32 h-9 object-contain"
                                        />
                                    </div>

                                    <FaChevronRight size={30} color='white' />
                                </button>
                            </>
                        )}

                        {tabSelected === 'users' && (
                            <div className={`flex gap-3 flex-wrap lg:max-w-[1024px] mt-3 ${users.length < 4 ? 'lg:justify-start justify-center' : 'justify-center'}`}>
                                {users.map(item => (
                                    <UserRankingItem
                                        data={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
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