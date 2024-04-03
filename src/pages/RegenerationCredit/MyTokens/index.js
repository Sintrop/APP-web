import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaEyeSlash, FaRegEye, FaChevronRight } from "react-icons/fa";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";

export function MyTokens() {
    const {walletConnected} = useMainContext();
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [balanceData, setBalanceData] = useState(254256.451);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (walletConnected !== '') getBalanceData();
    }, []);

    async function getBalanceData() {
        setLoading(true);
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                {loading && (
                    <ActivityIndicator size={60}/>
                )}

                {walletConnected === '' ? (
                    <div>
                        <h3 className="text-center mt-3 text-white">Você não está conectado!</h3>
                    </div>
                ) : (
                    <div className="flex gap-1 flex-col max-w-[1024px] mt-3 items-start">
                        <div className="flex flex-col bg-card bg-no-repeat bg-cover w-[365px] h-[200px] rounded-md p-3">
                            <p className="text-xs text-gray-300">Meu patrimônio em</p>

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
                    </div>
                )}
            </div>
        </div>
    )
}