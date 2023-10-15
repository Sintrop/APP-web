import Web3 from "web3";
import InspectorContractJson from  '../data/contracts/abis/InspectorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const inspectorContractAddress = process.env.REACT_APP_ACTIVIST_CONTRACT_ADDRESS;

//Initializing contract
const InspectorContract = new web3.eth.Contract(InspectorContractJson, inspectorContractAddress);

export const GetActivist = async (wallet) => {
    const activist = await InspectorContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await InspectorContract.methods.getActivists().call()
    return activists;
}

export default ActivistService; 