import { BasicDataPoolProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { inspectorPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra } from "../web3/inspectorPoolService";

interface ReturnGetInspectorsPoolDataProps{
    success: boolean;
    poolData?: BasicDataPoolProps;
}
export async function getInspectorsPoolData(): Promise<ReturnGetInspectorsPoolDataProps>{
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