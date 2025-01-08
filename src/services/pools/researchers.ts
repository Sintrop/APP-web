import { ReturnGetNextWithdraw, ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { researcherPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra, nextEraIn } from "../web3/researcherPoolService";
import { getResearcher } from "../web3/researchersService";

export async function getResearchersPoolData(): Promise<ReturnGetPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(researcherPoolContractAddress);
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

export async function getNextWithdrawResearcher(address: string): Promise<ReturnGetNextWithdraw> {
    try {
        const researcher = await getResearcher(address);
        const nextWithdraw = await nextEraIn(researcher.pool.currentEra);

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