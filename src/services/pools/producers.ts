import { ReturnGetNextWithdraw, ReturnGetPoolDataProps } from "../../types/pools";
import { getTokensBalance } from "../token/balance";
import { producerPoolContractAddress } from "../web3/Contracts";
import { currentContractEra, currentContractEpoch, tokensPerEra, nextEraIn } from "../web3/producerPoolService";
import { GetProducer } from "../web3/producerService";

export async function getProducersPoolData(): Promise<ReturnGetPoolDataProps> {
    try {
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
    } catch (e) {
        return {
            success: false
        }
    }
}

export async function getNextWithdrawProducer(address: string): Promise<ReturnGetNextWithdraw> {
    try {
        const producer = await GetProducer(address);
        const nextWithdraw = await nextEraIn(producer.pool.currentEra);

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