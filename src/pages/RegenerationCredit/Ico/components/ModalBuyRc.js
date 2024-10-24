import React, {useEffect, useState} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useMainContext } from "../../../../hooks/useMainContext";
import { api } from "../../../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { LoadingTransaction } from "../../../../components/LoadingTransaction";
import { BuyRCT } from "../../../../services/web3/rcTokenService";
import { ActivityIndicator } from "../../../../components/ActivityIndicator";
import { useTranslation } from "react-i18next";

export function ModalBuyRc({diferenca, close}){
    const {t} = useTranslation();
    const {userData, walletConnected, connectionType} = useMainContext();
    const [balanceETH, setBalanceETH] = useState(0);
    const [credits, setCredits] = useState(0);
    const [input, setInput] = useState('');
    const [maxAmmount, setMaxAmmount] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    useEffect(() => {
        setCredits((Number(String(input).replace(',', '.')) / 0.0000125).toFixed(0))
        if (Number(String(input).replace(',', '.')) > Number(balanceETH)) {
            setMaxAmmount(true);
        } else {
            setMaxAmmount(false);
        }
    }, [input, balanceETH]);

    useEffect(() => {
        if(walletConnected !== '')getBalanceETH();
        if (diferenca > 0) {
            setInput((parseFloat(diferenca) * 0.0000125).toFixed(5))
        }
    }, []);

    async function getBalanceETH() {
        const response = await api.get(`/web3/balance-eth/${userData?.wallet}`);
        setBalanceETH(response.data.balance_eth);
    }

    function handleBuy(){
        if(maxAmmount){
            toast.error('Saldo em ETH insuficiente!')
            return;
        }
        if(loadingBuy){
            return;
        }
        if(credits === '0'){
            toast.error('Digite um valor para compra')
            return;
        }

        if(connectionType === 'provider'){
            buyOnBlockchain();
        }else{
            buyOnCheckout();
        }
    }

    async function buyOnCheckout() {
        setLoadingBuy(true);
        try {
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'buy-tokens',
                additionalData: JSON.stringify({
                    value: Number(String(input).replace(',', '.'))
                }),
            })
            setInput('');
            getBalanceETH();
            close(true)
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error(t('transacaoDoMesmoTipoAberto'))
            }
        } finally {
            setLoadingBuy(false);
        }
    }

    async function buyOnBlockchain() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        BuyRCT(walletConnected, Number(String(input).replace(',', '.')))
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                setLoadingTransaction(false);

                if (res.type === 'success') {
                    setInput(0);
                    getBalanceETH();
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

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0 z-50'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center bg-[#0a4303] h-[400px] rounded-md m-auto inset-0 md:w-[400px] p-5'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-8"/>
                    <Dialog.Title className="font-bold text-white">{t('comprarRC')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline color='white' size={25}/>
                    </Dialog.Close>
                </div>

                {walletConnected === '' ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white text-center">{t('voceNaoConectado')}</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-1 mt-5">
                        <div className="flex flex-col p-2 rounded-md bg-green-950">
                            <p className="font-bold text-white text-sm">{t('seuSaldoETH')}</p>
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-white rounded-full">
                                    <img
                                        src={require('../../../../assets/eth-icon.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>

                                <p className="font-bold text-white">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(Number(balanceETH))} ETH</p>
                            </div>
                        </div>

                        <label className="font-bold text-sm text-blue-500 mt-2">{t('quantoDesejaComprar')}</label>
                        <input
                            type='number'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite aqui o valor em ETH"
                            className="w-full rounded-md bg-green-950 px-2 text-white h-12"
                        />

                        {maxAmmount && (
                            <p className="text-center text-red-500">{t('saldoInsuficiente')}</p>
                        )}

                        <div className="flex flex-col p-2 rounded-md bg-green-950 mt-2">
                            <p className="font-bold text-white text-sm">{t('voceVaiReceberRC')}</p>
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-white rounded-full">
                                    <img
                                        src={require('../../../../assets/token.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                </div> 

                                <p className="font-bold text-white">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(Number(credits))} CR</p>
                            </div>
                        </div>

                        <button
                            className="py-2 w-full bg-blue-500 rounded-md font-bold text-white mt-1"
                            onClick={handleBuy}
                        >
                            {loadingBuy ? (
                                <ActivityIndicator size={25}/>
                            ) : 
                                t('comprar')
                            }
                        </button>
                    </div>
                )}
            </Dialog.Content>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoadingBuy(false);

                    if (logTransaction.type === 'success') {
                        toast.success(t('compraTokensSucesso'));
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer/>
        </Dialog.Portal>
    )
}