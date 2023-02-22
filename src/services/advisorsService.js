import Web3 from "web3";
import AdvisorContractJson from  '../data/contracts/abis/AdvisorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const advisorContractAddress = AdvisorContractJson.networks[5777].address;

//initializing contract
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson.abi, advisorContractAddress);

class AdvisorsService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.advisorsContractAddress = advisorContractAddress;
    }

    async getAdvisorsRanking(){
        const advisors = await AdvisorContract.methods.getAdvisors().call()
        return advisors;
    }

    async getAdvisors(walletAdd){
        const advisors = await AdvisorContract.methods.getAdvisor(walletAdd).call()
        return advisors;
    }
}


export default AdvisorsService; 