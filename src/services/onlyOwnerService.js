import Web3 from "web3";
import UserContract from '../data/contracts/abis/UserContract.json';
import ResearcherContract from '../data/contracts/abis/ResearcherContract.json';
import ContributorContract from '../data/contracts/abis/ContributorContract.json';
import AdvisorContract from '../data/contracts/abis/AdvisorContract.json';
import DeveloperContract from '../data/contracts/abis/DeveloperContract.json';
import DeveloperPool from '../data/contracts/abis/DeveloperPool.json';
import SACTokenContract from '../data/contracts/abis/SacToken.json';

export const NewAllowedUser = async (walletUser, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = UserContract.networks[5777].address;
    const contract = new web3js.eth.Contract(UserContract.abi, contractAddress);
    await contract.methods.newAllowedCaller(walletUser).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedResearcher = async (walletResearcher, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = ResearcherContract.networks[5777].address;
    const contract = new web3js.eth.Contract(ResearcherContract.abi, contractAddress);
    await contract.methods.newAllowedUser(walletResearcher).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedContributor = async (walletContributor, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = ContributorContract.networks[5777].address;
    const contract = new web3js.eth.Contract(ContributorContract.abi, contractAddress);
    await contract.methods.newAllowedUser(walletContributor).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedAdvisor = async (walletAdvisor, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = AdvisorContract.networks[5777].address;
    const contract = new web3js.eth.Contract(AdvisorContract.abi, contractAddress);
    await contract.methods.newAllowedUser(walletAdvisor).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const NewAllowedDeveloper = async (walletDeveloper, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperContract.abi, contractAddress);
    await contract.methods.newAllowedUser(walletDeveloper).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const AddLevel = async (walletDeveloper, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperPool.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperPool.abi, contractAddress);
    await contract.methods.addLevel(walletDeveloper).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const UndoLevel = async (walletDeveloper, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperPool.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperPool.abi, contractAddress);
    await contract.methods.undoLevel(walletDeveloper).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}

export const AddContractPool = async (walletAdm, addressContract, numTokens) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = SACTokenContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SACTokenContract.abi, contractAddress);
    await contract.methods.addContractPool(addressContract, numTokens).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            return hash
        }else{
            return false
        }
    })
}