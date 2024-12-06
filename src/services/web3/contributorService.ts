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