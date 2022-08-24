import Web3 from "web3";
import Investor from  '../data/contracts/abis/InvestorContract.json';
class InvestorService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.investorDataNetwork = Investor.networks["5777"];
        this.investorContractAddress = this.investorDataNetwork.address;
        this.investorABI = Investor.abi;
    }

    async getInvestorRanking(){
      if (this.investorContractAddress && this.investorDataNetwork) {
          const InvestorContract = new this.web3.eth.Contract(this.investorABI, this.investorContractAddress);
          const investors = await InvestorContract.methods.getInvestors().call()
          return investors;
        } 
    }

    async getInvestor(walletAdd){
        if (this.investorContractAddress && this.investorDataNetwork) {
            const InvestorContract = new this.web3.eth.Contract(this.investorABI, this.investorContractAddress);
            const investor = await InvestorContract.methods.getInvestor(walletAdd).call()
            return investor;
        } 
    }
}



export default InvestorService; 