import Web3 from "web3";
import ValidatorContractJson from  '../data/contracts/abis/ValidatorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const validatorContractAddress = process.env.REACT_APP_VALIDATOR_CONTRACT_ADDRESS;

//initializing contract
const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);

class ContributorsService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.contributorContractAddress = validatorContractAddress;
    }

    async getContributorsRanking(){
        const contributors = await ValidatorContract.methods.getValidators().call()
        return contributors;
    }
}


export default ContributorsService; 

export const GetValidator = async(walletAdd) => {
    const validator = await ValidatorContract.methods.getValidator(walletAdd).call()
    return validator;
}