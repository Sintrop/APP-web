import Web3 from "web3";
import AdvisorContractJson from  '../data/contracts/abis/AdvisorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const advisorContractAddress = process.env.REACT_APP_ADVISOR_CONTRACT_ADDRESS;

//initializing contract
const AdvisorContract = new web3.eth.Contract(AdvisorContractJson, advisorContractAddress);

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

    
}


export default AdvisorsService; 

export const GetAdvisor = async (walletAdd) => {
    const advisors = await AdvisorContract.methods.getAdvisor(walletAdd).call()
    return advisors;
}