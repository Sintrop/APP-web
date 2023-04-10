import Web3 from "web3";
import ProducerContractJson from "../data/contracts/abis/ProducerContract.json";
import ActivistContractJson from "../data/contracts/abis/ActivistContract.json";
import ContributorContractJson from "../data/contracts/abis/ContributorContract.json";
import ResearcherContractJson from "../data/contracts/abis/ResearcherContract.json";
import DeveloperContractJson from "../data/contracts/abis/DeveloperContract.json";
import AdvisorContractJson from "../data/contracts/abis/AdvisorContract.json";
import InvestorContractJson from "../data/contracts/abis/InvestorContract.json";
const web3 = new Web3(window.ethereum);

//contract address
const contributorContractAddress = ContributorContractJson.networks[5777].address;
const producerContractAddress = ProducerContractJson.networks[5777].address;
const activistContractAddress = ActivistContractJson.networks[5777].address;
const researcherContractAddress = ResearcherContractJson.networks[5777].address;
const developerContractAddress = DeveloperContractJson.networks[5777].address;
const advisorContractAddress = AdvisorContractJson.networks[5777].address;
const investorContractAddress = InvestorContractJson.networks[5777].address;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson.abi, producerContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson.abi, researcherContractAddress);
const ContributorContract = new web3.eth.Contract(ContributorContractJson.abi, contributorContractAddress);
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson.abi, advisorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson.abi, developerContractAddress);
const ActivistContract = new web3.eth.Contract(ActivistContractJson.abi, activistContractAddress);
const InvestorContract = new web3.eth.Contract(InvestorContractJson.abi, investorContractAddress);

export const addProducer = async (wallet, name, proofPhoto, geoLocation, areaProperty) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ProducerContract.methods.addProducer(Number(areaProperty).toFixed(0), name, proofPhoto, geoLocation)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Producer registered!"
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

export const addActivist = async (wallet, name, proofPhoto, coordinate) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ActivistContract.methods.addActivist(name, proofPhoto, coordinate)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Activist registered!"
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
    })
        
    return {
        type, 
        message,
        hashTransaction
    }
}

export const addInvestor = async (wallet, name) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InvestorContract.methods.addInvestor(name)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Investor registered!"
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

export const addDeveloper = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await DeveloperContract.methods.addDeveloper(name, proofPhoto)
    .send({ from: wallet})
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Developer registered!"
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

export const addAdvisor = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await AdvisorContract.methods.addAdvisor(name, proofPhoto)
    .send({ from: wallet})
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Advisor registered!"  
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

export const addContributor = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ContributorContract.methods.addContributor(name, proofPhoto).send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Contributor registered!"
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
    })
        
    return {
        type, 
        message,
        hashTransaction
    }
}