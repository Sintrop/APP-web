import Web3 from "web3";
import ResearcherContractJson from  '../data/contracts/abis/ResearcherContract.json';
const web3 = new Web3(window.ethereum);

//contract addres
const researcherContractAddress = '0x5c5553b494cc350f1a31e1f91832a3ed19df1627';

//initializing contract
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);

class ResearchersService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.researchersContractAddress = researcherContractAddress;
    }

    async getResearcherRanking(){
        const researchers = await ResearcherContract.methods.getResearchers().call()
        return researchers; 
    }

    
}
export default ResearchersService; 

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
