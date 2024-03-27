import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaChevronRight } from "react-icons/fa";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { useNavigate } from "react-router";

export function Market() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                {loading && (
                    <ActivityIndicator size={60}/>
                )}
                <div className="flex gap-1 flex-col max-w-[1024px] mt-3 items-start">
                    <p className="font-bold text-white text-lg mt-3">Comprar</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col gap-1 w-[400px]">
                            <h3 className="font-bold text-green-600 text-lg">ICO - Initial Coin Offer</h3>
                            <h4 className="font-bold text-white">1 RC = 0,0000125 ETH</h4>

                            <button
                                className="font-bold text-white px-2 py-1 rounded-md bg-blue-600 mt-2"
                                onClick={() => navigate('/ico')}
                            >
                                Comprar
                            </button>
                        </div>

                        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col gap-1 w-[400px] border-green-600 border">
                            <h3 className="font-bold text-green-600 text-lg">Pré venda de tokens reais</h3>
                            <h4 className="font-bold text-white">1 RC = R$ 0,0282</h4>

                            <button
                                className="font-bold text-white px-2 py-1 rounded-md bg-blue-600 mt-2"
                                onClick={() => navigate('/pre-sale')}
                            >
                                Comprar
                            </button>
                        </div>
                    </div>

                    <p className="font-bold text-white text-lg mt-3">Vender</p>
                    <a 
                        className="flex items-center justify-between gap-2 px-2 py-3 bg-white rounded-md w-full"
                        href="https://app.uniswap.org/"
                        target="_blank"
                    >
                        <img
                            src={require('../../../assets/uniswap.png')}
                            className="w-26 h-8 "
                        />

                        <FaChevronRight size={20} color='black' />
                    </a>

                    <a 
                        className="flex items-center justify-between gap-2 px-2 py-3 bg-white rounded-md w-full mt-3"
                        href="https://conta.mercadobitcoin.com.br/cadastro?mgm_token=0d304a9086d7032fe736027f74013a2ab815933c7df44cc08f8b7aa3a81d4d05&utm_campaign=mgm&utm_source=web&utm_medium=link-copy"
                        target="_blank"
                    >
                        <img
                            src={require('../../../assets/mercado-bitcoin.png')}
                            className="w-26 h-8 "
                        />

                        <FaChevronRight size={20} color='black' />
                    </a>
                </div>
            </div>
        </div>
    )
}