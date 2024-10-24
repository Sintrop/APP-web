import { SintropContract } from "./Contracts";
import { sintropContractAddress } from "./Contracts";

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
    console.log(inspectionID)
    console.log(walletAddress)
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.acceptInspection(Number(inspectionID)).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection successfully accepted!"
        }
    })
    .on("error", (error, receipt) => {
        console.log(error);
    })
    return {
        type, 
        message,
        hashTransaction
    }
}

export const RealizeInspection = async (inspectionID, isas, walletAddress, report, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = '';

    await SintropContract.methods.realizeInspection(inspectionID, proofPhoto, report, isas).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection performed successfully!"
        }
    })
    .on("error", (error, receipt) => {
        console.log(error);
    })
    return {
        type, 
        message,
        hashTransaction
    }
}