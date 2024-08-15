import React, { useState, useEffect } from "react";
import { api } from "../../../../services/api";
import { ActivityIndicator } from '../../../../components/ActivityIndicator';
import { TaskItem } from "./taskItem";
import { useMainContext } from "../../../../hooks/useMainContext";
import { SendReportDev } from '../../../checkout/SendReportDev';
import { UserRankingItem } from "../../../Ranking/components/UserRankingItem";
import { Invite } from "../../../../services/invitationService";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import * as Dialog from '@radix-ui/react-dialog';
import { ToastContainer, toast } from "react-toastify";
import { ModalCreateTask } from "./ModalCreateTask";
import { useTranslation } from "react-i18next";

export function ColaboratorActions() {
    const {t} = useTranslation();
    const { userData, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [historyTasks, setHistoryTasks] = useState([]);
    const [tabSelected, setTabSelected] = useState('open');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [createTask, setCreateTask] = useState(false);

    useEffect(() => {
        if (tabSelected === 'open' || tabSelected === 'history') getTasks();
    }, [tabSelected]);

    async function getTasks() {
        setLoading(true);
        let openTasks = [];
        let historyTasks = [];

        const response = await api.get('/tasks');
        const responseTasks = response.data.tasks

        for (var i = 0; i < responseTasks.length; i++) {
            if (responseTasks[i].status === 3 || responseTasks[i].status === 4) {
                historyTasks.push(responseTasks[i]);
            } else {
                openTasks.push(responseTasks[i]);
            }
        }

        setTasks(openTasks);
        setHistoryTasks(historyTasks);

        setLoading(false);
    }


    // function handleInvite() {
    //     if (!wallet.trim()) {
    //         toast.error('Digite uma wallet!');
    //         return
    //     }
    //     if (window.ethereum) {
    //         inviteUser();
    //     } else {
    //         toast.error('Você precisa estar em um navegador com provedor Ethereum!')
    //     }
    // }

    // async function inviteUser() {
    //     setModalTransaction(true);
    //     setLoadingTransaction(true);
    //     Invite(walletConnected, String(wallet).toLowerCase(), 4)
    //         .then(async (res) => {
    //             setLogTransaction({
    //                 type: res.type,
    //                 message: res.message,
    //                 hash: res.hashTransaction
    //             });

    //             if (res.type === 'success') {
    //                 await api.post('/publication/new', {
    //                     userId: userData?.id,
    //                     type: 'invite-wallet',
    //                     origin: 'platform',
    //                     additionalData: JSON.stringify({
    //                         hash: res.hashTransaction,
    //                         walletInvited: wallet,
    //                         userType: 4,
    //                         userData
    //                     }),
    //                 });
    //             }
    //             setLoadingTransaction(false);
    //         })
    //         .catch(err => {
    //             setLoadingTransaction(false);
    //             const message = String(err.message);
    //             setLogTransaction({
    //                 type: 'error',
    //                 message: 'Something went wrong with the transaction, please try again!',
    //                 hash: ''
    //             })
    //         })

    // }

    return (
        <div className="flex flex-col lg:w-[1024px]">
            <h3 className="font-bold text-white text-lg">{t('centroColab')}</h3>

            <div className="flex items-center justify-between w-full">
                <p className="text-gray-400 mt-1">Tasks</p>

                <button
                    className="text-white font-bold h-10 px-4 rounded-md bg-blue-500"
                    onClick={() => setCreateTask(true)}
                >
                    {t('criarTask')}
                </button>
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

            </div>
            {loading && (
                <ActivityIndicator size={50} />
            )}

            {tabSelected === 'open' && (
                <>
                    {tasks.map(item => (
                        <TaskItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
                </>
            )}

            {tabSelected === 'history' && (
                <>
                    {historyTasks.map(item => (
                        <TaskItem
                            key={item.id}
                            data={item}
                            userData={userData}
                        />
                    ))}
                </>
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

            <Dialog.Root open={createTask} onOpenChange={(open) => setCreateTask(open)}>
                <ModalCreateTask
                    close={() => setCreateTask(false)}
                    success={() => {
                        toast.success(t('taskCriada'));
                        getTasks();
                    }}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    )
}