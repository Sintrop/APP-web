import { ResearcherContract } from "./Contracts";
import { researcherContractAddress } from "./Contracts";
import { web3RequestWrite } from "./requestService"; 

export const GetResearcher = async (walletAdd) => {
    const researchers = await ResearcherContract.methods.getResearcher(walletAdd).call()
    return researchers;
}

export const GetResearchers = async () => {
    const researchers = await ResearcherContract.methods.getResearchers().call()
    return researchers; 
}

export const PublishResearch = async (walletAddress, title, thesis, filePath) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ResearcherContract.methods.addWork(title, thesis, filePath).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Published research!"
        }
    })
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
} 

export const GetResearches = async () => {
    let researches = [];
    await ResearcherContract.methods.getWorks().call({from: researcherContractAddress})
    .then(res => {
        researches = res;
    })
    .catch(err => {
        console.log(err);
    })
    return researches;
} 

export async function addResearcher(walletConnected, name, proofPhoto){
    const response = await web3RequestWrite(ResearcherContract, 'addResearcher', [name, proofPhoto], walletConnected);
    return response;
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ResearcherContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!"
        }
    })
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
}