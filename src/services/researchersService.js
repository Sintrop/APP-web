import Web3 from "web3";
import ResearcherContractJson from  '../data/contracts/abis/ResearcherContract.json';
const web3 = new Web3(window.ethereum);

//contract addres
const researcherContractAddress = process.env.REACT_APP_RESEARCHER_CONTRACT_ADDRESS;

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

export const addResearcher = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ResearcherContract.methods.addResearcher(name, proofPhoto)
    .send({ from: wallet})
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Researcher registered!"  
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            type = 'error'
            message = 'Not allowed user!'
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });
        
    return {
        type, 
        message,
        hashTransaction
    }
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