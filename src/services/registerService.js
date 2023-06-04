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
const contributorContractAddress = '0xf1790104904127901ea3dda4b95deb215764023f';
const producerContractAddress = '0x693161f1e90270ba156179128f49c285c89447e7';
const activistContractAddress = '0xa289fabc5764f91ac56575f7f048038faa3d059d';
const researcherContractAddress = '0x5c5553b494cc350f1a31e1f91832a3ed19df1627';
const developerContractAddress = '0x0c9aa6894d586fbfd246b7633cde1ced544120f4';
const advisorContractAddress = '0xfba96a8aba5d24109aa0c8038aa90095f81281e2';
const investorContractAddress = '0x8014eef23614d357010685787690d3e7c2cfcc30';

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const ContributorContract = new web3.eth.Contract(ContributorContractJson, contributorContractAddress);
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson, advisorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
const InvestorContract = new web3.eth.Contract(InvestorContractJson, investorContractAddress);

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