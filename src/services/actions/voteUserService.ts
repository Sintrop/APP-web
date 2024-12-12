import { createPubliFeed } from "../publicationFeed";
import { GetProducers } from "../web3/producerService";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { addValidation } from "../web3/validatorService";

interface ExecuteVoteUserProps{
    additionalDataTransaction: string;
    walletConnected: string;
}
export interface AdditionalDataExecuteVoteUserProps{
    walletToVote: string;
    justification: string;
}
export async function executeVoteUser(props: ExecuteVoteUserProps): Promise<ReturnTransactionProps>{
    const {additionalDataTransaction, walletConnected} = props;

    let additionalData = {} as AdditionalDataExecuteVoteUserProps;
    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const responseWeb3 = await addValidation({
        justification: additionalData.justification,
        walletToVote: additionalData.walletToVote,
        walletConnected,
    });
    if(responseWeb3.success){
        await afterAddUserValidation({
            additionalData,
            transactionHash: responseWeb3.transactionHash,
            walletConnected
        });
        return responseWeb3;
    }else{
        return responseWeb3;
    }
}

interface AfterUserValidationProps{
    walletConnected: string;
    transactionHash: string;
    additionalData: AdditionalDataExecuteVoteUserProps;
}
async function afterAddUserValidation(props: AfterUserValidationProps){
    const {additionalData, transactionHash, walletConnected} = props;

    await createPubliFeed({
        additionalData: JSON.stringify({
            justification: additionalData.justification,
            hash: transactionHash,
            walletToVote: additionalData.walletToVote
        }),
        type: "vote-invalidate-user",
        walletConnected
    })
}

export async function getUsers(userType: number){
    if(userType === 1){
        const responseProducers = await GetProducers();
        return responseProducers;
    }

    return [];
}