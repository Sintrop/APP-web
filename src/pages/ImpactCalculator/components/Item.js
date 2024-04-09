import React, {useEffect, useState} from "react";
import { ModalAddItem } from "./ModalAddItem";

export function Item({data, addItem}){
    const [modalAddItem, setModalAddItem] = useState(false);

    return(
        <div className="flex w-full items-center justify-between p-2 rounded-md bg-[#0a4303]">
            <div className="flex flex-col">
                <p className="font-bold text-white">{data?.name} <span className="text-sm text-green-600">(Utilizado {data?.utilization}x)</span></p>

                <div className="flex items-center gap-1 mt-3 border rounded-md p-1 w-fit">
                    <div className="flex flex-col items-center w-20">
                        <p className="font-semibold text-white">{data?.carbon} kg</p>
                        <p className="text-sm text-white">Carbono</p>
                    </div>
                    <div className="flex flex-col items-center w-20">
                        <p className="font-semibold text-white">{data?.soil} m²</p>
                        <p className="text-sm text-white">Solo</p>
                    </div>
                    <div className="flex flex-col items-center w-20">
                        <p className="font-semibold text-white">{data?.water} m³</p>
                        <p className="text-sm text-white">Água</p>
                    </div>
                    <div className="flex flex-col items-center w-20">
                        <p className="font-semibold text-white">{data?.bio} uv</p>
                        <p className="text-sm text-white">Biodvers.</p>
                    </div>
                </div>

                {data?.source && (
                    <p className="text-white text-xs">Fonte: <a target="_blank" href={data?.source} className="text-blue-400 underline">{data?.source}</a></p>
                )}
            </div>

            <button
                className="px-3 py-2 rounded-md text-white font-semibold bg-blue-600"
                onClick={() => setModalAddItem(true)}
            >
                Adicionar item
            </button>

            {modalAddItem && (
                <ModalAddItem
                    data={data}
                    close={() => setModalAddItem(false)}
                    addItem={(itemAdded) => addItem(itemAdded)}
                />
            )}
        </div>
    )
}