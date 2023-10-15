import Web3 from "web3";
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';
import SupporterContractJson from '../data/contracts/abis/SupporterContract.json';
import RcTokenContractJson from '../data/contracts/abis/RcToken.json';

const provider = `https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a`
const web3 = new Web3(provider);

//contract address
const producerContractAddress = process.env.REACT_APP_PRODUCER_CONTRACT_ADDRESS;
const sintropContractAddress = process.env.REACT_APP_SINTROP_CONTRACT_ADDRESS;
const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS;
const supporterContractAddress = process.env.REACT_APP_SUPPORTER_CONTRACT_ADDRESS;
const rcTokenContractAddress = process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
const RcTokenContract = new web3.eth.Contract(RcTokenContractJson, rcTokenContractAddress);

export const GetProducer = async (wallet) => {
    let dataProducer = []
    await ProducerContract.methods.getProducer(wallet).call({from: producerContractAddress})
    .then((res) => {
        dataProducer = res;
    })
    return dataProducer;
}

export const GetInspections = async () => {
    let inspections = [];
    await SintropContract.methods.getInspections().call({from: sintropContractAddress})
    .then((res) => {
        inspections = res;
    })
    return inspections;
}

export const GetDelation = async (wallet) => {
    let delations = []
    await UserContract.methods.getUserDelations(wallet).call({from: userContractAddress})
    .then((res) => {
        delations = res;
    })
    return delations;
}

export const GetSupporter = async (wallet) => {
    const supporter = await SupporterContract.methods.getSupporter(wallet).call()
    return supporter;
}

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    await RcTokenContract.methods.certificate(wallet).call({from: rcTokenContractAddress})
    .then((res) => {
        tokens = res
    })
    .catch((err) => {
        tokens = 0
    })
    return tokens
}

export const GetIsa = async (inspectionId) => {
    let isas = []
    await SintropContract.methods.getIsa(inspectionId).call({from: sintropContractAddress})
    .then((res) => {
        isas = res;
    })
    return isas;
}