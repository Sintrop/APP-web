import React from "react";
import { Jazzicon } from '@ukstv/jazzicon-react';
import { format } from "date-fns";
import { BiCubeAlt } from "react-icons/bi";

interface Props {
    fromWallet: string;
    timestamp: string;
    blockNumber: number;
}
export function TransactionWeb3Header({ fromWallet, timestamp, blockNumber }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-container-secondary">
                    <Jazzicon address={fromWallet} />
                </div>
                <div className="flex flex-col">
                    <p className="text-white text-sm">{fromWallet}</p>

                    <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-300">{format(new Date(timestamp), 'dd/MM/yyyy - kk:mm')}</p>

                        <a 
                            className="text-xs text-white underline flex items-center gap-1"
                            href={`${process.env.REACT_APP_URL_EXPLORER}/block/${blockNumber}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <BiCubeAlt size={15} color='white'/>
                            {blockNumber}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}