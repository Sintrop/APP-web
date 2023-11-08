import Web3 from 'web3';
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
const web3 = new Web3(window.ethereum);

//contract address
const sintropContractAddress = process.env.REACT_APP_SINTROP_CONTRACT_ADDRESS

//initializing contract
const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);

export const InvalidateInspection = async (walletAddress, inspectionID, justification) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await SintropContract.methods.addInspectionValidation(inspectionID, justification).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Vote Ok!"
        }
    })
    .on("error", (error, receipt) => {
        console.log(receipt);
    })
    return {
        type, 
        message,
        hashTransaction
    }
}