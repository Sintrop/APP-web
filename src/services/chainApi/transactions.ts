import axios from "axios";
import { TransactionWeb3Props } from "../../types/transaction";

interface ReturnGetTxData{
    success: boolean;
    txData?: TransactionWeb3Props;
}
export async function getTxData(hash: string): Promise<ReturnGetTxData>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_CHAIN_API}/api/v2/transactions/${hash}`);
        
        return {
            success: true,
            txData: response.data
        }
    }catch(e){
        return {
            success: false,
        }
    }
}