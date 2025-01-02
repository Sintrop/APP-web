import React, { useEffect, useState } from "react";
import { getListTransactionsWeb3Feed, paginateListTransactionsWeb3 } from "../../../../services/feed/transactionsWeb3/transactionsWeb3";
import { TransactionWeb3Props } from "../../../../types/transaction";
import { TransactionWeb3Item } from "./components/TransactionWeb3Item/TransactionWeb3Item";
import { PageSelect } from "./components/PageSelect";

export function Web3Feed(){
    const [loading, setLoading] = useState(true);
    const [atualPage, setAtualPage] = useState(1);
    const [listTxs, setListTxs] = useState<TransactionWeb3Props[]>([]);
    const [listAtualPage, setListAtualPage] = useState<TransactionWeb3Props[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getTxs();
    }, []);

    useEffect(() => {
        pageChanged();
    }, [atualPage]);

    async function getTxs(){
        setLoading(true);
        const response = await getListTransactionsWeb3Feed();
        if(response.success){
            setListTxs(response.txs);
            setListAtualPage(response.page1Txs);
            setTotalPages(response.totalPages);
        }
        setLoading(false);
    }

    function pageChanged(){
        if(listTxs.length === 0) return;

        const response = paginateListTransactionsWeb3(listTxs, 20, atualPage);
        setListAtualPage(response);
    }

    return(
        <div className="w-[93%] mx-2 lg:mx-0 lg:w-[550px] flex flex-col gap-3">

            {loading ? (
                <>
                </>
            ) : (
                <>
                    <PageSelect
                        atualPage={atualPage}
                        totalPages={totalPages}
                        onChange={setAtualPage}
                    />
                    {listAtualPage.map(item => (
                        <TransactionWeb3Item
                            key={item.hash}
                            transaction={item}
                        />
                    ))}
                </>
            )}
        </div>
    )
}