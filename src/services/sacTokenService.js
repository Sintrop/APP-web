import Web3 from "web3";
import RcTokenContractJson from '../data/contracts/abis/RcToken.json';
const web3 = new Web3(window.ethereum);

//contract address
const RcTokenContractAddress = process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS;

//initializing contract
const RcTokenContract = new web3.eth.Contract(RcTokenContractJson, RcTokenContractAddress);

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    await RcTokenContract.methods.certificate(wallet).call({from: RcTokenContractAddress})
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
    await RcTokenContract.methods.burnTokens(String(tokens)).send({from: wallet})
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