import Web3 from "web3";
import CategoryContract from '../data/contracts/abis/CategoryContract.json';
import IsaPoolContract from '../data/contracts/abis/IsaPool.json';

export const Vote = async (id, tokens, walletAddress) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = CategoryContract.networks[5777].address;
    const contract = new web3js.eth.Contract(CategoryContract.abi, contractAddress);
    await contract.methods.vote(parseInt(id), parseInt(tokens)).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const Unvote = async (idCategory, walletAddress) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = CategoryContract.networks[5777].address;
    const contract = new web3js.eth.Contract(CategoryContract.abi, contractAddress);
    await contract.methods.unvote(idCategory).send({from: walletAddress})
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
    const web3js = new Web3(window.ethereum);
    const contractAddress = IsaPoolContract.networks[5777].address;
    const contract = new web3js.eth.Contract(IsaPoolContract.abi, contractAddress);
    await contract.methods.balanceOf(walletAddress).call({from: contractAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const IsVoted = async (walletAddress, idCategory) => {
    let isVoted = '';
    const web3js = new Web3(window.ethereum);
    const contractAddress = CategoryContract.networks[5777].address;
    const contract = new web3js.eth.Contract(CategoryContract.abi, contractAddress);
    await contract.methods.voted(walletAddress, idCategory).call({from: contractAddress})
    .then((res) => {
        isVoted = res;
    })

    return isVoted;
}