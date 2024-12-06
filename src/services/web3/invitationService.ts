import { InvitationContract } from "./Contracts";
import { ReturnTransactionProps } from "./rcTokenService";
import { web3RequestWrite } from "./requestService";

interface InviteProps{
    walletConnected: string;
    userTypeToInvite: number;
    walletToInvite: string;
}
export async function invite(props: InviteProps): Promise<ReturnTransactionProps>{
    const {userTypeToInvite, walletConnected, walletToInvite} = props;
    const response = await web3RequestWrite(InvitationContract, 'invite', [walletToInvite, userTypeToInvite], walletConnected);
    return response;
}

export const Invite = async (walletAddress: string, walletInvite: string, userType: number) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InvitationContract.methods.invite(walletInvite, userType)
    .send({ from: walletAddress })
    .on('transactionHash', (hash: string) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Invited"
        }
    })
    //@ts-ignore
    .on("error", (error) => {
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