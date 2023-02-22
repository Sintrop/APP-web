import Web3 from "web3";
import UserContractJson from '../data/contracts/abis/UserContract.json';
import ResearcherContractJson from '../data/contracts/abis/ResearcherContract.json';
import ContributorContractJson from '../data/contracts/abis/ContributorContract.json';
import AdvisorContractJson from '../data/contracts/abis/AdvisorContract.json';
import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
import SACTokenContractJson from '../data/contracts/abis/SacToken.json';
const web3 = new Web3(window.ethereum);

//contract address
const userContractAddress = UserContractJson.networks[5777].address;
const researcherContractAddress = ResearcherContractJson.networks[5777].address;
const contributorContractAddress = ContributorContractJson.networks[5777].address;
const advisorContractAddress = AdvisorContractJson.networks[5777].address;
const developerContractAddress = DeveloperContractJson.networks[5777].address;
const SACTokenContractAddress = SACTokenContractJson.networks[5777].address;

//initializing contract
const UserContract = new web3.eth.Contract(UserContractJson.abi, userContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson.abi, researcherContractAddress);
const ContributorContract = new web3.eth.Contract(ContributorContractJson.abi, contributorContractAddress);
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson.abi, advisorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson.abi, developerContractAddress);
const SACTokenContract = new web3.eth.Contract(SACTokenContractJson.abi, SACTokenContractAddress);

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

export const NewAllowedContributor = async (walletContributor, walletAdm) => {
    await ContributorContract.methods.newAllowedUser(walletContributor).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedAdvisor = async (walletAdvisor, walletAdm) => {
    await AdvisorContract.methods.newAllowedUser(walletAdvisor).send({from: walletAdm})
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
    await SACTokenContract.methods.addContractPool(addressContract, numTokens).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}