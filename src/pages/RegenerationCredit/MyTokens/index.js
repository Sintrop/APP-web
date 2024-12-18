import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header/header";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator/ActivityIndicator";
import { api } from "../../../services/api";
import axios from 'axios'
import { TxItem } from "./components/TxItem";
import { TopBar } from "../../../components/TopBar";
import { useTranslation } from "react-i18next";

export function MyTokens() {
    const {t} = useTranslation();
    const {walletConnected} = useMainContext();
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [balanceData, setBalanceData] = useState(254256.451);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState();

    useEffect(() => {
        if (walletConnected !== ''){
            getBalanceData();
            getTransactions();
        }
    }, []);

    async function getBalanceData() {
        setLoading(true);
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
        setLoading(false);
    }

    async function getTransactions() {
        setLoadingTransactions(true);
        const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=0xA8fDAbF07136c3c1A5C9572A730a2425c5a8500C&address=${String(walletConnected).toLowerCase()}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)
        const txlist = response.data.result;
        setTransactions(txlist.reverse());
        setLoadingTransactions(false);
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center h-[100vh]">
                        <ActivityIndicator size={180}/>
                    </div>
                ) : (
                    <>
                    {walletConnected === '' ? (
                        <div>
                            <h3 className="text-center mt-3 text-white">{t('voceNaoConectado')}</h3>
                        </div>
                    ) : (
                        <div className="flex gap-1 flex-col lg:w-[800px] w-full mt-3 items-start px-2 lg:px-0">
                            <div className="flex flex-col bg-card bg-no-repeat bg-cover w-full lg:w-[365px] h-[200px] rounded-md p-3">
                                <p className="text-xs text-gray-300">{t('meuPatrimonioEm')}</p>

                                <div className="flex items-center gap-2 mt-5">
                                    <img
                                        src={require('../../../assets/token.png')}
                                        className="w-10 h-10 object-contain"
                                    />

                                    <h3 className="font-bold text-white text-xl">RC</h3>
                                </div>

                                <div className="flex items-center gap-5 mt-3">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-white text-lg">{balanceVisible ? Intl.NumberFormat('pt-BR').format(Number(balanceData?.balance).toFixed(5)) : '*********'}</p>
                                        <p className="text-gray-300">{balanceVisible ? Intl.NumberFormat('pt-BR').format(Number(balanceData?.balance_reais).toFixed(2)) : '*********'}</p>
                                    </div>

                                    <button
                                        onClick={() => setBalanceVisible(!balanceVisible)}
                                    >
                                        {balanceVisible ? (
                                            <FaRegEye color='white' size={25} />
                                        ) : (
                                            <FaEyeSlash color='white' size={25} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-400 mt-3 text-sm">{t('suasMovimentacoes')}</p>
                            {loadingTransactions && (
                                <div className="flex justify-center w-full">
                                    <ActivityIndicator size={60}/>
                                </div>
                            )}
                            {transactions.length === 0 && (
                                <p className="text-center text-sm mt-5 text-white">{t('naoPossuiMovimentacoes')}</p>
                            )}
                            {transactions.map(item => (
                                <TxItem data={item} key={item.hash}/>
                            ))}
                        </div>
                    )}
                    </>
                )}

            </div>
        </div>
    )
}