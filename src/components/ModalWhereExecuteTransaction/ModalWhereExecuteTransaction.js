import React, { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { MdClose } from "react-icons/md";
import { useMainContext } from "../../hooks/useMainContext";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "../ActivityIndicator";

export function ModalWhereExecuteTransaction({transactionType, close, additionalData, success}){
    const {t} = useTranslation();
    const { userData } = useMainContext();
    const [availableProvider, setAvailableProvider] = useState(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    useEffect(() => {
        if(window.ethereum){
            setAvailableProvider(true);
        }else{
            setAvailableProvider(false);
        }
    }, []);

    async function handleCreateTransactionOnCheckout(){
        try{
            setLoadingCheckout(true);
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: transactionType,
                additionalData,
            });
            success('checkout');
        }catch(err){
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error(t('transacaoDoMesmoTipoAberto'))
            }
        }finally{
            setLoadingCheckout(false);
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center p-3 lg:w-[400px] h-[300px] bg-container-primary rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-6"/>
                    <Dialog.Title 
                        className="text-center text-white font-semibold max-w-[60%]"
                    >
                        Onde você deseja executar essa transação?
                    </Dialog.Title>

                    <Dialog.Close>
                        <MdClose size={25} color='white'/>
                    </Dialog.Close>
                </div>

                <div className="flex flex-col mt-10 p-5 w-full gap-3">
                    <button
                        onClick={() => {}}
                        className={`w-full h-10 rounded-md bg-white flex items-center justify-center gap-3 font-semibold text-black ${!availableProvider && 'opacity-40'}`}
                        disabled={!availableProvider}
                    >
                        Finalizar agora no metamask
                    </button>

                    <p className="text-sm text-gray-400 text-center">ou</p>

                    <button
                        onClick={handleCreateTransactionOnCheckout}
                        className={`w-full h-10 rounded-md bg-blue-primary flex items-center justify-center gap-3 font-semibold text-white`}
                        disabled={loadingCheckout}
                    >
                        {loadingCheckout ? (
                            <ActivityIndicator size={25}/>
                        ) : (
                            'Enviar para o checkout'
                        )}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}