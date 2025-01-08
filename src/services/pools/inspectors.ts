import { ReturnGetNextWithdraw, ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { inspectorPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra, nextEraIn } from "../web3/inspectorPoolService";
import { getInspector } from "../web3/inspectorService";

export async function getInspectorsPoolData(): Promise<ReturnGetPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(inspectorPoolContractAddress);
        const tokensEra = await tokensPerEra(currentEpoch, 12);

        return {
            success: true,
            poolData: {
                balanceContract: balanceTokens,
                currentEra,
                epoch: currentEpoch,
                tokensPerEra: tokensEra
            }
        }
    }catch(e){
        return{
            success: false
        }
    }
}

export async function getNextWithdrawInspector(address: string): Promise<ReturnGetNextWithdraw> {
    try {
        const inspector = await getInspector(address);
        const nextWithdraw = await nextEraIn(inspector.pool.currentEra);

        return {
            success: true,
            nextWithdraw
        }
    } catch (e) {
        return {
            success: false,
            nextWithdraw: 0
        }
    }
}