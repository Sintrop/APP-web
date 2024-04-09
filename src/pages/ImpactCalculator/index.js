import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { Item } from "./components/Item";
import { ToastContainer, toast } from "react-toastify";

export function ImpactCalculator() {
    const [items, setItems] = useState([]);
    const [myList, setMyList] = useState([]);

    useEffect(() => {
        getItems();
    }, []);

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
        console.log(array)
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    <p className="font-bold text-white">Calculadora de impacto</p>

                    <div className="flex flex-col w-full p-2 rounded-md bg-[#0a4303] mt-3">
                        <p className="text-white font-semibold">Itens da sua lista</p>

                        {myList.length === 0 ? (
                            <div className="flex items-center justify-center w-full h-28">
                                <p className="text-white">Você não tem nenhum item na sua lista!</p>
                            </div>
                        ) : (
                            <>  
                                <div className="flex w-full justify-between h-8 bg-blue-700 rounded-t-md py-1 px-3">
                                    <div className="flex items-center justify-start w-[40%]">
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
                                        <div className="flex w-full justify-between h-8 py-1 px-3" key={item.id}>
                                            <div className="flex items-center justify-start w-[40%]">
                                                <p className="text-sm font-semibold text-white">{item?.name}</p>
                                            </div>
        
                                            <div className="flex">
                                                <div className="flex items-center justify-center w-20 border-r">
                                                    <p className="text-sm font-semibold text-white">{item?.quant}</p>
                                                </div>
        
                                                <div className="flex items-center justify-center w-20 border-r">
                                                    <p className="text-sm font-semibold text-white"></p>
                                                </div>
        
                                                <div className="flex items-center justify-center w-20 border-r">
                                                    <p className="text-sm font-semibold text-white"></p>
                                                </div>
        
                                                <div className="flex items-center justify-center w-20 border-r">
                                                    <p className="text-sm font-semibold text-white"></p>
                                                </div>
        
                                                <div className="flex items-center justify-center w-20">
                                                    <p className="text-sm font-semibold text-white"></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-white font-semibold">Cálculo do seu impacto</p>

                                <div className="flex">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white">Carbono: <span className="font-bold">0,00 kg</span></p>
                                        <p className="text-white">Solo: <span className="font-bold">0,00 m²</span></p>
                                        <p className="text-white">Água: <span className="font-bold">0,00 m³</span></p>
                                        <p className="text-white">Biodiversidade: <span className="font-bold">0,00 uv</span></p>
                                    </div>
                                </div>
                            </>
                        )}

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