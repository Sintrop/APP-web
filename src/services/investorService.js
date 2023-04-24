import Web3 from "web3";
import InvestorContractJson from  '../data/contracts/abis/InvestorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const investorContractAddress = InvestorContractJson.networks[5777].address;

//initializing contract
const InvestorContract = new web3.eth.Contract(InvestorContractJson.abi, investorContractAddress);

class InvestorService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.investorContractAddress = investorContractAddress;
    }

    async getInvestorRanking(){
        const investors = await InvestorContract.methods.getInvestors().call()
        return investors;
    }
}


export default InvestorService; 

export const GetInvestor = async (walletAdd) => {
    const investor = await InvestorContract.methods.getInvestor(walletAdd).call()
    return investor;
}