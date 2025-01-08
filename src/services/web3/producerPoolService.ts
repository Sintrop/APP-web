import { ProducerPoolContract, web3 } from "./Contracts";
import { producerPoolContractAddress } from "./Contracts";

export const GetTokensPerEra = async () => {
    let tokens = 0;
    await ProducerPoolContract.methods.tokensPerEra().call({from: producerPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetCurrentContractEra = async () => {
    let era = '';
    await ProducerPoolContract.methods.currentContractEra().call({from: producerPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetBalanceContract = async () => {
    let balance = '';
    await ProducerPoolContract.methods.balance().call({from: producerPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const GetBalanceProducer = async (walletProducer: string) => {
    let balance = '';
    await ProducerPoolContract.methods.balanceOf(walletProducer).call({from: producerPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const CheckNextAprove = async (era: number) => {
    let eras = 0;
    await ProducerPoolContract.methods.nextApproveIn(era).call({from: producerPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        eras = res;
    })
    return eras;
}

export const GetCurrentEpoch = async () => {
    const response = await ProducerPoolContract.methods.currentEpoch().call();
    
    return Number(String(response).replace('n', ''));
}

export const NextEraIn = async (eraAtual: number) => {
    const response = await ProducerPoolContract.methods.nextEraIn(eraAtual).call();
    return Number(String(response).replace('n', ''));
}

export async function currentContractEra(): Promise<number>{
    const response = await ProducerPoolContract.methods.currentContractEra().call();
    return parseInt(response);
}

export async function currentContractEpoch(): Promise<number>{
    const response = await ProducerPoolContract.methods.currentEpoch().call();
    return parseInt(response);
}

export async function tokensPerEra(currentEpoch: number, halving: number): Promise<number>{
    const response = await ProducerPoolContract.methods.tokensPerEra(currentEpoch, halving).call();
    return Number(web3.utils.fromWei(response));
}