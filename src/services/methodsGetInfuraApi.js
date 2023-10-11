import Web3 from "web3";
import SintropContractJson from '../data/contracts/abis/Sintrop.json';
import UserContractJson from '../data/contracts/abis/UserContract.json';
import SACTokenContractJson from '../data/contracts/abis/SacToken.json';
import DevelopersPoolJson from '../data/contracts/abis/DeveloperPool.json';
import ProducerPoolContractJson from '../data/contracts/abis/ProducerPool.json';
import CategoryContractJson from '../data/contracts/abis/CategoryContract.json';

import DeveloperContractJson from '../data/contracts/abis/DeveloperContract.json';
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
import InvestorContractJson from '../data/contracts/abis/InvestorContract.json';
import ActivistContractJson from '../data/contracts/abis/ActivistContract.json';
import ResearcherContractJson from '../data/contracts/abis/ResearcherContract.json';
import ContributorContractJson from  '../data/contracts/abis/ContributorContract.json';

const provider = `https://sepolia.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a`;
const web3 = new Web3(provider);

//contract address
const sintropContractAddress = '0x6ff3e655a639e35d9194228aa42879ae7ddf7dd8';
const userContractAddress = '0x6e84e942d18dc2f68ec9fed5a4fa526b17f04113';
const sacTokenContractAddress = '0xF8033Bbfe9c645F52d170DDD733274371E75369F';
const developersPoolAddress = '0x5703e8a25a6bcd2a989f28a3cfd39cfc9ae06718';
const producerPoolContractAddress = '0x0751c7e08e53a55a1ed24fe1467d9a0ceb8ef95e';
const categoryContractAddress = '0x788a57aa634e5e559a655033b780d192385617fb';

const producerContractAddress = '0x693161f1e90270ba156179128f49c285c89447e7';
const investorContractAddress = '0x8014eef23614d357010685787690d3e7c2cfcc30';
const activistContractAddress = '0xa289fabc5764f91ac56575f7f048038faa3d059d';
const researcherContractAddress = '0x5c5553b494cc350f1a31e1f91832a3ed19df1627';
const developerContractAddress = '0x0c9aa6894d586fbfd246b7633cde1ced544120f4';
const contributorContractAddress = '0xf1790104904127901ea3dda4b95deb215764023f';

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
const InvestorContract = new web3.eth.Contract(InvestorContractJson, investorContractAddress);
const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
const ContributorContract = new web3.eth.Contract(ContributorContractJson, contributorContractAddress);

const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
const SACTokenContract = new web3.eth.Contract(SACTokenContractJson, sacTokenContractAddress);
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

export const GetInvestorsInfura = async () => {
    const investors = await InvestorContract.methods.getInvestors().call()
    return investors;
}

//contribuidores
export const GetContributorInfura = async(walletAdd) => {
    const contributors = await ContributorContract.methods.getContributor(walletAdd).call()
    return contributors;
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

export const GetInvestorInfura = async (wallet) => {
    const investor = await InvestorContract.methods.getInvestor(wallet).call()
    return investor;
}

export const GetCertificateTokensInfura = async (wallet) => {
    let tokens = 0
    await SACTokenContract.methods.certificate(wallet).call({from: sacTokenContractAddress})
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