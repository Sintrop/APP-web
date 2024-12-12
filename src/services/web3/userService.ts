import { InvitationProps } from "../../types/user";
import { UserContract } from "./Contracts";
import { userContractAddress } from "./Contracts";

//@ts-ignore
export const AddDelation = async (informed, reported, title, testemony, proofPhoto) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await UserContract.methods.addDelation(reported, title, testemony, proofPhoto).send({from: informed})
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "User successfully reported!"
        }
    })
    //@ts-ignore
    .on("error", (error, receipt) => {
        console.log(error)
    })

    return {
        type, 
        message,
        hashTransaction
    }
}

export const GetDelation = async (wallet: string) => {
    //@ts-ignore
    let delations = []
    await UserContract.methods.getUserDelations(wallet).call({from: userContractAddress})
    //@ts-ignore
    .then((res) => {
        delations = res;
    })
    //@ts-ignore
    return delations;
}

export async function getInvitations(wallet: string): Promise<InvitationProps>{
    const response = await UserContract.methods.invitations(wallet).call();
    return response;
}

export async function getUser(wallet: string){
    const response = await UserContract.methods.getUser(wallet).call();
    return parseInt(response)
}