import Web3 from "web3";
import ProducerPoolContractJson from '../data/contracts/abis/ProducerPool.json';
const web3 = new Web3(window.ethereum);

//contract address
const producerPoolContractAddress = '0x0751c7e08e53a55a1ed24fe1467d9a0ceb8ef95e';
//const poolableContractAddress = PoolableContractJson.networks

//initializing contract
const ProducerPoolContract = new web3.eth.Contract(ProducerPoolContractJson, producerPoolContractAddress);
//const PoolableContract = new web3.eth.Contract(PoolableContractJson.abi, poolableContractAddress);

export const GetTokensPerEra = async () => {
    let tokens = 0;
    await ProducerPoolContract.methods.tokensPerEra().call({from: producerPoolContractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetCurrentContractEra = async () => {
    let era = '';
    await ProducerPoolContract.methods.currentContractEra().call({from: producerPoolContractAddress})
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetBalanceContract = async () => {
    let balance = '';
    await ProducerPoolContract.methods.balance().call({from: producerPoolContractAddress})
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const GetBalanceProducer = async (walletProducer) => {
    let balance = '';
    await ProducerPoolContract.methods.balanceOf(walletProducer).call({from: producerPoolContractAddress})
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const CheckNextAprove = async (era) => {
    let eras = 0;
    await ProducerPoolContract.methods.nextApproveIn(era).call({from: producerPoolContractAddress})
    .then((res) => {
        eras = res;
    })
    return eras;
}

// export const GetInfoEra = async () => {
//     let eras = 0;
//     await PoolableContract.methods.eraLevels().call({from: poolableContractAddress})
//     .then((res) => {
//         eras = res;
//     })
//     return eras;
// }