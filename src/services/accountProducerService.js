import Web3 from "web3";
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';
import InvestorContractJson from '../data/contracts/abis/InvestorContract.json';
import SACTokenContractJson from '../data/contracts/abis/SacToken.json';

const provider = `https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a`
const web3 = new Web3(provider);

//contract address
const producerContractAddress = '0x693161f1e90270ba156179128f49c285c89447e7';
const sintropContractAddress = '0x6ff3e655a639e35d9194228aa42879ae7ddf7dd8';
const userContractAddress = '0x6e84e942d18dc2f68ec9fed5a4fa526b17f04113';
const investorContractAddress = '0x8014eef23614d357010685787690d3e7c2cfcc30';
const sacTokenContractAddress = '0xF8033Bbfe9c645F52d170DDD733274371E75369F';

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const InvestorContract = new web3.eth.Contract(InvestorContractJson, investorContractAddress);
const SACTokenContract = new web3.eth.Contract(SACTokenContractJson, sacTokenContractAddress);

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

export const GetInvestor = async (wallet) => {
    const investor = await InvestorContract.methods.getInvestor(wallet).call()
    return investor;
}

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    await SACTokenContract.methods.certificate(wallet).call({from: sacTokenContractAddress})
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