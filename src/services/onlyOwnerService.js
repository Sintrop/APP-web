import Web3 from "web3";
import UserContractJson from '../data/contracts/abis/UserContract.json';
import ResearcherContractJson from '../data/contracts/abis/ResearcherContract.json';
import ValidatorContractJson from '../data/contracts/abis/ValidatorContract.json';
import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
import RcTokenContractJson from '../data/contracts/abis/RcToken.json';
const web3 = new Web3(window.ethereum);

//contract address

const advisorContractAddress = process.env.REACT_APP_ADVISOR_CONTRACT_ADDRESS;
const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS;
const rcTokenContractAddress = process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS;
const researcherContractAddress = process.env.REACT_APP_RESEARCHER_CONTRACT_ADDRESS
const developerContractAddress = process.env.REACT_APP_DEVELOPER_CONTRACT_ADDRESS
const validatorContractAddress = process.env.REACT_APP_VALIDATOR_CONTRACT_ADDRESS;

//initializing contract
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const RcTokenContract = new web3.eth.Contract(RcTokenContractJson, rcTokenContractAddress);

export const NewAllowedUser = async (walletUser, walletAdm) => {
    await UserContract.methods.newAllowedCaller(walletUser).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedResearcher = async (walletResearcher, walletAdm) => {
    await ResearcherContract.methods.newAllowedUser(walletResearcher).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedValidator = async (walletContributor, walletAdm) => {
    await ValidatorContract.methods.newAllowedUser(walletContributor).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedDeveloper = async (walletDeveloper, walletAdm) => {
    await DeveloperContract.methods.newAllowedUser(walletDeveloper).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const AddLevel = async (walletDeveloper, walletAdm) => {
    await DeveloperContract.methods.addLevel(walletDeveloper).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const UndoLevel = async (walletDeveloper, walletAdm) => {
    await DeveloperContract.methods.removeLevel(walletDeveloper, 1).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const AddContractPool = async (walletAdm, addressContract, numTokens) => {
    await RcTokenContract.methods.addContractPool(addressContract, numTokens).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}