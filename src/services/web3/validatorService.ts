import { UserValidationProps, ValidatorProps } from "../../types/validator";
import { ValidatorContract } from "./Contracts";
import { ReturnTransactionProps } from "./rcTokenService";
import { web3RequestWrite } from "./requestService";

export const GetValidator = async(walletAdd: string) => {
    const validator = await ValidatorContract.methods.getValidator(walletAdd).call()
    return validator;
}

export const GetValidators = async() => {
    const validators = await ValidatorContract.methods.getValidators().call()
    return validators;
}

export async function getValidators(): Promise<ValidatorProps[]>{
    const validators = await ValidatorContract.methods.getValidators().call()

    
    let newArray = [];
    for (var i = 0; i < validators.length; i++) {
        const data = {
            ...validators[i],
            userType: 8
        };
        newArray.push(data);
    }

    return newArray as ValidatorProps[];
}

interface AddValidatorProps{
    walletConnected: string;
}
export async function addValidator({walletConnected}: AddValidatorProps): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ValidatorContract, 'addValidator', [], walletConnected);
    return response;
}

interface AddValidationProps{
    walletConnected: string;
    walletToVote: string;
    justification: string;
}
export async function addValidation(props: AddValidationProps): Promise<ReturnTransactionProps>{
    const {justification, walletConnected, walletToVote} = props;
    const response = await web3RequestWrite(ValidatorContract, 'addUserValidation', [walletToVote, justification], walletConnected);
    return response;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ValidatorContract, 'withdraw', [], walletConnected);
    return response;
}

interface AddLevelProps{
    walletConnected: string;
}
export async function addLevel({walletConnected}: AddLevelProps) {
    const response = await web3RequestWrite(ValidatorContract, 'addLevel', [], walletConnected);
    return response;
}

export async function getValidator(address: string): Promise<ValidatorProps>{
    const validator = await ValidatorContract.methods.getValidator(address).call();
    return validator;
}

export async function getUserValidations(address: string): Promise<UserValidationProps[]>{
    const validations = await ValidatorContract.methods.getUserValidations(address).call();
    return validations;
}