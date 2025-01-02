import React from "react";

interface Props{
    fromWallet: string;
}
export function TransactionWeb3Header({fromWallet}: Props){
    return(
        <div className="flex items-center justify-between">
            <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-container-secondary"/>
                <div className="flex flex-col">
                    <p className="text-white text-sm">{fromWallet}</p>
                </div>
            </div>
        </div>
    )
}