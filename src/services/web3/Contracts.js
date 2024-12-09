import Web3 from "web3";

import ValidatorContractJson from '../../data/contracts/abis/ValidatorContract.json';
import UserContractJson from '../../data/contracts/abis/UserContract.json';
import SupporterContractJson from '../../data/contracts/abis/SupporterContract.json';
import ResearcherPoolContractJson from '../../data/contracts/abis/ResearcherPool.json';
import ResearcherContractJson from '../../data/contracts/abis/ResearcherContract.json';
import RcTokenIcoContractJson from '../../data/contracts/abis/RcTokenIco.json';
import RcTokenContractJson from '../../data/contracts/abis/RcToken.json';
import ProducerPoolContractJson from '../../data/contracts/abis/ProducerPool.json';
import InspectorPoolContractJson from '../../data/contracts/abis/InspectorPool.json';
import DevelopersPoolContractJson from '../../data/contracts/abis/DeveloperPool.json';
import ActivistContractJson from '../../data/contracts/abis/ActivistContract.json';
import SintropContractJson from '../../data/contracts/abis/Sintrop.json';
import ProducerContractJson from '../../data/contracts/abis/ProducerContract.json';
import InspectorContractJson from '../../data/contracts/abis/InspectorContract.json';
import DeveloperContractJson from '../../data/contracts/abis/DeveloperContract.json';
import ValidatorPoolContractJson from '../../data/contracts/abis/ValidatorPool.json';
import CategoryContractJson from '../../data/contracts/abis/CategoryContract.json';
import InvitationContractJson from '../../data/contracts/abis/InvitationContract.json';
import ContributorContractJson from '../../data/contracts/abis/ContributorContract.json';

export const validatorContractAddress = '0x31B68Eb7598F74B2A983F90FDAA965AE7b5A0Cfe';
export const validatorPoolContractAddress = '0xf69C08EFDb98571e53AfF611FD8AB4Cd0cDEDDBb';
export const userContractAddress = '0xf8D8D7F7b803F93038aBA067eA3acD62E4560E64';
export const supporterContractAddress = '0x803C23b69f486e1d64e7b21Ab7D82FCE682f1cD1';
export const supporterPoolAddress = '0x5918C1e1706C6D56a933c4C9186F1569f6635772';
export const researcherPoolContractAddress = '0xdB4b4a26F5C3187DFa0536A21F98692107Fa27D1';
export const researcherContractAddress = '0x658C33911Fa10bb3191a2bff875D4529c0090568';
export const rcTokenIconAddress = '0x1e1cc60a91380c81ecabfbd497c72a7f134f39af';
export const RcTokenContractAddress = '0x3708e3414c00118c8dfc43b4fF123aBef77232eD';
export const producerPoolContractAddress = '0xb62f9A424D2c959EF871d96fCC5729c5D11f2582';
export const producerContractAddress = '0xd04E6EC25cc2f380f3BDb6778D2F5c1DAc91D254';
export const inspectorPoolContractAddress = '0x1403f8640760a4fC608A6a7f5A1bD15dFDFc4C15';
export const inspectorContractAddress = '0x32E079Cd3f860DF00d1ba2709E2367E55ab3Bd48';
export const developersPoolContractAddress = '0xF7dB208122E86fDa996C7568c5eD24f57f2e7bae';
export const developerContractAddress = '0x6962729da8025914831132d7c84F244fcbB5Bf33';
export const activistContractAddress = '0xa474B7F10d5E4bC9ba6A5842c3872097Eb80A680';
export const activistPoolContractAddress = '0x923FCa43062DC1EcD30a888BFEAa2e084834c672';
export const sintropContractAddress = '0x999db64EC8fD02193eB1AE76E1B1e62Bf8de8880';
export const categoryContractAddress = '0x88a85094D01FF02153ffAECa80B815B15924b1F3';
export const invitationContractAddress = '0x2706Aa94b6A9d34510D63C5A06A6cC6A44C66aF7';
export const contributorContractAddress = '0xA6441d83EA33Bbb7e662D4bfaAA766afBe7CC7FF';
export const contributorPoolContractAddress = '0x5f2076920f17B8E7E0229e1Cd4013133e96e0180';

const provider = window.ethereum ? window.ethereum : process.env.REACT_APP_CHAIN_NODE_API;
export const web3 = new Web3(provider);

export const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);
export const UserContract = new web3.eth.Contract(UserContractJson, userContractAddress);
export const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
export const ResearcherPoolContract = new web3.eth.Contract(ResearcherPoolContractJson, researcherPoolContractAddress);
export const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
export const RcTokenIcoContract = new web3.eth.Contract(RcTokenIcoContractJson, rcTokenIconAddress);
export const RcTokenContract = new web3.eth.Contract(RcTokenContractJson, RcTokenContractAddress);
export const ProducerPoolContract = new web3.eth.Contract(ProducerPoolContractJson, producerPoolContractAddress);
export const InspectorPoolContract = new web3.eth.Contract(InspectorPoolContractJson, inspectorPoolContractAddress);
export const DevelopersPoolContract = new web3.eth.Contract(DevelopersPoolContractJson, developersPoolContractAddress);
export const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
export const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
export const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);
export const InspectorContract = new web3.eth.Contract(InspectorContractJson, inspectorContractAddress);
export const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
export const ValidatorPoolContract = new web3.eth.Contract(ValidatorPoolContractJson, validatorPoolContractAddress);
export const CategoryContract = new web3.eth.Contract(CategoryContractJson, categoryContractAddress);
export const InvitationContract = new web3.eth.Contract(InvitationContractJson, invitationContractAddress);
export const ContributorContract = new web3.eth.Contract(ContributorContractJson, contributorContractAddress);