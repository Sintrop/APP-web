import { DevelopersPoolContract, web3 } from "./Contracts";
import { DeveloperContract } from "./Contracts";
import { developerContractAddress } from "./Contracts";
import { developersPoolContractAddress } from "./Contracts";

export const GetBalancePool = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.balance().call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetEraContract = async () => {
    let era = 0;
    await DevelopersPoolContract.methods.currentContractEra().call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetEra = async (era: number) => {
    //@ts-ignore
    let eraInfo = [];
    await DevelopersPoolContract.methods.getEra(era).call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        eraInfo = res;
    })
//@ts-ignore
    return eraInfo;
}

export const CheckNextAprove = async (era: number) => {
    let eras = 0;
    await DevelopersPoolContract.methods.nextApproveIn(era).call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        eras = res;
    })
    return eras;
}

export const GetBalanceDeveloper = async (wallet: string) => {
    let balance = 0;
    await DevelopersPoolContract.methods.balanceOf(wallet).call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const GetDevelopers = async () => {
    //@ts-ignore
    let developersList = [];
    await DeveloperContract.methods.getDevelopers().call({from: developerContractAddress})
    //@ts-ignore
    .then((res) => {
        developersList = res;
    })
//@ts-ignore
    return developersList;
}

export const TokensPerEra = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.TOKENS_PER_ERA().call({from: developersPoolContractAddress})
    //@ts-ignore
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const WithdrawTokens = async (wallet: string) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await DeveloperContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!"
        }
    })
    //@ts-ignore
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
}

export async function currentContractEra(): Promise<number>{
    const response = await DevelopersPoolContract.methods.currentContractEra().call();
    return parseInt(response);
}

export async function currentContractEpoch(): Promise<number>{
    const response = await DevelopersPoolContract.methods.currentEpoch().call();
    return parseInt(response);
}

export async function tokensPerEra(currentEpoch: number, halving: number): Promise<number>{
    const response = await DevelopersPoolContract.methods.tokensPerEra(currentEpoch, halving).call();
    return Number(web3.utils.fromWei(response));
}

export async function nextEraIn(atualEra: number): Promise<number>{
    const response = await DevelopersPoolContract.methods.nextEraIn(atualEra).call();
    return parseInt(response);
}