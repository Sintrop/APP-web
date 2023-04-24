import Web3 from "web3";
import DeveloperContractJson from  '../data/contracts/abis/DeveloperContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const developerContractAddress = DeveloperContractJson.networks[5777].address;

//initializing contract
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson.abi, developerContractAddress);

class DevelopersService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.developerContractAddress = developerContractAddress;
    }

    async getDeveloperRanking(){
        const developers = await DeveloperContract.methods.getDevelopers().call()
        return developers;
    }
}

export default DevelopersService; 

export const GetDeveloper = async (walletAdd) => {
    const developers = await DeveloperContract.methods.getDeveloper(walletAdd).call()
    return developers;
}