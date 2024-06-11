import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { FeedbackItem } from "./feedbackItem";
import { useMainContext } from "../../../../hooks/useMainContext";
import { SendReportDev } from '../../../checkout/SendReportDev';
import { UserRankingItem } from "../../../Ranking/components/UserRankingItem";
import { Invite } from "../../../../services/invitationService";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";

export function DeveloperActions() {
    const { userData, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [historyFeedbacks, setHistoryFeedbacks] = useState([]);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [tabSelected, setTabSelected] = useState('users');
    const [users, setUsers] = useState([]);
    const [wallet, setWallet] = useState('');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    useEffect(() => {
        if (tabSelected === 'open' || tabSelected === 'history') getFeedbacks();
        if (tabSelected === 'users') getUsers();
    }, [tabSelected]);

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
            toast.error('Digite uma wallet!');
            return
        }
        if (window.ethereum) {
            inviteUser();
        } else {
            toast.error('Você precisa estar em um navegador com provedor Ethereum!')
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

    return (
        <div className="flex flex-col lg:w-[1024px]">
            {userData?.userType === 4 && (
                <>
                    <p className="font-bold text-white text-lg">Convidar desenvolvedor</p>
                    <div className="flex flex-col p-3 rounded-md bg-[#0a4303] mb-5">
                        <p className="text-white">Para convidar outro desenvolvedor, basta inserir a wallet dele abaixo</p>
                        <p className="mt-2 font-bold text-blue-500">Wallet</p>
                        <input
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                            className="px-3 py-2 rounded-md text-white bg-green-950 max-w-[400px]"
                            placeholder="Digite aqui"
                        />
                        <button
                            className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-3"
                            onClick={handleInvite}
                        >
                            Convidar
                        </button>
                    </div>

                    <p className="font-bold text-white text-lg">Relatório de desenvolvimento</p>
                    <div className="flex flex-col p-2 bg-[#0a4303] rounded-md mt-1 mb-5">
                        <p className="text-gray-400">Envie sua prova de contribuição para o desenvolvimento do sistema</p>
                        <button
                            className="font-bold text-white px-3 py-1 rounded-md bg-blue-500 w-fit mt-1"
                            onClick={() => setModalDevReport(true)}
                        >
                            Enviar relatório
                        </button>
                    </div>
                </>
            )}

            <h3 className="font-bold text-white text-lg">Centro de desenvolvimento</h3>

            <p className="text-gray-400 mt-1">Feedbacks/tasks</p>
            <div className="flex items-center gap-8 mb-2">
                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('users')}
                >
                    Desenvolvedores
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'open' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('open')}
                >
                    Abertas
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'history' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('history')}
                >
                    Histórico
                </button>

            </div>
            {loading && (
                <ActivityIndicator size={50} />
            )}

            {tabSelected === 'open' && (
                <>
                    {feedbacks.map(item => (
                        <FeedbackItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
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
                            data={item}
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
                        toast.success('Apoiador convidado com sucesso!')
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    )
}