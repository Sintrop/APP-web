import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { Item } from "./components/Item";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router-dom';
import { TopBar } from "../../components/TopBar";
import { Info } from "../../components/Info";

export function ImpactCalculator() {
    const navigate = useNavigate();
    const { setItemsCalculator, setTokensToContribute } = useMainContext();
    const [items, setItems] = useState([]);
    const [myList, setMyList] = useState([]);
    const [impact, setImpact] = useState({});
    const [impactToken, setImpactToken] = useState({});

    const razaoTokenCompensar = ((impact?.carbon * 1000) / (Number(impactToken.carbon) * 1000).toFixed(1)).toFixed(0) * -1

    useEffect(() => {
        getItems();
        getImpactToken();
    }, []);

    async function getImpactToken() {
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact)
    }

    async function getItems() {
        const response = await api.get('/calculator/items');
        setItems(response.data.items);
    }

    function addItemToList(item) {
        setMyList([...myList, item]);
        calculateImpact([...myList, item]);
        toast.success('Item adicionado a sua lista!');
    }

    function calculateImpact(array) {
        let carbon = 0;
        let soil = 0;
        let water = 0;
        let bio = 0;

        for (var i = 0; i < array.length; i++) {
            carbon += array[i].quant * array[i].carbon;
            soil += array[i].quant * array[i].soil;
            water += array[i].quant * array[i].water;
            bio += array[i].quant * array[i].bio;
        }

        setImpact({ carbon, soil, water, bio })
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 px-2 lg:px-0">
                    <p className="font-bold text-white">Calculadora de impacto</p>

                    <Info
                        text1='Reduzir é obrigação. Regenerar é a solução.'
                        text2='Precisamos deixar de produzir e consumir produtos que destroem o planeta.'
                        text3='Na calculadora, compense os itens que você consumiu/produziu para financiar o impacto equivalente através do Crédito de Regeneração. Caminhe na direção de deixar de usá-los.'
                    />

                    <div className="flex flex-col w-full p-2 rounded-t-md bg-[#0a4303] mt-3 overflow-x-auto">
                        <p className="text-white font-semibold">Itens da sua lista</p>

                        <div className="flex w-fit lg:w-full justify-between h-8 bg-blue-700 rounded-t-md py-1 px-3">
                            <div className="flex items-center justify-start w-[150px] lg:w-[40%]">
                                <p className="text-sm font-semibold text-white">Item</p>
                            </div>

                            <div className="flex">
                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Quant.</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Carbono</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Solo</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Água</p>
                                </div>

                                <div className="flex items-center justify-center w-20">
                                    <p className="text-sm font-semibold text-white">Biod.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col min-h-28 border-b border-green-700 pb-3">
                            {myList.map(item => (
                                <div className="flex w-fit lg:w-full justify-between h-8 py-1 px-3" key={item.id}>
                                    <div className="flex items-center justify-start w-[150px] lg:w-[40%]">
                                        <p className="text-sm font-semibold text-white">{item?.name}</p>
                                    </div>

                                    <div className="flex">
                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">{item?.quant}</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">{Number(item?.quant) * Number(item?.carbon)} kg</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.soil)} m²</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.water)} m³</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.bio)} uv</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {myList.length === 0 && (
                                <div className="flex justify-center items-center h-20">
                                    <p className="text-white">Nenhum item na lista</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col w-full p-2 rounded-b-md bg-[#0a4303]">
                        <div className="flex flex-col gap-3 mt-2 lg:flex-row">
                            <div className="flex flex-col p-2 rounded-md border w-full lg:w-fit">
                                <p className="text-white font-semibold">Cálculo do seu impacto</p>

                                <div className="flex">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white">Carbono: <span className="font-bold">
                                            {myList.length === 0 ? '0 kg' : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.carbon)} kg`}
                                            </span>
                                        </p>
                                        <p className="text-white">Solo: <span className="font-bold">
                                            {myList.length === 0 ? '0 m2' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.soil)} m²`}
                                            </span>
                                        </p>
                                        <p className="text-white">Água: <span className="font-bold">
                                            {myList.length === 0 ? '0 m³' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.water)} m³`}
                                            </span>
                                        </p>
                                        <p className="text-white">Biodiversidade: <span className="font-bold">
                                            {myList.length === 0 ? '0 uv' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.bio)} uv`}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-2 rounded-md border w-full lg:w-fit">
                                <p className="text-white font-semibold">Compense seu impacto</p>

                                <p className="text-white mt-3">Você deve contribuir com</p>
                                <div className="flex items-center p-2 rounded-md bg-green-950 gap-3">
                                    <img
                                        src={require('../../assets/token.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                    <p className="text-white font-semibold">
                                        {myList.length === 0 ? '0 RC' : `${Intl.NumberFormat('pt-BR').format(razaoTokenCompensar)} RC`}
                                    </p>
                                </div>

                                <button
                                    className="text-white font-semibold py-1 mt-2 bg-blue-500 rounded-md"
                                    onClick={() => {
                                        setTokensToContribute(razaoTokenCompensar)
                                        setItemsCalculator(myList);
                                        navigate('/contribute');
                                    }}
                                >
                                    Contribuir
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="font-semibold text-white mt-3">Adicione itens a sua lista</p>
                    <div className="flex flex-col gap-3">
                        {items.map(item => (
                            <Item
                                key={item?.id}
                                data={item}
                                addItem={(itemAdded) => addItemToList(itemAdded)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}