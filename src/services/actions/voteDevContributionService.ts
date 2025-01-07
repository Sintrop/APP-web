import { ContributionProps } from "../../types/developer";
import { getContribution, getContributionsCount } from "../web3/developersService";
import { ReturnTransactionProps } from "../web3/rcTokenService";
import { addDeveloperContributionValidation } from "../web3/validatorService";

export async function getContributionsDev(): Promise<ContributionProps[]>{
    const contributionsCount = await getContributionsCount();

    let contributions = [];
    for(var i = 1; i <= contributionsCount; i++){
        const response = await getContribution(i);
        contributions.push(response);
    }

    return contributions.reverse();
}

interface AdditionalDataAddContributionValidationProps {
    justification: string;
    contribution: ContributionProps
}
interface ExecuteAddContributionValidationProps {
    additionalDataTransaction: string;
    walletConnected: string;
}
export async function executeAddContributionValidation(props: ExecuteAddContributionValidationProps): Promise<ReturnTransactionProps>{
    const {additionalDataTransaction, walletConnected} = props;

    let additionalData: AdditionalDataAddContributionValidationProps = {} as AdditionalDataAddContributionValidationProps;
    if(additionalDataTransaction){
        additionalData = JSON.parse(additionalDataTransaction);
    }

    const responseWeb3 = await addDeveloperContributionValidation({
        contribution: additionalData.contribution,
        justification: additionalData.justification,
        walletConnected
    });
    return responseWeb3;
}