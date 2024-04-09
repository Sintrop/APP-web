import React, { useEffect, useState } from "react";
import { FaChevronLeft } from 'react-icons/fa';
import {ActivityIndicator} from '../../../../components/ActivityIndicator';
import { useMainContext } from "../../../../hooks/useMainContext";
import { toast, ToastContainer } from "react-toastify";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { api } from "../../../../services/api";
import { InvalidateInspection } from "../../../../services/sintropService";
import { addValidation } from "../../../../services/validatorService";

export function ModalValidation({ close, data }) {
    const {walletConnected, userData, connectionType} = useMainContext();
    const [validationType, setValidationType] = useState('inspection');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    useEffect(() => {
        if (data.inspectedAt) {
            setValidationType('inspection')
        }
        if (data.name) {
            setValidationType('user')
        }
    }, []);

    async function handleVote(){
        if(loading){
            return;
        }

        if(!input.trim()){
            toast.error('Digite uma justificativa!')
            return;
        }

        if(connectionType === 'notprovider'){
            toast.error('Você deve se conectar em um navegador com provedor Ethereum!');
            return;
        }

        if(validationType === 'inspection'){
            invalidateInspection();
        }
        if(validationType === 'user'){
            invalidateUser();
        }
    }

    async function invalidateInspection() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        InvalidateInspection(walletConnected, data.id, input)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });

                if (res.type === 'success') {
                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'vote-invalidate-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            inspection: data,
                            userData,
                            justification: input
                        }),
                    });
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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

    async function invalidateUser() {
        let walletToVote = '';

        if (data?.userType === 1) {
            walletToVote = data?.producerWallet;
        }
        if (data?.userType === 2) {
            walletToVote = data?.inspectorWallet;
        }
        if (data?.userType === 3) {
            walletToVote = data?.researcherWallet;
        }
        if (data?.userType === 4) {
            walletToVote = data?.developerWallet;
        }
        if (data?.userType === 7) {
            walletToVote = data?.supporterWallet;
        }

        setModalTransaction(true);
        setLoadingTransaction(true);
        addValidation(walletConnected, walletToVote, input)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });

                if (res.type === 'success') {
                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'vote-invalidate-user',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            userToVote: data,
                            userData,
                            justification: input
                        }),
                    });

                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[500px] lg:h-[280px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <div className="flex items-center gap-2">
                    <button
                        onClick={close}
                    >
                        <FaChevronLeft size={17} color='white' />
                    </button>
                    <p className="font-semibold text-white">
                        Invalidar

                        {validationType === 'inspection' && ' inspeção'}
                        {validationType === 'user' && ' usuário'}
                    </p>
                </div>

                <div className="flex flex-col mt-10">
                    <p className="text-center text-white font-semibold">
                        {validationType === 'inspection' && `Você está votando para invalidar a inspeção #${data.id}`}
                        {validationType === 'user' && `Você está votando para invalidar o usuário ${data.name}`}
                    </p>

                    <label className="text-sm text-blue-600 font-bold mt-3">Justificativa:</label>

                    <input
                        placeholder="Digite aqui"
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        className="text-white p-2 rounded-md bg-green-950 w-full"
                    />

                    <button className="font-semibold text-white w-full py-2 rounded-md bg-blue-600 mt-5" onClick={handleVote}>
                        {loading ? (
                            <ActivityIndicator size={25}/>
                        ) : 'Votar'}
                    </button>
                </div>
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if(!loadingTransaction){
                    setModalTransaction(open)
                    setLoading(false);
                    if(logTransaction.type === 'success'){
                        
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer/>
        </div>
    )
}