import Web3 from "web3";
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';
import RcTokenContractJson from '../data/contracts/abis/RcToken.json';
import DevelopersPoolJson from '../data/contracts/abis/DeveloperPool.json';
import ProducerPoolContractJson from '../data/contracts/abis/ProducerPool.json';
import CategoryContractJson from '../data/contracts/abis/CategoryContract.json';

import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import SupporterContractJson from '../data/contracts/abis/SupporterContract.json';
import ActivistContractJson from '../data/contracts/abis/ActivistContract.json';
import ResearcherContractJson from '../data/contracts/abis/ResearcherContract.json';
import ValidatorContractJson from  '../data/contracts/abis/ValidatorContract.json';

const provider = `https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a`;
const web3 = new Web3(provider);

//contract address
const sintropContractAddress = process.env.REACT_APP_SINTROP_CONTRACT_ADDRESS;
const userContractAddress = process.env.REACT_APP_USER_CONTRACT_ADDRESS;
const rcTokenContractAddress = process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS;
const developersPoolAddress = process.env.REACT_APP_DEVELOPER_POOL_CONTRACT_ADDRESS;
const producerPoolContractAddress = process.env.REACT_APP_PRODUCER_POOL_CONTRACT_ADDRESS;
const categoryContractAddress = "0xd2d2f8a49fe9e7d832045516f623b255ab8fa7ee"

const producerContractAddress = process.env.REACT_APP_PRODUCER_CONTRACT_ADDRESS;
const supporterContractAddress = process.env.REACT_APP_SUPPORTER_CONTRACT_ADDRESS;
const activistContractAddress = process.env.REACT_APP_ACTIVIST_CONTRACT_ADDRESS;
const researcherContractAddress = process.env.REACT_APP_RESEARCHER_CONTRACT_ADDRESS
const developerContractAddress = process.env.REACT_APP_DEVELOPER_CONTRACT_ADDRESS
const validatorContractAddress = process.env.REACT_APP_VALIDATOR_CONTRACT_ADDRESS;

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);

const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const RcTokenContract = new web3.eth.Contract(RcTokenContractJson, rcTokenContractAddress);
const DevelopersPoolContract = new web3.eth.Contract(DevelopersPoolJson, developersPoolAddress);
const ProducerPoolContract = new web3.eth.Contract(ProducerPoolContractJson, producerPoolContractAddress);
const CategoryContract = new web3.eth.Contract(CategoryContractJson, categoryContractAddress);

//produtores
export const GetProducerInfura = async (wallet) => {
    let dataProducer = []
    await ProducerContract.methods.getProducer(wallet).call({from: producerContractAddress})
    .then((res) => {
        dataProducer = res;
    })
    return dataProducer;
}

export const GetProducersInfura = async () => {
    const producers = await ProducerContract.methods.getProducers().call()
    return producers;
}

//inspetores
export const GetActivistsInfura = async () => {
    const activists = await ActivistContract.methods.getActivists().call()
    return activists;
}

export const GetInspectorInfura = async (wallet) => {
    const activist = await ActivistContract.methods.getActivist(wallet).call();
    return activist
}

//pesquisadores
export const GetResearcherInfura = async (walletAdd) => {
    const researchers = await ResearcherContract.methods.getResearcher(walletAdd).call()
    return researchers;
}

export const GetResearchersInfura = async () => {
    const researchers = await ResearcherContract.methods.getResearchers().call()
    return researchers; 
}

export const GetResearchesInfura = async () => {
    let researches = [];
    await ResearcherContract.methods.getWorks().call({from: researcherContractAddress})
    .then(res => {
        researches = res;
    })
    .catch(err => {
        console.log(err);
    })
    return researches;
} 

//desenvolvedores
export const GetDevelopersInfura = async () => {
    const developers = await DeveloperContract.methods.getDevelopers().call()
    return developers;
}

export const GetDeveloperInfura = async (walletAdd) => {
    const developers = await DeveloperContract.methods.getDeveloper(walletAdd).call()
    return developers;
}

