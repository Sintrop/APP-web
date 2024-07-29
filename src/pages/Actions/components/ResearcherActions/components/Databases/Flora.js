import React, { useEffect, useState } from "react";
import { floraItems } from "../../../../../../data/flora";
import { IoMdSearch } from "react-icons/io";

export function Flora() {
    const [items, setItems] = useState([]);
    const [filterItems, setFilterItems] = useState([]);

    useEffect(() => {
        setItems(floraItems);
    }, [])

    return (
        <div className="flex flex-col">
            <div className="bg-[#0a4303] rounded-md w-full flex items-center gap-2 h-10 px-3 mb-3">
                <IoMdSearch size={20} color='white' />

                <input
                    className="w-full text-white bg-transparent"
                    placeholder="Pesquisar"
                    onChange={(e) => {
                        const text = e.target.value;
                        if (text === '') {
                            setFilterItems([]);
                            return;
                        }
                        const filter = items.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
                        setFilterItems(filter);
                    }}
                />
            </div>

            <div className="w-full flex items-center justify-between h-8 bg-green-700 rounded-t-md">
                <div className="w-[50%] px-3">
                    <p className="font-bold text-white">Nome</p>
                </div>

                <div className="flex">
                    <div className="w-[180px] px-3 flex justify-center">
                        <p className="font-bold text-white">Nome científico</p>
                    </div>

                    <div className="w-[150px] px-3 flex justify-center border-l border-green-900/50">
                        <p className="font-bold text-white">Família</p>
                    </div>
                </div>
            </div>

            {filterItems.length === 0 ? (
                <>
                    {items.map(item => (
                        <Item data={item} key={item.id} />
                    ))}
                </>
            ) : (
                <>
                    {filterItems.map(item => (
                        <Item data={item} key={item.id} />
                    ))}
                </>
            )}
        </div>
    )
}

function Item({ data }) {
    return (
        <div className="w-full flex items-center justify-between py-2 border-b border-green-800/50">
            <div className="w-[50%] px-3">
                <p className=" text-white">{data?.name}</p>
            </div>

            <div className="flex">
                <div className="w-[180px] px-3 flex justify-center">
                    <p className=" text-white text-center">{data?.scientific}</p>
                </div>

                <div className="w-[150px] px-3 flex justify-center border-l border-green-900/50">
                    <p className=" text-white text-center">{data?.family}</p>
                </div>
            </div>
        </div>
    )
}