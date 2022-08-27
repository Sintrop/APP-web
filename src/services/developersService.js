import Web3 from "web3";
import Developer from  '../data/contracts/abis/DeveloperContract.json';
class DevelopersService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.developerDataNetwork = Developer.networks["5777"];
        this.developerContractAddress = this.developerDataNetwork.address;
        this.developerABI = Developer.abi;
    }

    async getDeveloperRanking(){
      if (this.developerContractAddress && this.developerDataNetwork) {
          const DeveloperContract = new this.web3.eth.Contract(this.developerABI, this.developerContractAddress);
          const developers = await DeveloperContract.methods.getDevelopers().call()
          return developers;
        } 
    }

    async getDeveloper(walletAdd){
        if (this.developerContractAddress && this.developerDataNetwork) {
            const DeveloperContract = new this.web3.eth.Contract(this.developerABI, this.developerContractAddress);
            const developers = await DeveloperContract.methods.getDeveloper(walletAdd).call()
            return developers;
        } 
    }
}



export default DevelopersService; 