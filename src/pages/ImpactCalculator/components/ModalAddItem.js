import React, {useEffect, useState} from "react";
import { FaChevronLeft } from "react-icons/fa";

export function ModalAddItem({close, data, addItem}){
    const [input, setInput] = useState('');

    function handleAdd(){
        if(!input.trim()){
            return;
        }

        addItem({
            ...data,
            quant: Number(String(input).replace(',','.'))
        });
        setInput('');
        close();
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close}/>
            <div className='absolute flex flex-col p-3 lg:w-[300px] lg:h-[250px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-50'>
                <div className="flex items-center gap-2">
                    <button
                        onClick={close}
                    >
                        <FaChevronLeft size={17} color='white'/>
                    </button>
                    <p className="font-semibold text-white">Adicionar {data?.name}</p>
                </div>

                <div className="flex flex-col mt-5">
                    <p className="text-white text-center">Quanto você utilizou desse item?</p>
                    <label className="text-blue-500 font-semibold mt-3">Quantidade em ({data?.unit}):</label>
                    <input
                        className="w-full px-2 py-3 rounded-md bg-green-950 text-white"
                        placeholder="Digite aqui"
                        type='number'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button
                        onClick={handleAdd}
                        className="font-semibold text-white py-2 bg-blue-500 rounded-md mt-5"
                    >
                        Adicionar item
                    </button>
                </div>
            </div>
        </div>
    )
}