import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { api } from "../../../../services/api";
import { UserInvite } from "./UserInvite";
import { Invite } from '../../../../services/web3/invitationService';
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { ToastContainer, toast } from "react-toastify";
import * as Dialog from '@radix-ui/react-dialog';
import { ActivityIndicator } from "../../../../components/ActivityIndicator";
import { ModalTransactionCreated } from "../../../../components/ModalTransactionCreated";
import { UserRankingItem } from "../../../Community/Ranking/components/UserRankingItem";

export function ActivistActions({ }) {
    const { userData, walletConnected, connectionType } = useMainContext();
    const [tabSelected, setTabSelected] = useState('users');
    const [loading, setLoading] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [wallet, setWallet] = useState('');
    const [userType, setUserType] = useState(2);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (tabSelected === 'registers') getRegisters();
        if (tabSelected === 'users') getUsers();
    }, [tabSelected]);

    async function getRegisters() {
        setLoading(true);
        const response = await api.get('/users');
        const users = response.data.users;

        let array = [];

        for (var i = 0; i < users.length; i++) {
            if (users[i].userType === 2 || users[i].userType === 6) {
                if (users[i].accountStatus === 'pending') {
                    array.push(users[i])
                }
            }
        }

        setRegisters(array);
        setLoading(false);
    }

    function handleInvite(data) {
        if (loadingInvite || loadingTransaction) {
            return
        }

        if (connectionType === 'provider') {
            inviteUserOnBlockchain(data)
        } else {
            inviteUserOnCheckout(data);
        }
    }

    async function inviteUserOnCheckout(data) {
        setLoadingInvite(true);
        try {
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'invite-user',
                additionalData: JSON.stringify({
                    userWallet: data.wallet,
                    userType: Number(data.userType)
                })
            })
            setCreatedTransaction(true);
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                alert('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!');
                return;
            }
            if (err.response?.data?.message === 'already registered user') {
                alert('Esse usuário já está cadastrado na Blockchain! Você só pode convidar usuários que não estejam cadastrados na Blockchain.');
                return;
            }
            if (err.response?.data?.message === 'wallet already invited') {
                alert('Essa wallet já foi convidada por outro usuário!');
                return;
            }
            toast.error('Algo deu errado, tente novamente!');
        } finally {
            setLoadingInvite(false);
        }
    }

    async function inviteUserOnBlockchain(data) {
        setModalTransaction(true);
        setLoadingTransaction(true);
        Invite(walletConnected, String(data?.wallet).toLowerCase(), Number(data?.userType))
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
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

    async function getUsers() {
        setLoading(true);
        const response = await api.get('/web3/activists');
        setUsers(response.data.activists);
        setLoading(false);
    }

    return (
        <div className="flex flex-col lg:w-[1024px] pb-10">
            <h3 className="font-bold text-white text-lg">Centro comercial</h3>

            <div className="flex items-center gap-8 mb-2">
                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('users')}
                >
                    Ativistas
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'registers' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('registers')}
                >
                    Solicitações de convites
                </button>

                {userData?.userType === 6 && (
                    <button
                        className={`font-bold py-1 border-b-2 ${tabSelected === 'invite-wallet' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                        onClick={() => setTabSelected('invite-wallet')}
                    >
                        Convidar usuário
                    </button>
                )}
            </div>

            <div className="flex flex-col mt-3 gap-3">
                {tabSelected === 'registers' && (
                    <>
                        {loading ? (
                            <div className="w-full h-[70vh] flex items-center justify-center">
                                <ActivityIndicator size={180} />
                            </div>
                        ) : (
                            <>
                                {registers.map(item => (
                                    <UserInvite
                                        key={item?.id}
                                        data={item}
                                        inviteUser={(data) => handleInvite(data)}
                                        loadingInvite={loadingInvite}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}

                {tabSelected === 'invite-wallet' && (
                    <div className="flex flex-col p-2 rounded-md bg-[#0a4303]">
                        <label className="font-bold text-white text-sm">Insira a wallet que seja convidar</label>
                        <input
                            className="p-2 rounded-md bg-green-950 text-white"
                            placeholder="Digite aqui"
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                        />

                        <label className="font-bold text-white text-sm mt-3">Escolha o tipo de usuário para a wallet</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="p-2 rounded-md bg-green-950 text-white"
                        >
                            <option value={1}>Produtor(a)</option>
                            <option value={2}>Inspetor(a)</option>
                            <option value={6}>Ativista</option>
                        </select>

                        <button
                            className="p-2 rounded-md bg-blue-500 text-white font-bold mt-5 h-10"
                            onClick={() => {
                                if (!wallet.trim()) {
                                    return;
                                }
                                handleInvite({ wallet, userType })
                            }}
                        >
                            {loadingInvite ? (
                                <ActivityIndicator size={20} />
                            ) : 'Convidar'}
                        </button>
                    </div>
                )}

                {tabSelected === 'users' && (
                    <div className={`flex gap-3 flex-wrap max-w-[1024px] mt-3 ${users.length < 4 ? 'justify-start' : 'justify-center'}`}>
                        {users.map(item => (
                            <UserRankingItem
                                data={item}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        setWallet('');
                        setUserType(2);
                        toast.success('Convite feito com sucesso!')
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => setCreatedTransaction(false)}
                />
            )}

            <ToastContainer />
        </div>
    )
}