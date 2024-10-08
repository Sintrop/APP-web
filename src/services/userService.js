import Web3 from 'web3';
import UserContractJson from '../data/contracts/abis/UserContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS;

//initializing contract
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress)

export const AddDelation = async (informed, reported, title, testemony, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await UserContract.methods.addDelation(reported, title, testemony, proofPhoto).send({from: informed})
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
    await UserContract.methods.getUserDelations(wallet).call({from: userContractAddress})
    .then((res) => {
        delations = res;
    })
    return delations;
}