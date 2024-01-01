import Web3 from 'web3';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
const web3 = new Web3(window.ethereum);

//contract address
const sintropContractAddress = process.env.REACT_APP_SINTROP_CONTRACT_ADDRESS

//initializing contract
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);

export const InvalidateInspection = async (walletAddress, inspectionID, justification) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.addInspectionValidation(inspectionID, justification).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Vote Ok!"
        }
    })
    .on("error", (error, receipt) => {
        console.log(receipt);
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