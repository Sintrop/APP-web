import { getUserTypesCount } from "./web3/userService";

export const INSPECTOR_PROPORTIONALITY = 3;
export const ACTIVIST_PROPORTIONALITY = 2;
export const RESEARCHER_PROPORTIONALITY = 2;
export const DEVELOPER_PROPORTIONALITY = 2;
export const VALIDATOR_PROPORTIONALITY = 2;
export const CONTRIBUTOR_PROPORTIONALITY = 2;

export async function getProportionallity() {
    const count = await getUsersCount();

    const producers = count.producersCount;
    const inspectors = count.inspectorsCount;
    const developers = count.developersCount;
    const activists = count.activistsCount;
    const researchers = count.researchersCount;
    const validators = count.validatorsCount;
    const contributors = count.contributorsCount;

    const limitTotalInspectors = producers * INSPECTOR_PROPORTIONALITY;
    const limitTotalDevelopers = producers / DEVELOPER_PROPORTIONALITY;
    const limitTotalResearchers = producers / RESEARCHER_PROPORTIONALITY;
    const limitTotalActivists = producers / ACTIVIST_PROPORTIONALITY;
    const limitTotalContributors = producers / CONTRIBUTOR_PROPORTIONALITY;
    const limitTotalValidators = producers / VALIDATOR_PROPORTIONALITY;


    const calculoInspector = limitTotalInspectors - inspectors;
    const producerToInspectors = (limitTotalInspectors / producers) / 3;

    const calculoResearcher = limitTotalResearchers - researchers;
    const producerToResearchers = ((1 - calculoResearcher) / producers).toFixed(0);
        
    const calculoDeveloper = limitTotalDevelopers - developers;
    const producerToDevelopers = ((1 - calculoDeveloper) / producers).toFixed(0);
    
    const calculoActivist = limitTotalActivists - activists;
    const producerToActivists = ((1 - calculoActivist) / producers).toFixed(0);
        
    const calculoValidator = limitTotalValidators - validators;
    const producerToValidators = ((1 - calculoValidator) / producers).toFixed(0);

    const calculoContributor = limitTotalContributors - contributors;
    const producerToContributors = ((1 - calculoContributor) / producers).toFixed(0);
    
    return {
        avaliableVacancyInspector: calculoInspector >= 1 ? true : false,
        amountVacancyInspector: calculoInspector >= 1 ? Math.floor(calculoInspector) : Math.floor(producerToInspectors),
        avaliableVacancyResearcher: calculoResearcher >= 1 ? true : false,
        amountVacancyResearcher: calculoResearcher >= 1 ? Math.floor(calculoResearcher) : Math.floor(producerToResearchers),
        avaliableVacancyDeveloper: calculoDeveloper >= 1 ? true : false,
        amountVacancyDeveloper: calculoDeveloper >= 1 ? Math.floor(calculoDeveloper) : Math.floor(producerToDevelopers),
        avaliableVacancyActivist: calculoActivist >= 1 ? true : false,
        amountVacancyActivist: calculoActivist >= 1 ? Math.floor(calculoActivist) : Math.floor(producerToActivists),
        avaliableVacancyValidator: calculoValidator >= 1 ? true : false,
        amountVacancyValidator: calculoValidator >= 1 ? Math.floor(calculoValidator) : Math.floor(producerToValidators),
        avaliableVacancyContributor: calculoContributor >= 1 ? true : false,
        amountVacancyContributor: calculoContributor >= 1 ? Math.floor(calculoContributor) : Math.floor(producerToContributors)
    }
}

export async function getUsersCount(){
    const producers = await getUserTypesCount(1);
    const inspectors = await getUserTypesCount(2);
    const researchers = await getUserTypesCount(3);
    const developers = await getUserTypesCount(4);
    const contributors = await getUserTypesCount(5);
    const activists = await getUserTypesCount(6);
    const supporters = await getUserTypesCount(7);
    const validators = await getUserTypesCount(8);

    return {
        producersCount: producers,
        inspectorsCount: inspectors,
        researchersCount: researchers,
        developersCount: developers,
        contributorsCount: contributors,
        activistsCount: activists,
        supportersCount: supporters,
        validatorsCount: validators,
        totalCount: producers + inspectors + researchers + developers + contributors + activists + supporters + validators,
    }
}