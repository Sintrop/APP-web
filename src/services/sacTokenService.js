import Web3 from "web3";
import SacTokenContractJson from '../data/contracts/abis/SacToken.json';
const web3 = new Web3(window.ethereum);

//contract address
const SACTokenContractAddress = '0xF8033Bbfe9c645F52d170DDD733274371E75369F';

//initializing contract
const SACTokenContract = new web3.eth.Contract(SacTokenContractJson, SACTokenContractAddress);

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    await SACTokenContract.methods.certificate(wallet).call({from: SACTokenContractAddress})
    .then((res) => {
        tokens = res
    })
    .catch((err) => {
        tokens = 0
    })
    return tokens
}

export const BurnTokens = async (wallet, tokens) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SACTokenContract.methods.burnTokens(String(tokens)).send({from: wallet})
    .on("confirmation", (receipt) =>
        type = 'success',
        message = "Contributor registered!"
    )
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Contributor registered!"
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            return{
                type: 'error',
                message: 'Not allowed user!'
            }
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });

    return{
        type,
        message,
        hashTransaction,
    }
}