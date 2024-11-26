import { api } from "./api";

export const INSPECTOR_PROPORTIONALITY = 3;
export const ACTIVIST_PROPORTIONALITY = 2;
export const RESEARCHER_PROPORTIONALITY = 2;
export const DEVELOPER_PROPORTIONALITY = 1;
export const VALIDATOR_PROPORTIONALITY = 5;
export const CONTRIBUTOR_PROPORTIONALITY = 1;

export async function getProportionallity() {
    let producers = 0;
    let inspectors = 0;
    let developers = 0;
    let activists = 0;
    let researchers = 0;
    let validators = 0;
    let contributors = 0;

    const response = await api.get('/users_count');
    if (response.data) {
        const count = response.data;
        producers = Number(count?.producersCount);
        inspectors = Number(count?.inspectorsCount);
        developers = Number(count?.developersCount);
        researchers = Number(count?.researchersCount);
        validators = Number(count?.validatorsCount);
        activists = Number(count?.activistsCount);
        contributors = Number(count.contributorsCount);
    }

    const limitTotalInspectors = producers * INSPECTOR_PROPORTIONALITY;
    const limitTotalDevelopers = producers * DEVELOPER_PROPORTIONALITY;
    const limitTotalResearchers = producers / RESEARCHER_PROPORTIONALITY;
    const limitTotalActivists = producers / ACTIVIST_PROPORTIONALITY;
    const limitTotalContributors = producers / CONTRIBUTOR_PROPORTIONALITY;
    const limitTotalValidators = producers / VALIDATOR_PROPORTIONALITY;


    const calculoInspector = limitTotalInspectors - inspectors;
    const producerToInspectors = (limitTotalInspectors / producers) / 3;

    const calculoResearcher = limitTotalResearchers - researchers;
    const producerToResearchers = ((1 - calculoResearcher) / 0.2).toFixed(0);
        
    const calculoDeveloper = limitTotalDevelopers - developers;
    const producerToDevelopers = ((1 - calculoDeveloper) / 0.2).toFixed(0);
    
    const calculoActivist = limitTotalActivists - activists;
    const producerToActivists = ((1 - calculoActivist) / 0.1).toFixed(0);
        
    const calculoValidator = limitTotalValidators - validators;
    const producerToValidators = ((1 - calculoValidator) / 0.1).toFixed(0);

    const calculoContributor = limitTotalContributors - contributors;
    const producerToContributors = ((1 - calculoContributor) / 0.1).toFixed(0);
    
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