import { createPubliFeed } from "../publicationFeed";
import { invite } from "../web3/invitationService";
import { ReturnTransactionProps } from "../web3/rcTokenService";

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