import Web3 from "web3";
import Contributor from  '../data/contracts/abis/ContributorContract.json';
class ContributorsService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.contributorDataNetwork = Contributor.networks["5777"];
        this.contributorContractAddress = this.contributorDataNetwork.address;
        this.contributorABI = Contributor.abi;
    }

    async getContributorsRanking(){
      if (this.contributorContractAddress && this.contributorDataNetwork) {
          const ContributorContract = new this.web3.eth.Contract(this.contributorABI, this.contributorContractAddress);
          const contributors = await ContributorContract.methods.getContributors().call()
          return contributors;
        } 
    }

    async getContributors(walletAdd){
        if (this.contributorContractAddress && this.contributorDataNetwork) {
            const ContributorContract = new this.web3.eth.Contract(this.contributorABI, this.contributorContractAddress);
            const contributors = await ContributorContract.methods.getContributor(walletAdd).call()
            return contributors;
        } 
    }
}


export default ContributorsService; 