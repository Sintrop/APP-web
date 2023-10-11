import Web3 from "web3";
import InvestorContractJson from  '../data/contracts/abis/InvestorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const investorContractAddress = '0x8014eef23614d357010685787690d3e7c2cfcc30';

//initializing contract
const InvestorContract = new web3.eth.Contract(InvestorContractJson, investorContractAddress);

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

export const GetInvestors = async () => {
    const investors = await InvestorContract.methods.getInvestors().call()
    return investors;
}

export const GetInvestor = async (walletAdd) => {
    const investor = await InvestorContract.methods.getInvestor(walletAdd).call()
    return investor;
}