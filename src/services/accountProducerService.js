import Web3 from "web3";
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';
import InvestorContractJson from '../data/contracts/abis/InvestorContract.json';
import SACTokenContractJson from '../data/contracts/abis/SacToken.json';

const provider = `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
const web3 = new Web3(window.ethereum);

//contract address
const producerContractAddress = ProducerContractJson.networks[5777].address;
const sintropContractAddress = SintropContractJson.networks[5777].address;
const userContractAddress = UserContractJson.networks[5777].address;
const investorContractAddress = InvestorContractJson.networks[5777].address;
const sacTokenContractAddress = SACTokenContractJson.networks[5777].address;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson.abi, producerContractAddress);
const SintropContract = new web3.eth.Contract(SintropContractJson.abi, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson.abi, userContractAddress);
const InvestorContract = new web3.eth.Contract(InvestorContractJson.abi, investorContractAddress);
const SACTokenContract = new web3.eth.Contract(SACTokenContractJson.abi, sacTokenContractAddress);

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