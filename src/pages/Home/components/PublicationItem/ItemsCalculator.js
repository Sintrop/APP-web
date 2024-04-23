import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

export function ItemsCalculator({ items, close }) {
    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-black/60 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[450px] h-[400px] bg-[#0a4303] rounded-md m-auto inset-0 border-2'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-[25px]"/>

                    <p className="font-semibold text-white">Itens compensados</p>

                    <button onClick={close}>
                        <MdClose size={25} color='white'/>
                    </button>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    {items.map(item => (
                        <div className="flex flex-col rounded-md p-2 bg-green-600" key={item.id}>
                            <div className="flex items-center justify-between">

                            <p>{item.name}</p>

                            <p>{item.quant} {item.unit}</p>
                            </div>

                            <div className="flex flex-col items-center mt-1">
                                <p className="text-gray-200 text-xs">Impacto</p>

                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex flex-col items-center">
                                        <p className="text-white font-bold">2.54 kg</p>
                                        <p className="text-white text-xs">Carbono</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <p className="text-white font-bold">2.54 m²</p>
                                        <p className="text-white text-xs">Solo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}