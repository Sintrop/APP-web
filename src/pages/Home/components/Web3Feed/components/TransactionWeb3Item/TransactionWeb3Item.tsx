import React from "react";
import { TransactionWeb3Props } from "../../../../../../types/transaction";
import { TransactionWeb3Header } from "./components/TransactionWeb3Header";
import { TransactionStatusTag } from "./components/Tags/TransactionStatusTag";
import { TransactionMethodTag } from "./components/Tags/TransactionMethodTag";
import { GrTransaction } from "react-icons/gr";
import { TransactionErrorDetails } from "./components/TransactionErrorDetails";
import { TransactionSuccessDetails } from "./components/TransactionSuccessDetails";

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
                    <TransactionStatusTag status={transaction.status} />

                    <TransactionMethodTag method={transaction.method} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <GrTransaction size={20} color='white' />
                <a
                    href={`${process.env.REACT_APP_URL_EXPLORER}/tx/${transaction.hash}`}
                    target="_blank"
                    className="truncate text-blue-primary underline max-w-[95%]"
                    rel='noreferrer'
                >
                    {transaction.hash}
                </a>
            </div>

            <div className="flex flex-col mt-1">
                <p className="text-xs text-gray-300">Detalhes da transação</p>
                {transaction.status === 'error' && (
                    <TransactionErrorDetails
                        revert_reason={transaction.revert_reason}
                    />
                )}

                {transaction.status === 'ok' && (
                    <TransactionSuccessDetails
                        method={transaction.method}
                        parameters={transaction?.decoded_input?.parameters}
                    />
                )}
            </div>
        </div>
    )
}