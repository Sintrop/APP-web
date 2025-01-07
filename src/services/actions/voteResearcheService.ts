import { ResearcheProps } from "../../types/researche";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { getWorks } from "../web3/researchersService";
import { addResearcheWorkValidation } from "../web3/validatorService";

export async function getResearches(): Promise<ResearcheProps[]>{
    const response = await getWorks();
    return response;
}

interface AdditionalDataAddWorkValidationProps {
    justification: string;
    researche: ResearcheProps;
}
interface ExecuteAddWorkValidationProps {
    additionalDataTransaction: string;
    walletConnected: string;
}
export async function executeAddWorkValidation(props: ExecuteAddWorkValidationProps): Promise<ReturnTransactionProps>{
    const {additionalDataTransaction, walletConnected} = props;

    let additionalData: AdditionalDataAddWorkValidationProps = {} as AdditionalDataAddWorkValidationProps;
    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const responseWeb3 = await addResearcheWorkValidation({
        researche: additionalData.researche,
        justification: additionalData.justification,
        walletConnected
    });
    return responseWeb3;
}