import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useMainContext } from "../../hooks/useMainContext";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "../ActivityIndicator/ActivityIndicator";
import { LoadingTransaction } from "./components/LoadingTransaction/LoadingTransaction";
import { ModalTransactionCreated } from "../ModalTransactionCreated";

interface Props{
    transactionType: string;
    additionalData: string;
    close: () => void;
    success: (type: 'blockchain' | 'checkout') => void;
}
export function ModalWhereExecuteTransaction({transactionType, close, additionalData, success}: Props){
    const {t} = useTranslation();
    //@ts-ignore
    const { userData } = useMainContext();
    const [availableProvider, setAvailableProvider] = useState(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [showLoadingTransaction, setShowLoadingTransaction] = useState(false);
    const [showTransactionCreated, setShowTransactionCreated] = useState(false);

    useEffect(() => {
        //@ts-ignore
        if(window.ethereum){
            setAvailableProvider(true);
        }else{
            setAvailableProvider(false);
        }
    }, []);

    async function handleExecuteTransaction(){
        setShowLoadingTransaction(true);
    }


    async function handleCreateTransactionOnCheckout(){
        if(transactionType === 'sendContribution'){
            toast.error('essaAcaoNaoEstaDisponivelNoCheckout')
            return;
        }
        if(transactionType === 'publishResearche'){
            toast.error('essaAcaoNaoEstaDisponivelNoCheckout')
            return;
        }
        if(transactionType === 'inviteUser'){
            toast.error('essaAcaoNaoEstaDisponivelNoCheckout')
            return;
        }
        if(transactionType === 'voteUser'){
            toast.error('essaAcaoNaoEstaDisponivelNoCheckout')
            return;
        }
        try{
            setLoadingCheckout(true);
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: transactionType,
                additionalData,
            });
            setShowTransactionCreated(true);
        }catch(err){
            //@ts-ignore
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error(t('transacaoDoMesmoTipoAberto'))
            }
        }finally{
            setLoadingCheckout(false);
        }
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <div className='absolute flex flex-col items-center p-3 lg:w-[400px] h-[300px] bg-container-primary rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-6"/>
                    <p 
                        className="text-center text-white font-semibold max-w-[60%]"
                    >
                        Onde você deseja executar essa transação?
                    </p>

                    <button onClick={close}>
                        <MdClose size={25} color='white'/>
                    </button>
                </div>

                <div className="flex flex-col mt-5 p-5 w-full gap-3">
                    <button
                        onClick={handleExecuteTransaction}
                        className={`w-full h-10 rounded-md bg-white flex items-center justify-center gap-3 font-semibold text-black ${!availableProvider ? 'opacity-40' : 'opacity-100'}`}
                        disabled={!availableProvider}
                    >
                        Finalizar agora no metamask
                    </button>
                    {!availableProvider && (
                        <p className="text-yellow-400 text-sm text-center">
                            Para finalizar no metamask, você precisa ter ele instalado em seu navegador
                        </p>
                    )}

                    <p className="text-sm text-gray-400 text-center">ou</p>

                    <button
                        onClick={handleCreateTransactionOnCheckout}
                        className={`w-full h-10 rounded-md bg-blue-primary flex items-center justify-center gap-3 font-semibold text-white`}
                        disabled={loadingCheckout}
                    >
                        {loadingCheckout ? (
                            //@ts-ignore
                            <ActivityIndicator size={25}/>
                        ) : (
                            'Enviar para o checkout'
                        )}
                    </button>
                </div>
            </div>

            {showLoadingTransaction && (
                <LoadingTransaction
                    additionalDataTransaction={additionalData}
                    close={() => setShowLoadingTransaction(false)}
                    success={() => success('blockchain')}
                    transactionType={transactionType}
                />
            )}

            {showTransactionCreated && (
                <ModalTransactionCreated
                    close={() => success('checkout')}
                />
            )}
        </div>
    )
}