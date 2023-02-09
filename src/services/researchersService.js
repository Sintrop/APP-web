import Web3 from "web3";
import Researchers from  '../data/contracts/abis/ResearcherContract.json';
const ResearchersContractAddress = Researchers.networks[5777].address;
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

export const PublishResearch = async (walletAddress, title, thesis, filePath) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(Researchers.abi, ResearchersContractAddress);
    await contract.methods.addWork(title, thesis, filePath).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Published research!"
        }
    })
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
} 

export const GetResearches = async () => {
    let researches = [];
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(Researchers.abi, ResearchersContractAddress);
    await contract.methods.getWorks().call({from: ResearchersContractAddress})
    .then(res => {
        researches = res;
    })
    .catch(err => {
        console.log(err);
    })
    return researches;
} 
