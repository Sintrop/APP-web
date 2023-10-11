import Web3 from "web3";
import UserContractJson from '../data/contracts/abis/UserContract.json';
import ResearcherContractJson from '../data/contracts/abis/ResearcherContract.json';
import ContributorContractJson from '../data/contracts/abis/ContributorContract.json';
import AdvisorContractJson from '../data/contracts/abis/AdvisorContract.json';
import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
import SACTokenContractJson from '../data/contracts/abis/SacToken.json';
const web3 = new Web3(window.ethereum);

//contract address
const userContractAddress = '0x6e84e942d18dc2f68ec9fed5a4fa526b17f04113';
const researcherContractAddress = '0x5c5553b494cc350f1a31e1f91832a3ed19df1627';
const contributorContractAddress = '0xf1790104904127901ea3dda4b95deb215764023f';
const advisorContractAddress = '0xfba96a8aba5d24109aa0c8038aa90095f81281e2';
const developerContractAddress = '0x0c9aa6894d586fbfd246b7633cde1ced544120f4';
const SACTokenContractAddress = '0xF8033Bbfe9c645F52d170DDD733274371E75369F';

//initializing contract
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const ContributorContract = new web3.eth.Contract(ContributorContractJson, contributorContractAddress);
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson, advisorContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const SACTokenContract = new web3.eth.Contract(SACTokenContractJson, SACTokenContractAddress);

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