import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { FeedbackItem } from "./FeedbackItem";
import { useMainContext } from "../../../../hooks/useMainContext";
import { SendReportDev } from '../../../checkout/SendReportDev';
import { UserRankingItem } from "../../../Community/Ranking/components/UserRankingItem";
import { Invite } from "../../../../services/web3/invitationService";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";
import { ModalCreateTask } from "./ModalCreateTask";
import {Feedback} from '../../../../components/Feedback';
import {Chat} from '../../../../components/Chat';
import { useTranslation } from "react-i18next";
import { ReportItem } from "./components/ReportItem";

export function DeveloperActions() {
    const {t} = useTranslation()
    const { userData, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [historyFeedbacks, setHistoryFeedbacks] = useState([]);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [tabSelected, setTabSelected] = useState('open');
    const [users, setUsers] = useState([]);
    const [wallet, setWallet] = useState('');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [createTask, setCreateTask] = useState(false);
    const [filterSelected, setFilterSelected] = useState(0);
    const [filterFeedbacks, setFilterFeedbacks] = useState([]);
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        if (tabSelected === 'open' || tabSelected === 'history') getFeedbacks();
        if (tabSelected === 'users') getUsers();
        if (tabSelected === 'contributions') getContributions();
    }, [tabSelected]);

    useEffect(() => {
        if (feedbacks.length > 0) {
            if (filterSelected === 0) {
                setFilterFeedbacks([]);
            } else {
                const filter = feedbacks.filter(item => Number(item.team) === Number(filterSelected));
                setFilterFeedbacks(filter);
            }
        }
    }, [filterSelected]);

    async function getContributions(){
        try{
            setLoading(true);
            const response = await api.get('/developer/reports');
            setContributions(response.data.contributions);
        }catch(e){
            console.log(e);
        }finally{
            setLoading(false);
        }
    }

    async function getFeedbacks() {
        setLoading(true);
        let openFeedbacks = [];
        let historyFeedbacks = [];

        const response = await api.get('feedback');
        const responseFeedbacks = response.data.feedbacks

        for (var i = 0; i < responseFeedbacks.length; i++) {
            if (responseFeedbacks[i].status === 3 || responseFeedbacks[i].status === 4) {
                historyFeedbacks.push(responseFeedbacks[i]);
            } else {
                openFeedbacks.push(responseFeedbacks[i]);
            }
        }

        setFeedbacks(openFeedbacks);
        setHistoryFeedbacks(historyFeedbacks);

        setLoading(false);
    }

    async function getUsers() {
        setLoading(true);
        const response = await api.get('/web3/developers');
        setUsers(response.data.developers);
        setLoading(false);
    }

    function handleInvite() {
        if (!wallet.trim()) {
            toast.error(t('digiteWallet'));
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
        Invite(walletConnected, String(wallet).toLowerCase(), 4)
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
                            userType: 4,
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

    function discardTask(id) {
        const filter = feedbacks.filter(item => item.id !== id);
        setFeedbacks(filter);
    }

    return (
        <div className="flex flex-col lg:w-[1024px]">

            <h3 className="font-bold text-white text-lg">{t('centroDev')}</h3>

            <div className="flex items-center justify-between w-full">
                <p className="text-gray-400 mt-1">Feedbacks/tasks</p>

                {userData?.userType === 4 && (
                    <button
                        className="px-3 h-10 rounded-md bg-blue-500 text-white font-bold"
                        onClick={() => setCreateTask(true)}
                    >
                        {t('criarTask')}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-8 mb-2">
                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'open' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('open')}
                >
                    {t('abertas')}
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'history' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('history')}
                >
                    {t('historico')}
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('users')}
                >
                    {t('desenvolvedores')}
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'contributions' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('contributions')}
                >
                    {t('contribuicoes')}
                </button>

                {userData?.userType === 4 && (
                    <button
                        className={`font-bold py-1 border-b-2 ${tabSelected === 'actions' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('actions')}
                    >
                        {t('acoes')}
                    </button>
                )}
            </div>
            {loading && (
                <div className="flex justify-center mb-5">
                    <ActivityIndicator size={50} />
                </div>
            )}

            {tabSelected === 'open' && (
                <>
                    {!loading && (
                        <select
                            value={filterSelected}
                            onChange={(e) => setFilterSelected(e.target.value)}
                            className="w-[200px] h-10 bg-[#03364B] text-white rounded-md px-3 mb-3"
                        >
                            <option value={0}>Todos</option>
                            <option value={1}>Front-End</option>
                            <option value={2}>Contratos inteligentes</option>
                            <option value={3}>Mobile</option>
                            <option value={4}>Design</option>
                            <option value={5}>UX</option>
                            <option value={6}>API</option>
                        </select>
                    )}

                    {filterFeedbacks.length > 0 ? (
                        <>
                            {filterFeedbacks.map(item => (
                                <FeedbackItem
                                    key={item.id}
                                    data={item}
                                    userData={userData}
                                    discardTask={(id) => discardTask(id)}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            {feedbacks.map(item => (
                                <FeedbackItem
                                    key={item.id}
                                    data={item}
                                    userData={userData}
                                    discardTask={(id) => discardTask(id)}
                                />
                            ))}
                        </>
                    )}
                </>
            )}

            {tabSelected === 'history' && (
                <>
                    {historyFeedbacks.map(item => (
                        <FeedbackItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
                </>
            )}

            {tabSelected === 'users' && (
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    {users.map(item => (
                        <UserRankingItem
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
            )}

            {tabSelected === 'actions' && (
                <>
                    {userData?.userType === 4 && (
                        <>
                            <p className="font-bold text-white text-lg">{t('convidarDev')}</p>
                            <div className="flex flex-col p-3 rounded-md bg-[#03364B] mb-5">
                                <p className="text-white">{t('descConviteDev')}</p>
                                <p className="mt-2 font-bold text-blue-500">Wallet</p>
                                <input
                                    value={wallet}
                                    onChange={(e) => setWallet(e.target.value)}
                                    className="px-3 py-2 rounded-md text-white bg-[#012939] max-w-[400px]"
                                    placeholder={t('digiteAqui')}
                                />
                                <button
                                    className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-3"
                                    onClick={handleInvite}
                                >
                                    {t('convidar')}
                                </button>
                            </div>

                            <p className="font-bold text-white text-lg">{t('relatorioDev')}</p>
                            <div className="flex flex-col p-2 bg-[#03364B] rounded-md mt-1 mb-5">
                                <p className="text-gray-400">{t('descRelatorioDev')}</p>
                                <button
                                    className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-1"
                                    onClick={() => setModalDevReport(true)}
                                >
                                    {t('enviarRelatorio')}
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}

            {tabSelected === 'contributions' && (
                <div className="flex flex-col gap-3">
                    {contributions.map(item => (
                        <ReportItem
                            key={item.id}
                            contribution={item}
                        />
                    ))}
                </div>
            )}

            {modalDevReport && (
                <SendReportDev
                    close={() => setModalDevReport(false)}
                    walletAddress={walletConnected}
                    userData={userData}
                />
            )}

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        toast.success(t('apoiadorConvidado'))
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <Dialog.Root open={createTask} onOpenChange={(open) => setCreateTask(open)}>
                <ModalCreateTask
                    close={() => setCreateTask(false)}
                    success={() => {
                        toast.success(t('taskCriada'));
                        getFeedbacks();
                    }}
                />
            </Dialog.Root>

            <ToastContainer />

            <div className="hidden lg:flex">
                <Feedback />
                <Chat/>
            </div>
        </div>
    )
}