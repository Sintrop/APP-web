import Web3 from 'web3';
import DevelopersPoolContract from '../data/contracts/abis/DeveloperPool.json';
import DeveloperContract from '../data/contracts/abis/DeveloperContract.json';
import SacTokenContract from '../data/contracts/abis/SacToken.json';

export const GetBalancePool = async () => {
    let tokens = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.balance().call({from: contractAddress})
    .then((res) => {
        tokens = res;
    })

    return tokens;
}

export const GetEraContract = async () => {
    let era = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.currentContractEra().call({from: contractAddress})
    .then((res) => {
        era = res;
    })

    return era;
}

export const GetEra = async (era) => {
    let eraInfo = [];
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.getEra(era).call({from: contractAddress})
    .then((res) => {
        eraInfo = res;
    })

    return eraInfo;
}

export const CheckNextAprove = async (era) => {
    let eras = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.nextApproveIn(era).call({from: contractAddress})
    .then((res) => {
        eras = res;
    })

    return eras;
}

export const CheckAllowanceTokens = async (wallet) => {
    let tokensAllowed = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.allowance().call({from: wallet})
    .then((res) => {
        tokensAllowed = res;
    })

    return tokensAllowed;
}

export const GetBalanceDeveloper = async (wallet) => {
    let balance = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.balanceOf(wallet).call({from: contractAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const AproveTokens = async (wallet) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperContract.abi, contractAddress);
    await contract.methods.approve().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const GetDevelopers = async () => {
    let developersList = [];
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperContract.abi, contractAddress);
    await contract.methods.getDevelopers().call({from: contractAddress})
    .then((res) => {
        developersList = res;
    })

    return developersList;
}

export const TokensPerEra = async () => {
    let tokens = 0;
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    await contract.methods.TOKENS_PER_ERA().call({from: contractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const WithdrawTokens = async (wallet, level, currentEra) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DeveloperContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DeveloperContract.abi, contractAddress);
    contract.methods.withdraw().send({from: wallet})
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err
    })
}

export const WithdrawTokens1 = async (wallet, level, currentEra) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = DevelopersPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(DevelopersPoolContract.abi, contractAddress);
    contract.methods.withdraw(wallet, level, currentEra).call({from: contractAddress})
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    })
}