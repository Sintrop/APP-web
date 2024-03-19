import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { useMainContext } from "../../hooks/useMainContext";
import { FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

export function Contribute() {
    const { walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [impactInvestor, setImpactInvestor] = useState({});
    const [input, setInput] = useState('');
    const [impactToken, setImpactToken] = useState(null);
    const [balanceData, setBalanceData] = useState(null);
    const [maxAmmount, setMaxAmmount] = useState(false);

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
        setImpactToken(response.data.impact)
        setLoading(false);
    }

    async function getBalance() {
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
    }

    async function handleContribute() {
        if(walletConnected === ''){
            toast.error('Você não está conectado!')
            return
        }

        if(!input.trim()){
            toast.error('Digite um valor para contribuir!')
            return
        }

        if(maxAmmount){
            toast.error('Saldo insuficiente!')
            return
        }

        alert('Contribuição disponível em breve!')
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20">
                <div className="flex flex-col max-w-[1024px]">
                    <div className="flex bg-[#0a4303] p-3 rounded-md mt-3 gap-8">
                        <div className="flex flex-col w-[300px]">
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
                                            src={require('../../assets/token.png')}
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
                        <div className="flex items-center gap-3">
                            <img
                                src={require('../../assets/icon-contribuir.png')}
                                className="w-8 h-8 object-contain"
                            />
                            <p className="font-bold text-white">Contribuir</p>
                        </div>

                        <FaChevronRight size={20} color='white'/>
                    </button>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}