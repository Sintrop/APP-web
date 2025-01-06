import axios from "axios";
import { TransactionWeb3Props } from "../../../types/transaction";
import { 
    activistContractAddress, 
    activistPoolContractAddress, 
    contributorContractAddress, 
    contributorPoolContractAddress, 
    developerContractAddress, 
    developersPoolContractAddress, 
    inspectorContractAddress, 
    inspectorPoolContractAddress, 
    producerContractAddress, 
    producerPoolContractAddress, 
    RcTokenContractAddress, 
    researcherContractAddress, 
    researcherPoolContractAddress, 
    sintropContractAddress, 
    supporterContractAddress, 
    supporterPoolAddress, 
    validatorContractAddress,
    validatorPoolContractAddress,
    invitationContractAddress
} from "../../web3/Contracts";

const ITEMS_PER_PAGE = 10;
const addressesContracts = [
    producerContractAddress,
    producerPoolContractAddress,
    inspectorContractAddress,
    inspectorPoolContractAddress,
    researcherContractAddress,
    researcherPoolContractAddress,
    developerContractAddress,
    developersPoolContractAddress,
    contributorContractAddress,
    contributorPoolContractAddress,
    activistContractAddress,
    activistPoolContractAddress,
    supporterContractAddress,
    supporterPoolAddress,
    validatorContractAddress,
    validatorPoolContractAddress,
    sintropContractAddress,
    RcTokenContractAddress,
    invitationContractAddress,
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