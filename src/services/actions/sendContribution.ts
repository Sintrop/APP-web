import { createPubliFeed } from "../publicationFeed";
import { addContribution } from "../web3/developersService";

interface ReturnTransactionProps {
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

interface SendContributionProps {
    additionalDataTransaction: string;
    walletConnected: string;
}

interface AdditionalDataSendContributionProps{
    contributionHash: string;
}
export async function executeSendContribution({additionalDataTransaction, walletConnected}:SendContributionProps): Promise<ReturnTransactionProps> {
    let additionalData = {} as AdditionalDataSendContributionProps;

    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction)
    }

    const responseWeb3 = await addContribution({walletConnected, report: additionalData?.contributionHash});
    if(responseWeb3.success){
        await afterAddContribution({
            walletConnected, 
            contributionHash: additionalData?.contributionHash,
        });

        return responseWeb3;
    }else{
        return responseWeb3;
    }
}

interface AfterAddContributionProps{
    walletConnected: string;
    contributionHash: string;
}
async function afterAddContribution(props: AfterAddContributionProps){
    const {contributionHash, walletConnected} = props;

    await createPubliFeed({
        type: 'dev-report',
        walletConnected,
        additionalData: JSON.stringify({
            report: contributionHash,
        })
    });
}
