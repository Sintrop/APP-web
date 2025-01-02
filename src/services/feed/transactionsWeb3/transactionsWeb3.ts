import axios from "axios";
import { TransactionWeb3Props } from "../../../types/transaction";

const ITEMS_PER_PAGE = 20;
const addressesContracts = [
    '0x2108eB3EcfB90a1C7267B1f4651bfa5f2C0dad43',
    '0x1B79F01bb7Df539c4378a941d7f829D8C9074FCE',
    '0x5a723c92CFA303d2839CE3f63a288F0FECd0cea6',
    '0x678bb159Ea410aC5C09089FdAbe439a5a1221ad5',
    '0x9371d98d0890e0cD2b8B6270347d0AA0cdb4f98E',
    '0xF9c44772a5cC1c64A2De36b0Aee040b266CFA845'
]

interface ReturnGetListTransactionsWeb3FeedProps{
    success: boolean;
    txs: TransactionWeb3Props[];
    totalPages: number;
    page1Txs: TransactionWeb3Props[];
}
export async function getListTransactionsWeb3Feed(): Promise<ReturnGetListTransactionsWeb3FeedProps> {
    let allTxs: TransactionWeb3Props[] = [];

    for(var i = 0; i < addressesContracts.length; i++){
        const responseTxs = await getAddressTxs(addressesContracts[i]);
        if(responseTxs.success){
            allTxs = allTxs.concat(responseTxs.txs);
        }
    }

    const orderTxs = allTxs.sort((a, b) => b.block_number - a.block_number);
    
    const totalPages = Math.ceil(orderTxs.length / ITEMS_PER_PAGE);
    const page1Txs = paginateListTransactionsWeb3(orderTxs, ITEMS_PER_PAGE, 1);

    return {
        success: true,
        totalPages,
        txs: orderTxs,
        page1Txs
    }
}

export function paginateListTransactionsWeb3(
    list: TransactionWeb3Props[], 
    itemsPerPage: number, 
    atualPage: number
): TransactionWeb3Props[]{
    const totalPages = Math.ceil(list.length / itemsPerPage);
    if (atualPage < 1) atualPage = 1;
    if (atualPage > totalPages) atualPage = totalPages;

    const initialIndice = (atualPage - 1) * itemsPerPage;
    const finalIndice = initialIndice + itemsPerPage;

    return list.slice(initialIndice, finalIndice);
}

interface ReturnGetAddressTxsProps {
    success: boolean;
    txs: TransactionWeb3Props[];
}
async function getAddressTxs(address: string): Promise<ReturnGetAddressTxsProps> {
    try {
        const response = await axios.get(`${process.env.REACT_APP_CHAIN_API}/api/v2/addresses/${address}/transactions`);
        return {
            success: true,
            txs: response.data.items
        }
    }catch(e){
        console.log(e);
        return {
            success: false,
            txs: [],
        }
    }
}