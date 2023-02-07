import Web3 from "web3";
import SacTokenContract from '../data/contracts/abis/SacToken.json';
const contractAddress = SacTokenContract.networks[5777].address;
const contractAbi = SacTokenContract.abi;

export const GetCertificateTokens = async (wallet) => {
    let tokens = 0
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.certificate(wallet).call({from: contractAddress})
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

    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.burnTokens(String(tokens)).send({from: wallet})
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