import React from "react";
import { TransactionWeb3Props } from "../../../../../../types/transaction";
import { TransactionWeb3Header } from "./components/TransactionWeb3Header";

interface Props {
    transaction: TransactionWeb3Props;
}
export function TransactionWeb3Item({ transaction }: Props) {
    return (
        <div className="w-[93%] mx-2 lg:mx-0 lg:w-[550px] bg-[#03364B] p-2 rounded-lg flex flex-col gap-3">
            <TransactionWeb3Header
                fromWallet={transaction.from.hash}
                timestamp={transaction.timestamp}
                blockNumber={transaction.block_number}
            />

            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                    <div className="bg-container-secondary rounded-md p-2">
                        <p className="text-white text-sm">{transaction.transaction_types[0]}</p>
                    </div>

                    <div className="bg-container-secondary rounded-md p-2">
                        <p className="text-white text-sm">{transaction.status}</p>
                    </div>

                    <div className="bg-container-secondary rounded-md p-2">
                        <p className="text-white text-sm">{transaction.method}</p>
                    </div>
                </div>

                <div className="bg-container-secondary rounded-md p-2">
                    <p className="text-white text-sm">{transaction.block_number}</p>
                </div>
            </div>

            <a
                href={`${process.env.REACT_APP_URL_EXPLORER}/tx/${transaction.hash}`}
                target="_blank"
                className="truncate text-blue-primary underline"
            >
                {transaction.hash}
            </a>
        </div>
    )
}