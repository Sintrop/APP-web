import Web3 from "web3";
import Advisors from  '../data/contracts/abis/AdvisorContract.json';
class AdvisorsService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.advisorsDataNetwork = Advisors.networks["5777"];
        this.advisorsContractAddress = this.advisorsDataNetwork.address;
        this.advisorsABI = Advisors.abi;
    }

    async getAdvisorsRanking(){
      if (this.advisorsContractAddress && this.advisorsDataNetwork) {
          const advisorsContract = new this.web3.eth.Contract(this.advisorsABI, this.advisorsContractAddress);
          const advisors = await advisorsContract.methods.getAdvisors().call()
          return advisors;
        } 
    }

    async getAdvisors(walletAdd){
        if (this.advisorsContractAddress && this.advisorsDataNetwork) {
            const advisorsContract = new this.web3.eth.Contract(this.advisorsABI, this.advisorsContractAddress);
            const advisors = await advisorsContract.methods.getAdvisor(walletAdd).call()
            return advisors;
        } 
    }
}


export default AdvisorsService; 