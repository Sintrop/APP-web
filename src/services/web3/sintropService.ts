import { SintropContract } from "./Contracts";
import { sintropContractAddress } from "./Contracts";
import { ReturnTransactionProps } from "./rcTokenService";
import { web3RequestWrite } from "./requestService";

interface RequestInspectionProps{
    walletConnected: string;
}
export async function requestInspection({walletConnected}: RequestInspectionProps): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(SintropContract, 'requestInspection', [], walletConnected);
    return response;
}

export const InvalidateInspection = async (walletAddress: string, inspectionID: string, justification: string) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.addInspectionValidation(inspectionID, justification).send({from: walletAddress})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Vote Ok!"
        }
    })
    .on("error", () => {
        
    })
    return {
        type, 
        message,
        hashTransaction
    }
}

export const GetInspection = async (inspectionID: string) => {
    let inspection = {};
    await SintropContract.methods.getInspection(inspectionID).call({from: sintropContractAddress})
    //@ts-ignore
    .then((res) => {
        inspection = res;
    })
    return inspection;
}

export const GetIsa = async (inspectionId: string) => {
    //@ts-ignore
    let isas = []
    await SintropContract.methods.getIsa(inspectionId).call({from: sintropContractAddress})
    //@ts-ignore
    .then((res) => {
        isas = res;
    })
    //@ts-ignore
    return isas;
}

export const RequestInspection = async (walletAddress: string) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await SintropContract.methods.requestInspection().send({from: walletAddress})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection requested successfully!"
        }
    })
    .on("error", () => {
        
    })
    return {
        type, 
        message,
        hashTransaction
    }
} 

export const AcceptInspection = async (inspectionID: string, walletAddress: string) => {
    console.log(inspectionID)
    console.log(walletAddress)
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.acceptInspection(Number(inspectionID)).send({from: walletAddress})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection successfully accepted!"
        }
    })
    .on("error", () => {
        
    })
    return {
        type, 
        message,
        hashTransaction
    }
}

export const RealizeInspection = async (inspectionID: string, isas: string, walletAddress: string, report: string, proofPhoto: string) => {
    let type = '';
    let message = '';
    let hashTransaction = '';

    await SintropContract.methods.realizeInspection(inspectionID, proofPhoto, report, isas).send({from: walletAddress})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection performed successfully!"
        }
    })
    //@ts-ignore
    .on("error", (error) => {
        console.log(error);
    })
    return {
        type, 
        message,
        hashTransaction
    }
}