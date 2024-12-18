import { ContributionProps } from "../../types/developer";
import { getContribution, getContributionsCount } from "../web3/developersService";

export async function getContributionsDev(): Promise<ContributionProps[]>{
    const contributionsCount = await getContributionsCount();

    let contributions = [];
    for(var i = 1; i <= contributionsCount; i++){
        const response = await getContribution(i);
        contributions.push(response);
    }

    return contributions.reverse();
}