//Investidores

export const GetSupportersInfura = async () => {
    const investors = await SupporterContract.methods.getSupporters().call()
    return investors;
}

//contribuidores
export const GetValidatorInfura = async(walletAdd) => {
    const validator = await ValidatorContract.methods.getValidator(walletAdd).call()
    return validator;
}

//Inspeções
export const GetInspectionInfura = async (inspectionID) => {
    let inspection = [];
    await SintropContract.methods.getInspection(inspectionID).call({from: sintropContractAddress})
    .then((res) => {
        inspection = res;
    })
    return inspection;
}

export const GetInspectionsInfura = async () => {
    let inspections = [];
    await SintropContract.methods.getInspections().call({from: sintropContractAddress})
    .then((res) => {
        inspections = res;
    })
    return inspections;
}

//pools

export const GetBalancePoolProducersInfura = async () => {
    let balance = '';
    await ProducerPoolContract.methods.balance().call({from: producerPoolContractAddress})
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const GetBalanceProducerInfura = async (walletProducer) => {
    let balance = '';
    await ProducerPoolContract.methods.balanceOf(walletProducer).call({from: producerPoolContractAddress})
    .then((res) => {
        balance = res;
    })
    return balance;
}

export const GetTokensPerEraProducerPoolInfura = async () => {
    let tokens = 0;
    await ProducerPoolContract.methods.tokensPerEra().call({from: producerPoolContractAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetEraContractProducerPoolInfura = async () => {
    let era = '';
    await ProducerPoolContract.methods.currentContractEra().call({from: producerPoolContractAddress})
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetBalancePoolDevelopersInfura = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.balance().call({from: developersPoolAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

export const GetEraContractDevPoolInfura = async () => {
    let era = 0;
    await DevelopersPoolContract.methods.currentContractEra().call({from: developersPoolAddress})
    .then((res) => {
        era = res;
    })
    return era;
}

export const GetEraInfura = async (era) => {
    let eraInfo = [];
    await DevelopersPoolContract.methods.getEra(era).call({from: developersPoolAddress})
    .then((res) => {
        eraInfo = res;
    })

    return eraInfo;
}

export const GetBalanceDeveloperInfura = async (wallet) => {
    let balance = 0;
    await DevelopersPoolContract.methods.balanceOf(wallet).call({from: developersPoolAddress})
    .then((res) => {
        balance = res;
    })

    return balance;
}

export const TokensPerEraInfura = async () => {
    let tokens = 0;
    await DevelopersPoolContract.methods.TOKENS_PER_ERA().call({from: developersPoolAddress})
    .then((res) => {
        tokens = res;
    })
    return tokens;
}

//ISA
export const GetCategoriesInfura = async () => {
    let categories = [];
    await CategoryContract.methods.getCategories().call({from: categoryContractAddress})
    .then((res) => {
        categories = res;
    })
    let categoriesSorted = categories.map(item => item).sort((a, b) => parseInt(b.votesCount) - parseInt(a.votesCount))
    return categoriesSorted;
}












export const GetDelationInfura = async (wallet) => {
    let delations = []
    await UserContract.methods.getUserDelations(wallet).call({from: userContractAddress})
    .then((res) => {
        delations = res;
    })
    return delations;
}

export const GetSupporterInfura = async (wallet) => {
    const supporter = await SupporterContract.methods.getSupporter(wallet).call()
    return supporter;
}

export const GetCertificateTokensInfura = async (wallet) => {
    let tokens = 0
    await RcTokenContract.methods.certificate(wallet).call({from: rcTokenContractAddress})
    .then((res) => {
        tokens = res
    })
    .catch((err) => {
        tokens = 0
    })
    return tokens
}

export const GetIsaInfura = async (inspectionId) => {
    let isas = []
    await SintropContract.methods.getIsa(inspectionId).call({from: sintropContractAddress})
    .then((res) => {
        isas = res;
    })
    return isas;
}