import Web3 from 'web3';
import UserContract from '../data/contracts/abis/UserContract.json';
const ContractAbi = UserContract.abi;
const ContractAddress = UserContract.networks[5777].address;
const web3js = new Web3(window.ethereum);
const contract = new web3js.eth.Contract(ContractAbi, ContractAddress)

export const AddDelation = async (informed, reported, title, testemony, proofPhoto) => {
    await contract.methods.addDelation(reported, title, testemony, proofPhoto).send({from: informed})
    .on('transactionHash', (hash) => {
        if(hash){
            return hash;
        }else{
            return false;
        }
    })
}

export const GetDelation = async (wallet) => {
    await contract.methods.getUserDelations(wallet).call({from: ContractAddress})
    .then((res) => {
        console.log(res)
    })
}