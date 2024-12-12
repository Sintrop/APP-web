import { DeveloperProps } from "../../types/developer";
import { DeveloperContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

//@ts-ignore
export const GetDeveloper = async (walletAdd) => {
    const developers = await DeveloperContract.methods.getDeveloper(walletAdd).call()
    return developers;
}

export const GetDevelopers = async () => {
    const developers = await DeveloperContract.methods.getDevelopers().call();

    let newArray = [];
    for (var i = 0; i < developers.length; i++) {
        const data = {
            ...developers[i],
            userType: 4
        };
        newArray.push(data);
    }

    return newArray as DeveloperProps[];
}

interface AddContributionProps{
    walletConnected: string;
    report: string;
}
export async function addContribution({walletConnected, report}: AddContributionProps){
    const response = await web3RequestWrite(DeveloperContract, 'addContribution', [report], walletConnected);
    return response;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(DeveloperContract, 'withdraw', [], walletConnected);
    return response;
}

interface AddDeveloperProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addDeveloper({walletConnected, name, proofPhoto}: AddDeveloperProps){
    const response = await web3RequestWrite(DeveloperContract, 'addDeveloper', [name, proofPhoto], walletConnected);
    return response;
}