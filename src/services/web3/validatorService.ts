import { ValidatorContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export const GetValidator = async(walletAdd: string) => {
    const validator = await ValidatorContract.methods.getValidator(walletAdd).call()
    return validator;
}

export const GetValidators = async() => {
    const validators = await ValidatorContract.methods.getValidators().call()
    return validators;
}

export const addValidator = async (wallet: string) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ValidatorContract.methods.addValidator().send({ from: wallet })
    //@ts-ignore
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Validator registered!"
        }
    })
    //@ts-ignore
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

export const addValidation = async (wallet: string, walletUserVote: string, justification: string) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ValidatorContract.methods.addValidation(walletUserVote, justification).send({ from: wallet })
    //@ts-ignore
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Validation ok!"
        }
    })
    //@ts-ignore
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

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ValidatorContract, 'withdraw', [], walletConnected);
    return response;
}