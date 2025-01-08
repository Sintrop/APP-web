import { BasicDataPoolProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { producerPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra } from "../web3/producerPoolService";

interface ReturnGetProducersPoolDataProps{
    success: boolean;
    poolData?: BasicDataPoolProps;
}
export async function getProducersPoolData(): Promise<ReturnGetProducersPoolDataProps>{
    try{
        const currentEra = await currentContractEra();
        const currentEpoch = await currentContractEpoch();
        const balanceTokens = await getTokensBalance(producerPoolContractAddress);
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