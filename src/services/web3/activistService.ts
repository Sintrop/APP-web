import { ActivistContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export const GetActivist = async (wallet: string) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    return activists;
}

interface AddActivistProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addActivist({walletConnected, name, proofPhoto}: AddActivistProps){
    const response = await web3RequestWrite(ActivistContract, 'addActivist', [name, proofPhoto], walletConnected);
    return response;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ActivistContract, 'withdraw', [], walletConnected);
    return response;
}