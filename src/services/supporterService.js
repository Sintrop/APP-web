import Web3 from "web3";
import SupporterContractJson from  '../data/contracts/abis/SupporterContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const supporterContractAddress = process.env.REACT_APP_SUPPORTER_CONTRACT_ADDRESS

//initializing contract
const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);

export const GetSupporters = async () => {
    const supporters = await SupporterContract.methods.getSupporters().call();
    return supporters;
}

export const GetSupporter = async (walletAdd) => {
    const investor = await SupporterContract.methods.getSupporter(walletAdd).call()
    return investor;
}

export const addSupporter = async (wallet, name) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await SupporterContract.methods.addSupporter(name)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Supporter registered!"
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            type = 'error'
            message = 'Not allowed user!'
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });
        
    return {
        type, 
        message,
        hashTransaction
    }
}