import { addContribution } from "../web3/contributorService";

interface ReturnTransactionProps {
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

interface AddContributorContribution {
    additionalDataTransaction: string;
    walletConnected: string;
}

interface AdditionalDataAddContributorContribution{
    contributionHash: string;
}
export async function executeAddContributorContribution({additionalDataTransaction, walletConnected}:AddContributorContribution): Promise<ReturnTransactionProps> {
    let additionalData = {} as AdditionalDataAddContributorContribution;

    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction)
    }

    const responseWeb3 = await addContribution({walletConnected, report: additionalData?.contributionHash});
    return responseWeb3;
}
