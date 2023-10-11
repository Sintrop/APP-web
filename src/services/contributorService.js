import Web3 from "web3";
import ContributorContractJson from  '../data/contracts/abis/ContributorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const contributorContractAddress = '0xf1790104904127901ea3dda4b95deb215764023f';

//initializing contract
const ContributorContract = new web3.eth.Contract(ContributorContractJson, contributorContractAddress);

class ContributorsService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.contributorContractAddress = contributorContractAddress;
    }

    async getContributorsRanking(){
        const contributors = await ContributorContract.methods.getContributors().call()
        return contributors;
    }
}


export default ContributorsService; 

export const GetContributor = async(walletAdd) => {
    const contributors = await ContributorContract.methods.getContributor(walletAdd).call()
    return contributors;
}