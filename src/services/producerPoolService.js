import Web3 from "web3";
import ProducerPoolContract from '../data/contracts/abis/ProducerPool.json';

const contractAddress = ProducerPoolContract.networks[5777].address;
const contractAbi = ProducerPoolContract.abi;

export const GetTokensPerEra = async () => {
    let tokens = 0;
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.tokensPerEra().call({from: contractAddress})
    .then((res) => {
        tokens = res;
    })

    return tokens;
}

export const GetCurrentContractEra = async () => {
    let era = '';
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.currentContractEra().call({from: contractAddress})
    .then((res) => {
        era = res;
    })

    return era;
}

export const GetBalanceContract = async () => {
    let balance = '';
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.balance().call({from: contractAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const GetBalanceProducer = async (walletProducer) => {
    let balance = '';
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.balanceOf(walletProducer).call({from: contractAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const CheckNextAprove = async (era) => {
    let eras = 0;
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.nextApproveIn(era).call({from: contractAddress})
    .then((res) => {
        eras = res;
    })

    return eras;
}