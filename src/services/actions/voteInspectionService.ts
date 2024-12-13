import { createPubliFeed } from "../publicationFeed";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { addInspectionValidation, getInspections } from "../web3/sintropService";

interface ExecuteAddInspectionValidationProps{
    additionalDataTransaction: string;
    walletConnected: string;
}
export interface AdditionalDataExecuteAddInspectionValidationProps{
    inspectionId: number;
    justification: string;
}
export async function executeAddValidationInspection(props: ExecuteAddInspectionValidationProps): Promise<ReturnTransactionProps>{
    const {additionalDataTransaction, walletConnected} = props;

    let additionalData = {} as AdditionalDataExecuteAddInspectionValidationProps;
    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const responseWeb3 = await addInspectionValidation({
        justification: additionalData.justification,
        inspectionId: additionalData.inspectionId,
        walletConnected,
    });
    if(responseWeb3.success){
        await afterAddInspectionValidation({
            additionalData,
            transactionHash: responseWeb3.transactionHash,
            walletConnected
        });
        return responseWeb3;
    }else{
        return responseWeb3;
    }
}

interface AfterAddInspectionValidationProps{
    walletConnected: string;
    transactionHash: string;
    additionalData: AdditionalDataExecuteAddInspectionValidationProps;
}
async function afterAddInspectionValidation(props: AfterAddInspectionValidationProps){
    const {additionalData, transactionHash, walletConnected} = props;

    await createPubliFeed({
        additionalData: JSON.stringify({
            justification: additionalData.justification,
            hash: transactionHash,
            inspectionId: additionalData.inspectionId
        }),
        type: "vote-invalidate-inspection",
        walletConnected
    })
}

export async function getHistoryInspectionsToVote(){
    const response = await getInspections();
    const historyInspectionsToVote = response.filter(item => item.status === '2');
    return historyInspectionsToVote;
}