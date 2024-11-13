import { ResearcherContract } from "./Contracts";
import { researcherContractAddress } from "./Contracts";
import { web3RequestWrite } from "./requestService"; 

export const GetResearcher = async (walletAdd: string) => {
    const researchers = await ResearcherContract.methods.getResearcher(walletAdd).call()
    return researchers;
}

export const GetResearchers = async () => {
    const researchers = await ResearcherContract.methods.getResearchers().call()
    return researchers; 
}

export const PublishResearch = async (walletAddress: string, title: string, thesis: string, filePath: string) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ResearcherContract.methods.addWork(title, thesis, filePath).send({from: walletAddress})
    //@ts-ignore
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Published research!"
        }
    })
    .on("error", () => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
} 

export const GetResearches = async () => {
    //@ts-ignore
    let researches = [];
    await ResearcherContract.methods.getWorks().call({from: researcherContractAddress})
    //@ts-ignore
    .then(res => {
        researches = res;
    })
    //@ts-ignore
    .catch(err => {
        console.log(err);
    })
    //@ts-ignore
    return researches;
} 

interface AddResearcherProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addResearcher({walletConnected, name, proofPhoto}: AddResearcherProps){
    const response = await web3RequestWrite(ResearcherContract, 'addResearcher', [name, proofPhoto], walletConnected);
    return response;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ResearcherContract, 'withdraw', [], walletConnected);
    return response;
}