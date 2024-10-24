import { ValidatorContract } from "./Contracts";

export const GetValidator = async(walletAdd) => {
    const validator = await ValidatorContract.methods.getValidator(walletAdd).call()
    return validator;
}

export const GetValidators = async() => {
    const validators = await ValidatorContract.methods.getValidators().call()
    return validators;
}

export const addValidator = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ValidatorContract.methods.addValidator().send({ from: wallet })
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

export const addValidation = async (wallet, walletUserVote, justification) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ValidatorContract.methods.addValidation(walletUserVote, justification).send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Validation ok!"
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