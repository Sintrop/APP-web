import Web3 from 'web3';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
const web3 = new Web3(window.ethereum);

//contract address
const sintropContractAddress = '0x6ff3e655a639e35d9194228aa42879ae7ddf7dd8';

//initializing contract
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);

export const GetInspections = async () => {
    let inspections = [];
    await SintropContract.methods.getInspections().call({from: sintropContractAddress})
    .then((res) => {
        inspections = res;
    })
    return inspections;
}

export const CanRequestInspection = async (wallet) => {
    let may = false;
    await SintropContract.methods.canRequestInspection().call({from: wallet})
    .then((res) => {
        may = res;
    })
    return may;
}

export const RequestInspection = async (walletAddress) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await SintropContract.methods.requestInspection().send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection requested successfully!"
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

export const AcceptInspection = async (inspectionID, walletAddress) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.acceptInspection(inspectionID).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection successfully accepted!"
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

export const RealizeInspection = async (inspectionID, isas, walletAddress) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.realizeInspection(inspectionID, isas).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection performed successfully!"
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

export const GetInspection = async (inspectionID) => {
    let inspection = [];
    await SintropContract.methods.getInspection(inspectionID).call({from: sintropContractAddress})
    .then((res) => {
        inspection = res;
    })
    return inspection;
}

export const GetIsa = async (inspectionId) => {
    let isas = []
    await SintropContract.methods.getIsa(inspectionId).call({from: sintropContractAddress})
    .then((res) => {
        isas = res;
    })
    return isas;
}