import Web3 from "web3";
import Researchers from  '../data/contracts/abis/ResearcherContract.json';
class ResearchersService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.researchersDataNetwork = Researchers.networks["5777"];
        this.researchersContractAddress = this.researchersDataNetwork.address;
        this.researchersABI = Researchers.abi;
    }

    async getResearcherRanking(){
      if (this.researchersContractAddress && this.researchersDataNetwork) {
          const ResearchersContract = new this.web3.eth.Contract(this.researchersABI, this.researchersContractAddress);
          const researchers = await ResearchersContract.methods.getResearchers().call()
          return researchers;
        } 
    }

    async getResearchers(walletAdd){
        if (this.researchersContractAddress && this.researchersDataNetwork) {
            const ResearchersContract = new this.web3.eth.Contract(this.researchersABI, this.researchersContractAddress);
            const researchers = await ResearchersContract.methods.getResearcher(walletAdd).call()
            return researchers;
        } 
    }
}


export default ResearchersService; 