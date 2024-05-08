import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import { FaCalculator, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../../../components/LoadingTransaction";
import { ActivityIndicator } from '../../../components/ActivityIndicator';
import { BurnTokens as BurnRCSupporter } from "../../../services/supporterService";
import { BurnTokens } from "../../../services/sacTokenService";
import { ModalTransactionCreated } from "../../../components/ModalTransactionCreated";
import { TopBar } from "../../../components/TopBar";
import { useNavigate } from "react-router";

export function Contribute() {
    const navigate = useNavigate();
    const { walletConnected, connectionType, userData, itemsCalculator, tokensToContribute } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [impactInvestor, setImpactInvestor] = useState({});
    const [input, setInput] = useState('');
    const [impactToken, setImpactToken] = useState(null);
    const [balanceData, setBalanceData] = useState(null);
    const [maxAmmount, setMaxAmmount] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [reason, setReason] = useState('');
    const [itens, setItens] = useState([]);
    const [createdTransaction, setCreatedTransaction] = useState(false);

    useEffect(() => {
        if (impactToken) {
            let credits = Number(input);

            let data = {
                carbon: credits * impactToken.carbon,
                bio: Math.abs(credits * impactToken.bio),
                soil: credits * impactToken.soil,
                water: credits * impactToken.water,
            }

            if (credits > Number(balanceData?.balance)) {
                setMaxAmmount(true);
            } else {
                setMaxAmmount(false);
            }

            setImpactInvestor(data)
        } else {
            let data = {
                carbon: 0,
                bio: 0,
                soil: 0,
                water: 0,
            }

            setImpactInvestor(data)
        }
    }, [input]);

    useEffect(() => {
        getImpact();
        if (walletConnected !== '') getBalance();
    }, []);

    async function getImpact() {
        setLoading(true);
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact);
        if (tokensToContribute > 0) {
            setInput(tokensToContribute);
        }
        setLoading(false);
    }

    async function getBalance() {
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
    }

    async function handleContribute() {
        if (walletConnected === '') {
            toast.error('Você não está conectado!')
            return
        }

        if (input === '') {
            toast.error('Digite um valor para contribuir!')
            return
        }

        if (maxAmmount) {
            toast.error('Saldo insuficiente!')
            return
        }

        if (connectionType === 'provider') {
            contributeBlockchain();
        } else {
            createTransaction();
        }
    }

    async function contributeBlockchain() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        if (userData.userType === 7) {
            BurnRCSupporter(walletConnected, String(input) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(input, res.hashTransaction)
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
            BurnTokens(walletConnected, String(input) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(input, res.hashTransaction)
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
            reason: '',
            itens: itemsCalculator,
            hash
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

            if(itemsCalculator.length > 0){
                await api.post('/calculator/items/contribution', {
                    userId: userData?.id,
                    items: JSON.stringify(itemsCalculator)
                })
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingTransaction(false);
        }
    }

    async function createTransaction() {
        try {
            setLoading(true);
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'burn-tokens',
                additionalData: JSON.stringify({
                    value: Number(input),
                    reason,
                    itens: itemsCalculator ? itemsCalculator : []
                }),
            })
            setInput('');
            setCreatedTransaction(true);
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex flex-col w-full lg:max-w-[1024px] px-2 lg:px-0">
                    <div className="flex flex-col bg-[#0a4303] p-3 rounded-md mt-3 gap-8 lg:flex-row">
                        <div className="flex flex-col w-full lg:w-[300px]">
                            <p className="text-gray-300 text-sm">Veja o impacto da sua contribuição</p>

                            <div className="w-full border-b border-green-600 my-3" />

                            <p className="text-white text-sm mb-1">Com quantos CR deseja contribuir?</p>
                            <input
                                type="number"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="px-2 py-2 bg-green-950 rounded-md font-bold text-white"
                                placeholder="Digite aqui.."
                            />

                            {maxAmmount && (
                                <p className="text-red-500 mt-1 text-sm">Saldo insuficiente!</p>
                            )}

                            {walletConnected === '' ? (
                                <p className="text-white mt-3 text-xs">Você não está conectado</p>
                            ) : (
                                <div className="flex flex-col mt-3">
                                    <p className="text-white text-xs">Seu saldo</p>
                                    <div className="flex items-center gap-2 bg-green-950 p-2 rounded-md">
                                        <img
                                            src={require('../../../assets/token.png')}
                                            className="w-8 h-8 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">{Intl.NumberFormat('pt-BR').format(Number(balanceData?.balance).toFixed(5))}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col w-[300px]">
                            <p className="text-gray-300 text-sm">Com essa contribuição, você vai impactar com:</p>

                            <div className="w-full border-b border-green-600 my-3" />

                            <p className="text-white text-sm mb-1">Carbono: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.carbon).toFixed(2))} kg</span></p>
                            <p className="text-white text-sm mb-1">Solo: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.soil).toFixed(2))} m²</span></p>
                            <p className="text-white text-sm mb-1">Água: <span className="font-bold">{Intl.NumberFormat('pt-BR').format((Number(impactInvestor?.water) * 1000).toFixed(2))} L</span></p>
                            <p className="text-white text-sm mb-1">Biodver.: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.bio).toFixed(2))} uv</span></p>
                        </div>
                    </div>

                    <button
                        className="w-full p-3 bg-blue-500 rounded-md flex justify-between items-center mt-3"
                        onClick={handleContribute}
                    >
                        {loading ? (
                            <>
                                <div />
                                <ActivityIndicator size={25} />
                                <div />
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={require('../../../assets/icon-contribuir.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                    <p className="font-bold text-white">Contribuir</p>
                                </div>

                                <FaChevronRight size={20} color='white' />
                            </>
                        )}
                    </button>

                    <button
                        className="w-full p-3 bg-green-500 rounded-md flex justify-between items-center mt-3"
                        onClick={() => navigate('/impact-calculator')}
                    >
                        <div className="flex items-center gap-3">
                            <FaCalculator color='white' size={30} />
                            <p className="font-bold text-white">Calculadora de impacto</p>
                        </div>

                        <FaChevronRight size={20} color='white' />
                    </button>
                </div>
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        toast.success('Contribuição feita com sucesso!');

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