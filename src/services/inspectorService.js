import Web3 from "web3";
import InspectorContractJson from  '../data/contracts/abis/InspectorContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const InspectorContractAddress = process.env.REACT_APP_INSPECTOR_CONTRACT_ADDRESS;

//Initializing contract
const InspectorContract = new web3.eth.Contract(InspectorContractJson, InspectorContractAddress);

export const GetInspector = async (wallet) => {
    const inspector = await InspectorContract.methods.getInspector(wallet).call();
    return inspector
}

export const GetInspectors = async () => {
    const inspectors = await InspectorContract.methods.getInspectors().call()
    console.log(inspectors);
    return inspectors;
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InspectorContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!"
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