import { InvitationContract } from "./web3/Contracts";

export const Invite = async (walletAddress, walletInvite, userType) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InvitationContract.methods.invite(walletInvite, userType)
    .send({ from: walletAddress })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Invited"
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            type = 'error'
            message = 'Not allowed user!'
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    })
        
    return {
        type, 
        message,
        hashTransaction
    }
}