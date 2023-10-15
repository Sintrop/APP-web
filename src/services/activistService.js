import Web3 from "web3";
import ActivistContractJson from  '../data/contracts/abis/ActivistContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const ActivistContractAddress = process.env.REACT_APP_ACTIVIST_CONTRACT_ADDRESS;

//Initializing contract
const ActivistContract = new web3.eth.Contract(ActivistContractJson, ActivistContractAddress);

class ActivistService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.activistContractAddress = ActivistContractAddress;
    }

    async getAtivistRanking(){
        const activists = await ActivistContract.methods.getActivists().call()
        return activists;
    }

    async getAtivist(walletAdd){
        const activist = await ActivistContract.methods.getActivist(walletAdd).call()
        return activist;
    }
}

export const GetActivist = async (wallet) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    return activists;
}

export default ActivistService; 