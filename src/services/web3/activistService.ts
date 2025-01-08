import { ActivistProps } from "../../types/activist";
import { ActivistContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export const GetActivist = async (wallet: string) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    let newArray = [];
    for (var i = 0; i < activists.length; i++) {
        const data = {
            ...activists[i],
            userType: 6
        };
        newArray.push(data);
    }

    return newArray as ActivistProps[];
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

export async function getActivist(address: string):Promise<ActivistProps>{
    const activist = await ActivistContract.methods.getActivist(address).call();
    return activist
}