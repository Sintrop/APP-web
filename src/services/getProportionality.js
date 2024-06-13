import { api } from "./api";


export async function getProportionallity(typeUser) {
    let producers = 0;
    let inspectors = 0;
    let developers = 0;
    let activists = 0;
    let researchers = 0;
    let validators = 0;

    const response = await api.get('/users_count');
    if (response.data) {
        const count = response.data;
        producers = Number(count?.producersCount);
        inspectors = Number(count?.inspectorsCount);
        developers = Number(count?.developersCount);
        researchers = Number(count?.researchersCount);
        validators = Number(count?.validatorsCount);
        activists = Number(count?.activistsCount);
    }

    const limitTotalInspectors = producers * 3;
    const limitTotalDevelopers = producers / 5;
    const limitTotalResearchers = producers / 5;
    const limitTotalActivists = producers / 10;
    const limitTotalValidators = producers / 10;

    if (typeUser === 2) {
        const calculo = limitTotalInspectors - inspectors;
        const producerToInspectors = (limitTotalInspectors / producers) / 3
        
        if (calculo >= 1) {
            return {
                availableVacancy: true,
                amountVacancy: calculo
            }
        } else {
            return {
                availableVacancy: false,
                amountVacancy: Math.floor(producerToInspectors)
            }
        }
    }

    if (typeUser === 3) {
        const calculo = limitTotalResearchers - researchers;
        const producerToResearchers = ((1 - calculo) / 0.2).toFixed(0);
        if (calculo >= 1) {
            return {
                availableVacancy: true,
                amountVacancy: Math.floor(calculo)
            }
        } else {
            return {
                availableVacancy: false,
                amountVacancy: producerToResearchers
            }
        }
    }

    if (typeUser === 4) {
        const calculo = limitTotalDevelopers - developers;
        const producerToDevelopers = ((1 - calculo) / 0.2).toFixed(0);
        if (calculo >= 1) {
            return {
                availableVacancy: true,
                amountVacancy: Math.floor(calculo)
            }
        } else {
            return {
                availableVacancy: false,
                amountVacancy: producerToDevelopers
            }
        }
    }

    if (typeUser === 6) {
        const calculo = limitTotalActivists - activists;
        const producerToActivists = ((1 - calculo) / 0.1).toFixed(0);
        if (calculo >= 1) {
            return {
                availableVacancy: true,
                amountVacancy: Math.floor(calculo)
            }
        } else {
            return {
                availableVacancy: false,
                amountVacancy: producerToActivists
            }
        }
    }

    if (typeUser === 8) {
        const calculo = limitTotalValidators - validators;
        const producerToValidators = ((1 - calculo) / 0.1).toFixed(0);
        if (calculo >= 1) {
            return {
                availableVacancy: true,
                amountVacancy: Math.floor(calculo)
            }
        } else {
            return {
                availableVacancy: false,
                amountVacancy: producerToValidators
            }
        }
    }
}