import { DevelopersPoolContract } from "./web3/Contracts";
import { DeveloperContract } from "./web3/Contracts";
import { developerContractAddress } from "./web3/Contracts";
import { developersPoolContractAddress } from "./web3/Contracts";

export const GetBalancePool = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.balance().call({from: developersPoolContractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetEraContract = async () => {
    let era = 0;
    await DevelopersPoolContract.methods.currentContractEra().call({from: developersPoolContractAddress})
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetEra = async (era) => {
    let eraInfo = [];
    await DevelopersPoolContract.methods.getEra(era).call({from: developersPoolContractAddress})
    .then((res) => {
        eraInfo = res;
    })

    return eraInfo;
}

export const CheckNextAprove = async (era) => {
    let eras = 0;
    await DevelopersPoolContract.methods.nextApproveIn(era).call({from: developersPoolContractAddress})
    .then((res) => {
        eras = res;
    })
    return eras;
}

export const GetBalanceDeveloper = async (wallet) => {
    let balance = 0;
    await DevelopersPoolContract.methods.balanceOf(wallet).call({from: developersPoolContractAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const GetDevelopers = async () => {
    let developersList = [];
    await DeveloperContract.methods.getDevelopers().call({from: developerContractAddress})
    .then((res) => {
        developersList = res;
    })

    return developersList;
}

export const TokensPerEra = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.TOKENS_PER_ERA().call({from: developersPoolContractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await DeveloperContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!"
        }
    })
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
}