import Web3 from "web3";
import ResearcherContract from '../data/contracts/abis/ResearcherContract.json';
import ContributorContract from '../data/contracts/abis/ContributorContract.json';
import AdvisorContract from '../data/contracts/abis/AdvisorContract.json';
import DeveloperContract from '../data/contracts/abis/DeveloperContract.json';
import DeveloperPool from '../data/contracts/abis/DeveloperPool.json';

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