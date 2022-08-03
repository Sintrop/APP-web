import Web3 from 'web3';
import SintropContract from '../data/contracts/abis/Sintrop.json';

export const GetInspections = async () => {
    let inspections = [];
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getInspections().call({from: contractAddress})
    .then((res) => {
        inspections = res;
    })

    return inspections;
}

export const RequestInspection = async (walletAddress) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.requestInspection().send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const AcceptInspection = async (inspectionID, walletAddress) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.acceptInspection(inspectionID).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const RealizeInspection = async (inspectionID, isas, walletAddress) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.realizeInspection(inspectionID, isas).send({from: walletAddress, gas: 1500000, gasPrice: '1500000'})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const GetInspection = async (inspectionID) => {
    let inspection = [];
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getInspection(inspectionID).call({from: contractAddress})
    .then((res) => {
        inspection = res;
    })

    return inspection;
}

export const GetIsa = async (inspectionId) => {
    let isas = []
    const web3js = new Web3(window.ethereum);
    const contractAddress = SintropContract.networks[5777].address;
    const contract = new web3js.eth.Contract(SintropContract.abi, contractAddress);
    await contract.methods.getIsa(inspectionId).call({from: contractAddress})
    .then((res) => {
        isas = res;
    })
    return isas;
}