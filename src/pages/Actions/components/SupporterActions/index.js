import React, { useEffect, useState } from "react";
import { Info } from "../../../../components/Info";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { api } from "../../../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from "../../../../hooks/useMainContext";
import { ModalTransactionCreated } from "../../../../components/ModalTransactionCreated";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { Invite } from "../../../../services/web3/invitationService";

export function SupporterActions() {
    const { userData, connectionType, walletConnected } = useMainContext();
    const [wallet, setWallet] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalTxCreated, setModalTxCreated] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    function handleInvite() {
        if(loading){
            return;
        }
        if (!wallet.trim()) {
            toast.error('Digite uma wallet')
            return;
        }

        if (connectionType === 'provider') {
            inviteUser();
        } else {
            createTransaction();
        }
    }

    async function inviteUser() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        Invite(walletConnected, String(wallet).toLowerCase(), 7)
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
                            userType: 7,
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

    async function createTransaction() {
        try {
            setLoading(true);
            await api.post('/transactions-open/create', {
                wallet: userData.wallet,
                type: 'invite-user',
                additionalData: JSON.stringify({
                    userWallet: wallet,
                    userType: 7
                })
            })
            setModalTxCreated(true);
            setWallet('');
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
            toast.error('Wallet inválida!')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col lg:w-[1024px]">
            <h3 className="font-bold text-white text-lg">Ações do apoiador</h3>
            <Info
                text1='Convide outros apoiadores para o sistema, e receba comissões pelas contribuições do apoiador convidado.'
                text2='Para cada contribuição feita por um apoiador que foi convidado por você, 1% dessa contribuição retorna para você.'
                text3='Para isso, você só precisa convidar uma wallet que não esteja cadastrada no nosso sistema e ela se cadastre como apoiador.'
            />

            <p className="mt-5 font-bold text-blue-500">Wallet</p>
            <input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="px-3 py-2 rounded-md text-white bg-[#0a4303] max-w-[400px]"
                placeholder="Digite aqui"
            />

            <button
                className="h-10 rounded-md font-bold text-white max-w-[400px] bg-blue-500 mt-3"
                onClick={handleInvite}
            >
                {loading ? (
                    <ActivityIndicator size={25} />
                ) : 'Convidar wallet'}
            </button>

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

            {modalTxCreated && (
                <ModalTransactionCreated close={() => setModalTxCreated(false)} />
            )}
            <ToastContainer />
        </div>
    )
}