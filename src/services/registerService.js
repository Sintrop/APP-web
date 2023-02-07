import Web3 from "web3";
import ProducerContract from "../data/contracts/abis/ProducerContract.json";
import ActivistContract from "../data/contracts/abis/ActivistContract.json";
import ContributorContract from "../data/contracts/abis/ContributorContract.json";
import ResearcherContract from "../data/contracts/abis/ResearcherContract.json";
import DeveloperContract from "../data/contracts/abis/DeveloperContract.json";
import AdvisorContract from "../data/contracts/abis/AdvisorContract.json";
import InvestorContract from "../data/contracts/abis/InvestorContract.json";

const ContributorContractAddress = ContributorContract.networks[5777].address;
const ProducerContractAddress = ProducerContract.networks[5777].address;
const ActivistContractAddress = ActivistContract.networks[5777].address;
const ResearcherContractAddress = ResearcherContract.networks[5777].address;
const DeveloperContractAddress = DeveloperContract.networks[5777].address;
const AdvisorContractAddress = AdvisorContract.networks[5777].address;
const InvestorContractAddress = InvestorContract.networks[5777].address;

export const addProducer = async (wallet, name, document, documentType, country, state, city, cep, street, complement, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( ProducerContract.abi, ProducerContractAddress);
    await contract.methods.addProducer(name, proofPhoto, document, documentType, country, state, city, street, complement,cep)
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

export const addActivist = async (wallet, name, country, state, city, cep, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( ActivistContract.abi, ActivistContractAddress);
    await contract.methods.addActivist(name, proofPhoto, country, state, city, cep)
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( InvestorContract.abi, InvestorContractAddress);
    await contract.methods.addInvestor(name)
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( DeveloperContract.abi, DeveloperContractAddress);
    await contract.methods.addDeveloper(name, proofPhoto)
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( ResearcherContract.abi, ResearcherContractAddress);
    await contract.methods.addResearcher(name, proofPhoto)
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( AdvisorContract.abi, AdvisorContractAddress);
    await contract.methods.addAdvisor(name, proofPhoto)
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract( ContributorContract.abi, ContributorContractAddress);
    await contract.methods.addContributor(name, proofPhoto).send({ from: wallet })
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