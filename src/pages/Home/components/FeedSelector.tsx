import React from "react";
import { SiHiveBlockchain } from "react-icons/si";
import { IoEarth } from "react-icons/io5";

interface Props {
    selectedFeed: string;
    onChange: (feedType: string) => void;
}
export function FeedSelector({ onChange, selectedFeed }: Props) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => onChange('web3')}
                className={`flex items-center gap-2 text-sm px-3 py-1 border-b-2 ${selectedFeed === 'web3' ? 'border-green-primary text-green-primary' : 'text-white border-transparent'}`}
            >
                <SiHiveBlockchain size={15} color={selectedFeed === 'web3' ? '#75d63a' : 'white'}/>
                Transações Web3
            </button>

            <button
                onClick={() => onChange('social')}
                className={`flex items-center gap-2 text-sm px-3 py-1 border-b-2 ${selectedFeed === 'social' ? 'border-green-primary text-green-primary' : 'text-white border-transparent'}`}
            >
                <IoEarth size={15} color={selectedFeed === 'social' ? '#75d63a' : 'white'}/>
                Feed Social
            </button>
        </div>
    )
}