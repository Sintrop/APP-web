import Web3 from 'web3';
import DevelopersPoolJson from '../data/contracts/abis/DeveloperPool.json';
import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const developerContractAddress = DeveloperContractJson.networks[5777].address;
const developersPoolAddress = DevelopersPoolJson.networks[5777].address;

//initializing contract
const DevelopersPoolContract = new web3.eth.Contract(DevelopersPoolJson.abi, developersPoolAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson.abi, developerContractAddress);

export const GetBalancePool = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.balance().call({from: developersPoolAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetEraContract = async () => {
    let era = 0;
    await DevelopersPoolContract.methods.currentContractEra().call({from: developersPoolAddress})
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetEra = async (era) => {
    let eraInfo = [];
    await DevelopersPoolContract.methods.getEra(era).call({from: developersPoolAddress})
    .then((res) => {
        eraInfo = res;
    })

    return eraInfo;
}

export const CheckNextAprove = async (era) => {
    let eras = 0;
    await DevelopersPoolContract.methods.nextApproveIn(era).call({from: developersPoolAddress})
    .then((res) => {
        eras = res;
    })
    return eras;
}

export const CheckAllowanceTokens = async (wallet) => {
    let tokensAllowed = 0;
    await DevelopersPoolContract.methods.allowance().call({from: wallet})
    .then((res) => {
        tokensAllowed = res;
    })
    return tokensAllowed;
}

export const GetBalanceDeveloper = async (wallet) => {
    let balance = 0;
    await DevelopersPoolContract.methods.balanceOf(wallet).call({from: developersPoolAddress})
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
    await DevelopersPoolContract.methods.TOKENS_PER_ERA().call({from: developersPoolAddress})
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