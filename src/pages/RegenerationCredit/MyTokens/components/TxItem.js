import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { FaEyeSlash, FaRegEye, FaChevronRight, FaArrowUp, FaArrowDown } from "react-icons/fa";

export function TxItem({ data }) {
    const {userData} = useMainContext();
    const [revenue, setRevenue] = useState(false);

    useEffect(() => {
        if(String(userData?.wallet).toUpperCase() === String(data?.from).toUpperCase()){
            setRevenue(false);
        }else{
            setRevenue(true);
        }
    }, []);

    return (
        <div className="flex justify-between gap-2 p-2 rounded-md bg-[#0a4303] w-full mb-2">
            <div className="flex gap-2">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
                    {revenue ? (
                        <FaArrowUp color='green' size={20}/>
                    ) : (
                        <FaArrowDown color='red' size={20}/>
                    )}
                </div>
                
                <div className="flex flex-col">
                    <p className="text-sm text-gray-300">{revenue ? 'Você recebeu de' : 'Você enviou para'}</p>
                    <p className="text-white">{revenue ? data?.from : data?.to}</p>
                    <p className="text-xs text-white">Hash: <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data?.hash}`} className="text-blue-400 underline">{data.hash}</a></p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <p className="font-bold text-green-500">
                    {Intl.NumberFormat('pt-BR').format((Number(data?.value) / 10 ** 18).toFixed(5))}
                </p>

                <img
                    src={require('../../../../assets/token.png')}
                    className="w-5 h-5 object-contain"
                />
            </div>
        </div>
    )
}