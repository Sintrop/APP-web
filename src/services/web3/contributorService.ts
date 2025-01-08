import { ContributorProps } from "../../types/contributor";
import { ContributorContract } from "./Contracts";
import { ReturnTransactionProps } from "./rcTokenService";
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

export async function getContributor(address: string):Promise<ContributorProps>{
    const contributor = await ContributorContract.methods.getContributor(address).call();
    return contributor
}

interface AddContributionProps{
    walletConnected: string;
    report: string;
}
export async function addContribution({report, walletConnected}: AddContributionProps): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ContributorContract, 'addContribution', [report], walletConnected);
    return response;
}