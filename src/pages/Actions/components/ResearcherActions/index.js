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
import { FaCalculator, FaChevronRight, FaDatabase, FaFileAlt, FaUsers } from "react-icons/fa";
import { BsGraphUp } from 'react-icons/bs';
import { VscSymbolMethod } from 'react-icons/vsc';
import { useNavigate } from "react-router";
import { UserRankingItem } from "../../../Ranking/components/UserRankingItem";
import { Invite } from "../../../../services/invitationService";
import { Flora } from "./components/Databases/Flora";
import { BiFile } from "react-icons/bi";
import { useTranslation } from "react-i18next";

export function ResearcherActions() {
    const {t} = useTranslation();
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
    const [wallet, setWallet] = useState('');

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
            toast.error(t('necessitaProvedor'))
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

    function handleInvite() {
        if (!wallet.trim()) {
            toast.error('Digite uma wallet!');
            return
        }
        if (window.ethereum) {
            inviteUser();
        } else {
            toast.error(t('necessitaProvedor'))
        }
    }

    async function inviteUser() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        Invite(walletConnected, String(wallet).toLowerCase(), 3)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });

                if (res.type === 'success') {
                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'invite-wallet',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            hash: res.hashTransaction,
                            walletInvited: wallet,
                            userType: 3,
                            userData
                        }),
                    });
                }
                setLoadingTransaction(false);
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
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
                {userData?.userType === 3 && (
                    <>
                        <p className="font-bold text-white text-lg">{t('convidarPesquisador')}</p>
                        <div className="flex flex-col p-3 rounded-md bg-[#03364B] mb-5">
                            <p className="text-white">{t('instruParaConvidar')}</p>
                            <p className="mt-2 font-bold text-blue-500">Wallet</p>
                            <input
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                className="px-3 py-2 rounded-md text-white bg-green-950 max-w-[400px]"
                                placeholder={t('digiteAqui')}
                            />
                            <button
                                className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-3"
                                onClick={handleInvite}
                            >
                                {t('convidar')}
                            </button>
                        </div>
                    </>
                )}

                <div className="flex items-center gap-5 mt-2 overflow-x-auto">
                    <button
                        className={`font-bold py-1 border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('users')}
                    >
                        <FaUsers size={17} className={`${tabSelected === 'users' ? 'text-green-600' : 'text-white'}`} />
                        {t('pesquisadores')}
                    </button>

                    <button
                        className={`font-bold py-1 border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'researches' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('researches')}
                    >
                        <FaFileAlt size={17} className={`${tabSelected === 'researches' ? 'text-green-600' : 'text-white'}`} />
                        {t('pesquisas')}
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'isa' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('isa')}
                    >
                        <BsGraphUp size={17} className={`${tabSelected === 'isa' ? 'text-green-600' : 'text-white'}`} />
                        {t('indiceRegen')}
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'calculator-items' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('calculator-items')}
                    >
                        <FaCalculator size={17} className={`${tabSelected === 'calculator-items' ? 'text-green-600' : 'text-white'}`} />
                        {t('itensCalculadora')}
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'methods' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('methods')}
                    >
                        <VscSymbolMethod size={17} className={`${tabSelected === 'methods' ? 'text-green-600' : 'text-white'}`} />
                        {t('metodosAvaliacao')}
                    </button>

                    <button
                        className={`font-bold py-1 min-w-fit border-b-2 flex items-center gap-2 text-sm ${tabSelected === 'db' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('db')}
                    >
                        <FaDatabase size={17} className={`${tabSelected === 'db' ? 'text-green-600' : 'text-white'}`} />
                        {t('baseDados')}
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
                                    <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#03364B] mb-1">
                                        <p className="font-semibold text-white">{t('desejaPublicarPesquisa')}</p>

                                        <div className="flex items-center gap-2">
                                            <a
                                                target="_blank"
                                                href="https://docs.google.com/document/d/1ptMsGgZmV6uAo_e9bYLrpD_HpjTQJdK6AD-Bstr_XEo/edit?usp=sharing"
                                                className="bg-green-500 px-3 py-1 rounded-md text-white font-semibold flex items-center gap-2"
                                            >
                                                <BiFile color='white' size={20} />
                                                {t('verModelo')}
                                            </a>
                                            <button
                                                className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                                onClick={() => {
                                                    setPublishType('normal');
                                                    setModalPublish(true);
                                                }}
                                            >
                                                {t('publicar')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {researches.map(item => (
                                    <ResearcheItem data={item} />
                                ))}
                            </>
                        )}

                        {tabSelected === 'isa' && (
                            <div className="flex flex-wrap gap-4">
                                {categories.map(item => (
                                    <CategorieItem data={item} />
                                ))}
                            </div>
                        )}

                        {tabSelected === 'calculator-items' && (
                            <>
                                {userData?.userType === 3 && (
                                    <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#03364B] mb-1">
                                        <p className="font-semibold text-white">{t('desejaSugerirItem')}</p>

                                        <div className="flex items-center gap-2">
                                            <a
                                                target="_blank"
                                                href="https://docs.google.com/document/d/1ptMsGgZmV6uAo_e9bYLrpD_HpjTQJdK6AD-Bstr_XEo/edit?usp=sharing"
                                                className="bg-green-500 px-3 py-1 rounded-md text-white font-semibold flex items-center gap-2"
                                            >
                                                <BiFile color='white' size={20} />
                                                {t('verModelo')}
                                            </a>
                                            <button
                                                className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                                onClick={() => {
                                                    setPublishType('calculator');
                                                    setModalPublish(true);
                                                }}
                                            >
                                                {t('sugerir')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {items.map(item => (
                                    <Item data={item} hiddenButton type='list-items-calculator' />
                                ))}
                            </>
                        )}

                        {tabSelected === 'methods' && (
                            <>
                                {userData?.userType === 3 && (
                                    <div className="w-full flex justify-between items-center p-2 rounded-md bg-[#03364B] mb-1">
                                        <p className="font-semibold text-white">{t('desejaSugerirMetodo')}</p>

                                        <div className="flex items-center gap-2">
                                            <a
                                                target="_blank"
                                                href="https://docs.google.com/document/d/1ptMsGgZmV6uAo_e9bYLrpD_HpjTQJdK6AD-Bstr_XEo/edit?usp=sharing"
                                                className="bg-green-500 px-3 py-1 rounded-md text-white font-semibold flex items-center gap-2"
                                            >
                                                <BiFile color='white' size={20} />
                                                {t('verModelo')}
                                            </a>
                                            <button
                                                className="bg-blue-500 px-3 py-1 rounded-md text-white font-semibold"
                                                onClick={() => {
                                                    setPublishType('method');
                                                    setModalPublish(true);
                                                }}
                                            >
                                                {t('sugerir')}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button className="w-full p-3 rounded-md bg-[#03364B] flex items-center justify-between" onClick={() => navigate('/methods/sintrop')}>
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-white text-lg mb-1">{t('metodoSintrop')}</p>
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

                        {tabSelected === 'db' && (
                            <div>
                                <Flora />
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