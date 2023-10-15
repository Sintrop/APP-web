import Web3 from "web3";
import SupporterContractJson from  '../data/contracts/abis/SupporterContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const supporterContractAddress = process.env.REACT_APP_SUPPORTER_CONTRACT_ADDRESS

//initializing contract
const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);

class InvestorService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.investorContractAddress = supporterContractAddress;
    }

    async getInvestorRanking(){
        const investors = await SupporterContract.methods.getSupporters().call()
        return investors;
    }
}


export default InvestorService; 

export const GetSupporters = async () => {
    const investors = await SupporterContract.methods.getSupporters().call()
    return investors;
}

export const GetSupporter = async (walletAdd) => {
    const investor = await SupporterContract.methods.getSupporter(walletAdd).call()
    return investor;
}