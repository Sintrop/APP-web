import { RcTokenContract } from "./Contracts";
import { RcTokenContractAddress } from "./Contracts";
import { web3 } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export interface ReturnTransactionProps {
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

export const GetCertificateTokens = async (wallet: string) => {
    let tokens = 0
    await RcTokenContract.methods.certificate(wallet).call({from: RcTokenContractAddress})
    //@ts-ignore
    .then((res) => {
        tokens = res
    })
    .catch(() => {
        tokens = 0
    })
    return tokens
}

export const GetTokensBalance = async (wallet: string) => {
    let tokens = 0
    await RcTokenContract.methods.balanceOf(wallet).call({from: RcTokenContractAddress})
    //@ts-ignore
    .then((res) => {
        tokens = res
    })
    .catch(() => {
        tokens = 0
    })
    return tokens
}

export async function BurnTokens(value: number, wallet: string): Promise<ReturnTransactionProps> {
    const valueWei = web3.utils.toWei(String(value), 'ether');
    const response = await web3RequestWrite(RcTokenContract, 'burnTokens', [valueWei], wallet);
    return response;
}

//@ts-ignore
export const BuyRCT = async (wallet, value) => {
    let type = '';
    let message = '';
    let hashTransaction = '';

    await web3.eth.sendTransaction({
        to: '0x1e1cc60a91380c81ecabfbd497c72a7f134f39af',
        from: wallet,
        value: Number(value) * 10**18
    })
    .then((hash) => {
        console.log(hash);
        if(hash){
            hashTransaction = hash.transactionHash
            type = 'success'
            message = "Buy success"
        }

    })
    .catch(err => {
        console.log(err);
    })

    return {
        type, 
        message,
        hashTransaction
    }
}

export async function balanceOf(address: string): Promise<string>{
    const response = await RcTokenContract.methods.balanceOf(address).call({from: RcTokenContractAddress});
    return response;
}