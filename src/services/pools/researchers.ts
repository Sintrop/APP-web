import { BasicDataPoolProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { researcherPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra } from "../web3/researcherPoolService";

interface ReturnGetResearchersPoolDataProps{
    success: boolean;
    poolData?: BasicDataPoolProps;
}
export async function getResearchersPoolData(): Promise<ReturnGetResearchersPoolDataProps>{
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