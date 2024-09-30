import Web3 from "web3";
import ProducerContractJson from "../data/contracts/abis/ProducerContract.json";
import ActivistContractJson from "../data/contracts/abis/ActivistContract.json";
import ValidatorContractJson from "../data/contracts/abis/ValidatorContract.json";
import ResearcherContractJson from "../data/contracts/abis/ResearcherContract.json";
import DeveloperContractJson from "../data/contracts/abis/DeveloperContract.json";
import SupporterContractJson from "../data/contracts/abis/SupporterContract.json";
import InspectorContractJson from '../data/contracts/abis/InspectorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const advisorContractAddress = process.env.REACT_APP_ADVISOR_CONTRACT_ADDRESS
const inspectorContractAddress = process.env.REACT_APP_INSPECTOR_CONTRACT_ADDRESS;
const producerContractAddress = process.env.REACT_APP_PRODUCER_CONTRACT_ADDRESS;
const supporterContractAddress = process.env.REACT_APP_SUPPORTER_CONTRACT_ADDRESS;
const activistContractAddress = process.env.REACT_APP_ACTIVIST_CONTRACT_ADDRESS;
const researcherContractAddress = process.env.REACT_APP_RESEARCHER_CONTRACT_ADDRESS
const developerContractAddress = process.env.REACT_APP_DEVELOPER_CONTRACT_ADDRESS
const validatorContractAddress = process.env.REACT_APP_VALIDATOR_CONTRACT_ADDRESS;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
const InspectorContract = new web3.eth.Contract(InspectorContractJson, inspectorContractAddress);

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

export const addInspector = async (wallet, name, proofPhoto, coordinate) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InspectorContract.methods.addInspector(name, proofPhoto, coordinate)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspector registered!"
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

export const addSupporter = async (wallet, name) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await SupporterContract.methods.addSupporter(name)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Supporter registered!"
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

export const addValidator = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ValidatorContract.methods.addValidator(name, proofPhoto).send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Validator registered!"
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