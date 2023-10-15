import Web3 from "web3";
import SintropContractJson from  '../data/contracts/abis/Sintrop.json';
const web3 = new Web3(window.ethereum);

//contract address
const sintropContractAddress = process.env.REACT_APP_SINTROP_CONTRACT_ADDRESS

//initializing contract
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);

class InspectionsHistoryService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.sintropContractAddress = sintropContractAddress;
    }

    async getAllInspections(){
        const inspections = await SintropContract.methods.getInspections().call()
        return inspections;
    }
}

export const GetInspections = async () => {
    const inspections = await SintropContract.methods.getInspections().call()
    return inspections;
}

export default InspectionsHistoryService; 