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