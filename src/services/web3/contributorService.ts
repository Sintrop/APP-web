import { ContributorProps } from "../../types/contributor";
import { ContributorContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

interface AddContributorProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addContributor({walletConnected, name, proofPhoto}: AddContributorProps) {
    const response = await web3RequestWrite(ContributorContract, 'addContributor', [name, proofPhoto], walletConnected);
    return response;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ContributorContract, 'withdraw', [], walletConnected);
    return response;
}

export async function getContributors(): Promise<ContributorProps[]>{
    const contributors = await ContributorContract.methods.getContributors().call();
    
    let newArray = [];
    for (var i = 0; i < contributors.length; i++) {
        const data = {
            ...contributors[i],
            userType: 5
        };
        newArray.push(data);
    }

    return newArray as ContributorProps[];
}