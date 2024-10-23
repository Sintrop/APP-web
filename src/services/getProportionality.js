import { api } from "./api";


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

    const limitTotalInspectors = producers * 3;
    const limitTotalDevelopers = producers;
    const limitTotalResearchers = producers / 2;
    const limitTotalActivists = producers / 2;
    const limitTotalContributors = producers / 2;
    const limitTotalValidators = producers / 5;


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
        amountVacancyInspector: calculoInspector >= 1 ? calculoInspector : Math.floor(producerToInspectors),
        avaliableVacancyResearcher: calculoResearcher >= 1 ? true : false,
        amountVacancyResearcher: calculoResearcher >= 1 ? calculoResearcher : Math.floor(producerToResearchers),
        avaliableVacancyDeveloper: calculoDeveloper >= 1 ? true : false,
        amountVacancyDeveloper: calculoDeveloper >= 1 ? calculoDeveloper : Math.floor(producerToDevelopers),
        avaliableVacancyActivist: calculoActivist >= 1 ? true : false,
        amountVacancyActivist: calculoActivist >= 1 ? calculoActivist : Math.floor(producerToActivists),
        avaliableVacancyValidator: calculoValidator >= 1 ? true : false,
        amountVacancyValidator: calculoValidator >= 1 ? calculoValidator : Math.floor(producerToValidators),
        avaliableVacancyContributor: calculoContributor >= 1 ? true : false,
        amountVacancyContributor: calculoContributor >= 1 ? calculoContributor : Math.floor(producerToContributors)
    }
}