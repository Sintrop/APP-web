import Web3 from "web3";
import Activist from  '../data/contracts/abis/ActivistContract.json';
const ActivistContractAddress = Activist.networks[5777].address;
const web3js = new Web3(window.ethereum);
const ActivistContract = new web3js.eth.Contract(Activist.abi, ActivistContractAddress);

class ActivistService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.activistDataNetwork = Activist.networks["5777"];
        this.activistContractAddress = this.activistDataNetwork.address;
        this.activistABI = Activist.abi;
    }

    async getAtivistRanking(){
      if (this.activistContractAddress && this.activistDataNetwork) {
          const ActivistContract = new this.web3.eth.Contract(this.activistABI, this.activistContractAddress);
          const activists = await ActivistContract.methods.getActivists().call()
          return activists;
        } 
    }

    async getAtivist(walletAdd){
        if (this.activistContractAddress && this.activistDataNetwork) {
            const ActivistContract = new this.web3.eth.Contract(this.activistABI, this.activistContractAddress);
            const activist = await ActivistContract.methods.getActivist(walletAdd).call()
            return activist;
        } 
    }
}

export const GetActivist = async (wallet) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export default ActivistService; 