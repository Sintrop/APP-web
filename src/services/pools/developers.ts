import { ReturnGetNextWithdraw, ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { developersPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra, nextEraIn } from "../web3/developersPoolService";
import { getDeveloper } from "../web3/developersService";

export async function getDevelopersPoolData(): Promise<ReturnGetPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(developersPoolContractAddress);
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


export async function getNextWithdrawDeveloper(address: string): Promise<ReturnGetNextWithdraw> {
    try {
        const developer = await getDeveloper(address);
        const nextWithdraw = await nextEraIn(developer.pool.currentEra);

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