import { createPubliFeed } from "../publicationFeed";
import { web3 } from "../web3/Contracts";
import { invite, lastInviteBlocks } from "../web3/invitationService";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { getInvitations, getUser } from "../web3/userService";

interface ExecuteInviteUserProps{
    walletConnected: string;
    additionalDataTransaction: string;
}

interface AdditionalDataInviteUserProps{
    walletToInvite: string;
    userTypeToInvite: number;
}

export async function executeInviteUser(props: ExecuteInviteUserProps): Promise<ReturnTransactionProps>{
    const {additionalDataTransaction, walletConnected} = props;

    let additionalData = {} as AdditionalDataInviteUserProps;

    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const responseWeb3 = await invite({
        walletConnected,
        userTypeToInvite: additionalData.userTypeToInvite,
        walletToInvite: additionalData.walletToInvite,
    });
    if(responseWeb3.success){
        await afteInviteUser({
            additionalData,
            transactionHash: responseWeb3.transactionHash,
            walletConnected
        });

        return responseWeb3;
    }else{
        return responseWeb3;
    }
}

interface AfterInviteUserProps{
    walletConnected: string;
    additionalData: AdditionalDataInviteUserProps;
    transactionHash: string;
}
async function afteInviteUser(props: AfterInviteUserProps) {
    const {additionalData, walletConnected, transactionHash} = props;

    await createPubliFeed({
        walletConnected,
        type: 'invite-wallet',
        additionalData: JSON.stringify({
            hash: transactionHash,
            walletInvited: additionalData?.walletToInvite,
            userType: additionalData?.userTypeToInvite,
        }),
    })
}

interface CheckCanInviteProps{
    walletConnected: string;
}
interface ReturnCheckCanInviteProps{
    canInvite: boolean;
    blocksToNextInvite?: number;
}
export async function checkCanInvite({walletConnected}: CheckCanInviteProps): Promise<ReturnCheckCanInviteProps>{
    const delayBlocks = process.env.REACT_APP_INVITATION_DELAY_BLOCKS;
    const atualBlock = await web3.eth.getBlockNumber();
    const lastInvite = await lastInviteBlocks(walletConnected);
    const nextInvite = Number(lastInvite) + Number(delayBlocks);
    
    if(nextInvite < atualBlock){
        return {
            canInvite: true,
        }
    }else{
        return {
            canInvite: false,
            blocksToNextInvite: nextInvite - atualBlock,
        }
    }
}

interface CheckAvailableToInviteProps{
    walletToInvite: string;
}
interface ReturnCheckAvailableToInvite{
    canInvite: boolean;
    message: string;
}
export async function checkAvailableToInvite({walletToInvite}: CheckAvailableToInviteProps): Promise<ReturnCheckAvailableToInvite>{
    const validWallet = web3.utils.isAddress(walletToInvite);
    if(!validWallet){
        return {
            canInvite: false,
            message: 'wallet not valid'
        }
    }

    const checkUserExists = await getUser(walletToInvite);
    if(checkUserExists !== 0){
        return {
            canInvite: false,
            message: 'user already exists'
        }
    }

    const checkInviteExists = await getInvitations(walletToInvite);
    if(checkInviteExists.userType !== '0'){
        return {
            canInvite: false,
            message: 'wallet invited'
        }
    }

    return {
        canInvite: true,
        message: ''
    }
}