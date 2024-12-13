import { SupporterProps } from "../../types/supporter";
import { SupporterContract } from "./Contracts";
import { web3 } from "./Contracts";
import { ReturnTransactionProps } from "./rcTokenService";
import { web3RequestWrite } from "./requestService";

export const GetSupporters = async () => {
    const supporters = await SupporterContract.methods.getSupporters().call();
    return supporters;
}

export async function getSupporters(){
    const supporters = await SupporterContract.methods.getSupporters().call();

    let newArray = [];
    for (var i = 0; i < supporters.length; i++) {
        const data = {
            ...supporters[i],
            userType: 7
        };
        newArray.push(data);
    }

    return newArray as SupporterProps[];
}

//@ts-ignore
export const GetSupporter = async (walletAdd) => {
    const investor = await SupporterContract.methods.getSupporter(walletAdd).call()
    return investor;
}

//@ts-ignore
export const addSupporter = async (wallet, name) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await SupporterContract.methods.addSupporter(name)
    .send({ from: wallet })
    //@ts-ignore
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Supporter registered!"
        }
    })
    //@ts-ignore
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            type = 'error'
            message = 'Not allowed user!'
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });
        
    return {
        type, 
        message,
        hashTransaction
    }
}

export async function BurnTokens(value: number, wallet: string): Promise<ReturnTransactionProps> {
    const valueWei = web3.utils.toWei(String(value), 'ether');
    const response = await web3RequestWrite(SupporterContract, 'burnTokens', [valueWei], wallet);
    return response;
}

// export const BurnTokens = async (wallet, tokens) => {
//     let type = '';
//     let message = '';
//     let hashTransaction = ''; 
//     await SupporterContract.methods.burnTokens(tokens)
//     .send({ from: wallet })
//     .on('transactionHash', hash => {
//         if(hash){
//             hashTransaction = hash
//             type = 'success'
//             message = "Burned tokens"
//         }
//     })
//     .on("error", (error, receipt) => {
//         if(error.stack.includes("Not allowed user")){
//             type = 'error'
//             message = 'Not allowed user!'
//         }
//         if (error.stack.includes("User already exists")){
//             type = 'error'
//             message = 'User already exists'
//         }
//     });
        
//     return {
//         type, 
//         message,
//         hashTransaction
//     }
// }