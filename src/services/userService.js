import Web3 from 'web3';
import UserContract from '../data/contracts/abis/UserContract.json';
const ContractAbi = UserContract.abi;
const ContractAddress = UserContract.networks[5777].address;
const web3js = new Web3(window.ethereum);
const contract = new web3js.eth.Contract(ContractAbi, ContractAddress)

export const AddDelation = async (informed, reported, title, testemony, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await contract.methods.addDelation(reported, title, testemony, proofPhoto).send({from: informed})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "User successfully reported!"
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

export const GetDelation = async (wallet) => {
    let delations = []
    await contract.methods.getUserDelations(wallet).call({from: ContractAddress})
    .then((res) => {
        delations = res;
    })
    return delations;
}