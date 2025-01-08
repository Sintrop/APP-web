import { ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { contributorPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra } from "../web3/contributorPoolService";

export async function getContributorsPoolData(): Promise<ReturnGetPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(contributorPoolContractAddress);
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