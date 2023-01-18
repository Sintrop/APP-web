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
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(contractAbi, contractAddress);
    await contract.methods.burnTokens(String(tokens)).send({from: wallet})
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return false;
    });
}