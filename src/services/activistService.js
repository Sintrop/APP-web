import { ActivistContract } from "./web3/Contracts";

export const GetActivist = async (wallet) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    return activists;
}

export const addActivist = async (wallet, name, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ActivistContract.methods.addActivist(name, proofPhoto)
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