import Web3 from "web3";
import CategoryContractJson from '../data/contracts/abis/CategoryContract.json';
import IsaPoolContractJson from '../data/contracts/abis/IsaPool.json';
const web3 = new Web3(window.ethereum);

//contract address
const categoryContractAddress = CategoryContractJson.networks[5777].address;
const isaPoolContractAddress = IsaPoolContractJson.networks[5777].address;

//initializing contract
const CategoryContract = new web3.eth.Contract(CategoryContractJson.abi, categoryContractAddress);
const IsaPoolContract = new web3.eth.Contract(IsaPoolContractJson.abi, isaPoolContractAddress);

export const Vote = async (id, tokens, walletAddress) => {
    await CategoryContract.methods.vote(parseInt(id), parseInt(tokens)).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const Unvote = async (idCategory, walletAddress) => {
    await CategoryContract.methods.unvote(idCategory).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const GetTokensBalance = async (walletAddress) => {
    let balance = '';
    await IsaPoolContract.methods.balanceOf(walletAddress).call({from: isaPoolContractAddress})
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const IsVoted = async (walletAddress, idCategory) => {
    let isVoted = '';
    await CategoryContract.methods.voted(walletAddress, idCategory).call({from: categoryContractAddress})
    .then((res) => {
        isVoted = res;
    })
    return isVoted;
}

export const GetTokensCategory = async (idCategory) => {
    let tokens = '';
    await CategoryContract.methods.votes(idCategory).call({from: categoryContractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}