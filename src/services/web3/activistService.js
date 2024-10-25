import { ActivistContract } from "./Contracts";
import { web3RequestWrite } from "./requestService";

export const GetActivist = async (wallet) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

export const GetActivists = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    return activists;
}

export async function addActivist(walletConnected, name, proofPhoto){
    const response = await web3RequestWrite(ActivistContract, 'addActivist', [name, proofPhoto], walletConnected);
    return response;
}

// export const OldAddActivist = async (wallet, name, proofPhoto) => {
//     let type = '';
//     let message = '';
//     let transactionHash = ''; 
//     let success = false;
//     await ActivistContract.methods.addActivist(name, proofPhoto)
//     .send({ from: wallet })
//     .on('transactionHash', hash => {
//         if(hash){
//             transactionHash = hash
//             type = 'success'
//             message = "Activist registered!"
//             success = true;
//         }
//     })
//     .on("error", (error, receipt) => {
//         message = error?.message
//         success = false;
//     })
        
//     return {
//         type, 
//         message,
//         transactionHash,
//         success
//     }
// }