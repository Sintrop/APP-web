import { web3 } from "../web3/Contracts";
import { balanceOf } from "../web3/rcTokenService";

export async function getTokensBalance(addressToken: string): Promise<number>{
    const response = await balanceOf(addressToken);
    return Number(web3.utils.fromWei(response));
}