import Web3 from "web3";
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';

const provider = `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
const web3 = new Web3(window.ethereum);

//contract address
const producerContractAddress = ProducerContractJson.networks[5777].address;
const sintropContractAddress = SintropContractJson.networks[5777].address;
const userContractAddress = UserContractJson.networks[5777].address;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson.abi, producerContractAddress);
const SintropContract = new web3.eth.Contract(SintropContractJson.abi, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson.abi, userContractAddress)

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