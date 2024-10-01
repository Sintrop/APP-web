import { ProducerPoolContract } from "./web3/Contracts";
import { producerPoolContractAddress } from "./web3/Contracts";

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

export const GetCurrentEpoch = async () => {
    const response = await ProducerPoolContract.methods.currentEpoch().call();
    
    return Number(String(response).replace('n', ''));
}