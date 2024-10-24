import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { api } from "../../../services/api";
import { IoMdSearch } from "react-icons/io";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from "../../../hooks/useMainContext";
import { BurnTokens as BurnRCSupporter } from "../../../services/web3/supporterService";
import { BurnTokens } from "../../../services/web3/rcTokenService";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../../../components/LoadingTransaction";
import { useTranslation } from "react-i18next";

export function ModalPaymentInvoice({ close, type, invoiceData, invoiceValue, transactionCreated, impactToken }) {
    const {t} = useTranslation();
    const { userData, walletConnected } = useMainContext();
    const [balanceData, setBalanceData] = useState(null);
    const [maxAmmount, setMaxAmmount] = useState(false);
    const [greaterThenInvoice, setGreaterThenInvoice] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectType, setSelectType] = useState('total');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    useEffect(() => {
        getBalance();
        setSelectType(type)
        if (type === 'total') {
            setInput(String(invoiceValue));
        }
    }, [])

    useEffect(() => {
        if (balanceData) {
            if (Number(String(input).replace(',', '.')) > Number(String(balanceData?.balance).replace(',', '.'))) {
                setMaxAmmount(true);
            } else {
                setMaxAmmount(false)
            }
        }

        if (Number(String(input).replace(',', '.')) > invoiceValue) {
            setGreaterThenInvoice(true);
        } else {
            setGreaterThenInvoice(false);
        }
    }, [input]);

    async function getBalance() {
        const response = await api.get(`/web3/balance-tokens/${userData?.wallet}`);
        setBalanceData(response.data);
    }

    function handlePayment(){
        if(window.ethereum){
            contributeBlockchain();
        }else{
            paymentOnCheckout();
        }
    }

    async function paymentOnCheckout() {
        if (!input.trim()) return;
        if (maxAmmount) return;
        if (greaterThenInvoice) return;

        setLoading(true);
        try {
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'burn-tokens',
                additionalData: JSON.stringify({
                    value: Number(String(input).replace(',', '.')),
                    invoiceData,
                    typePayment: selectType
                }),
            })
            setInput('');
            transactionCreated();
            close();
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                alert(t('transacaoDoMesmoTipoAberto'))
            }
        } finally {
            setLoading(false);
        }
    }

    async function contributeBlockchain() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        if (userData.userType === 7) {
            BurnRCSupporter(walletConnected, String(Number(String(input).replace(',', '.'))) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(Number(String(input).replace(',', '.')), res.hashTransaction)
                        if(invoiceData){
                            attValuesInvoice();
                        }
                    }

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
        } else {
            BurnTokens(walletConnected, String(Number(String(input).replace(',', '.'))) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(Number(String(input).replace(',', '.')), res.hashTransaction);
                        if(invoiceData){
                            attValuesInvoice();
                        }
                    }

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
    }

    async function registerTokensApi(tokens, hash) {
        const addData = {
            userData,
            tokens: Number(tokens),
            transactionHash: hash,
            hash,
            invoiceData: invoiceData,
            typePayment: selectType,
        }

        try {
            await api.post('/tokens-burned', {
                wallet: walletConnected.toUpperCase(),
                tokens: Number(tokens),
                transactionHash: hash,
                carbon: Number(impactToken?.carbon),
                water: Number(impactToken?.water),
                bio: Number(impactToken?.bio),
                soil: Number(impactToken?.soil)
            });

            await api.post('/publication/new', {
                userId: userData?.id,
                type: 'contribute-tokens',
                origin: 'platform',
                additionalData: JSON.stringify(addData),
            })
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingTransaction(false);
        }
    }

    async function attValuesInvoice() {
        if (selectType === 'partial') {
            const response = await api.get(`/invoice/${invoiceData?.id}`);
            const ammountReceived = response.data.invoice?.ammountReceived;
            const newAmmount = ammountReceived + Number(String(input).replace(',', '.'));

            try {
                await api.put('/invoice', {
                    invoiceId: response.data.invoice?.id,
                    ammountReceived: Number(newAmmount)
                })
            } catch (err) {
                console.log(err);
            }
        }

        if (selectType === 'total') {
            const response = await api.get('/impact-per-token');
            const impact = response.data.impact;

            try {
                await api.put('/invoice', {
                    invoiceId: invoiceData?.id,
                    ammountReceived: Number(String(input).replace(',', '.')),
                    impactTokenCarbon: impact?.carbon,
                    impactTokenWater: impact?.water,
                    impactTokenSoil: impact?.soil,
                    impactTokenBio: impact?.bio,
                })
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-black/60 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[400px] h-[420px] bg-[#0a4303] rounded-md m-auto inset-0 border-2 z-50'>
                <div className="flex items-center justify-between">
                    <div className="w-[25px]" />

                    <button onClick={close}>
                        <MdClose size={25} color='white' />
                    </button>
                </div>

                <div className="flex flex-col pb-3 border-b border-green-500">
                    <p className="text-white">{t('seuSaldo')}</p>
                    <div className="flex items-center gap-2">
                        <img
                            src={require('../../../assets/token.png')}
                            className="w-10 h-10 object-contain"
                        />
                        <p className="font-bold text-white text-lg">
                            {balanceData ? `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(balanceData?.balance)} RC` : t('buscandoDados')}
                        </p>
                    </div>
                </div>

                <p className="font-bold text-white mt-4">{t('compenseSeuImpacto')}</p>

                <p className="text-white mt-3">{t('valorFatura')}</p>
                <div className="w-full h-10 rounded-md px-2 bg-green-950 flex items-center">
                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(invoiceValue)} RC</p>
                </div>

                {type === 'partial' && (
                    <>
                        <p className="text-white mt-3">{t('quantoCompensar')}</p>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-10 px-2 bg-green-950 text-white rounded-md"
                            placeholder={t('digiteAqui')}
                        />

                        {maxAmmount && (
                            <p className="text-center text-red-500 mt-2">{t('saldoInsuficiente')}</p>
                        )}

                        {greaterThenInvoice && (
                            <p className="text-center text-red-500 mt-2">{t('voceNaoPodeCompensarUmValorMaisAlto')}</p>
                        )}
                    </>
                )}

                {type === 'total' && (
                    <>
                        <p className="text-white mt-3">{t('voceDesejaFazerPagamento')}</p>
                        <select
                            value={selectType}
                            onChange={(e) => setSelectType(e.target.value)}
                            className="text-white w-full h-10 px-2 rounded-md bg-green-950 mb-2"
                        >
                            <option value='total'>{t('total')}</option>
                            <option value='partial'>{t('parcial')}</option>
                        </select>
                        
                        {selectType === 'partial' && (
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-10 px-2 bg-green-950 text-white rounded-md"
                                placeholder={t('digiteAqui')}
                            />
                        )}

                        {maxAmmount && (
                            <p className="text-center text-red-500 mt-2">{t('saldoInsuficiente')}</p>
                        )}

                        {greaterThenInvoice && (
                            <p className="text-center text-red-500 mt-2">{t('voceNaoPodeCompensarUmValorMaisAlto')}</p>
                        )}
                    </>
                )}

                <button
                    className="text-white h-10 w-full rounded-md bg-blue-500 mt-3"
                    onClick={handlePayment}
                >
                    {loading ? (
                        <ActivityIndicator size={25}/>
                    ) : (
                        t('compensar')
                    )}
                </button>
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        toast.success(t('compensacaoFeita'));
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