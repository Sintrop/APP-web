import Web3 from 'web3';
import SintropContract from '../data/contracts/abis/Sintrop.json';
const SintropContractAddress = SintropContract.networks[5777].address;

export const GetInspections = async () => {
    let inspections = [];
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getInspections().call({from: contractAddress})
    .then((res) => {
        inspections = res;
    })

    return inspections;
}

export const RequestInspection = async (walletAddress) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(SintropContract.abi, SintropContractAddress);
    await contract.methods.requestInspection().send({from: walletAddress})
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(SintropContract.abi, SintropContractAddress);
    await contract.methods.acceptInspection(inspectionID).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection successfully accepted!"
        }
    })
    // .on('onfirmation', (receipt) => {
    //     hashTransaction = hash
    //     type = 'success'
    //     message = "Inspection successfully accepted!"
    // })
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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(SintropContract.abi, SintropContractAddress);
    await contract.methods.realizeInspection(inspectionID, isas).send({from: walletAddress})
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
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getInspection(inspectionID).call({from: contractAddress})
    .then((res) => {
        inspection = res;
    })

    return inspection;
}

export const GetIsa = async (inspectionId) => {
    let isas = []
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getIsa(inspectionId).call({from: contractAddress})
    .then((res) => {
        isas = res;
    })
    return isas;
}