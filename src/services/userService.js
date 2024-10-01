import { UserContract } from "./web3/Contracts";
import { userContractAddress } from "./web3/Contracts";

export const AddDelation = async (informed, reported, title, testemony, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await UserContract.methods.addDelation(reported, title, testemony, proofPhoto).send({from: informed})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "User successfully reported!"
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

export const GetDelation = async (wallet) => {
    let delations = []
    await UserContract.methods.getUserDelations(wallet).call({from: userContractAddress})
    .then((res) => {
        delations = res;
    })
    return delations;
}