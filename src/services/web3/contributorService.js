import { ContributorContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export async function addContributor(walletConnected, name, proofPhoto) {
    const response = await web3RequestWrite(ContributorContract, 'addContributor', [name, proofPhoto], walletConnected);
    return response;
}