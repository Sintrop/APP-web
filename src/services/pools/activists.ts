import { ReturnGetNextWithdraw, ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { activistPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra, nextEraIn } from "../web3/activistPoolService";
import { getActivist } from "../web3/activistService";

export async function getActivitsPoolData(): Promise<ReturnGetPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(activistPoolContractAddress);
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

export async function getNextWithdrawActivist(address: string): Promise<ReturnGetNextWithdraw> {
    try {
        const activist = await getActivist(address);
        const nextWithdraw = await nextEraIn(activist.pool.currentEra);

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