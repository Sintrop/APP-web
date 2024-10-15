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

export const validatorContractAddress = '0x7096412447E5e661d2906029858da85970e78B6d';
export const userContractAddress = '0x54303FB8298592D416381dc780A4D037c0E6f88A';
export const supporterContractAddress = '0xf7fDF0b7A6fA93fAeCc9ff825da36E1AaDc681DA';
export const researcherPoolContractAddress = '0xBbFF6D47B0e7525f9cD52DC946C93017928cbC7b';
export const researcherContractAddress = '0x7497FaD7fab44D90928BdC36e642E8fc3720dE1B';
export const rcTokenIconAddress = '0x1e1cc60a91380c81ecabfbd497c72a7f134f39af';
export const RcTokenContractAddress = '0xa173e03178e984bba7913ee9c3664ddf9763f736';
export const producerPoolContractAddress = '0x42a4a61948e06fcd57327c1b179a29d8abf64bf0';
export const inspectorPoolContractAddress = '0xfc726bf36832bab35439a52f4b1377e9498b436c';
export const developersPoolContractAddress = '0xbca3b8de10a9a32c967fc841113059d12b6b68a9';
export const activistContractAddress = '0x2b5e7Dbb83678Ce109885bB02789E9e4fcD47F4F';
export const sintropContractAddress = '0x7560f7f50288797477884861c4e2AeA86810A31C';
export const producerContractAddress = '0x2456D342DAAB50927E9034Bd6bA201B99e4F655c';
export const inspectorContractAddress = '0xE20aBb37B81C1FD54222Ce01eac4612ad5ecD7AC';
export const developerContractAddress = '0x4867A7EDfE41d909dcE80389F746d3a9d71844C0';
export const validatorPoolContractAddress = '0x3F8dE1A9d80c6A1dd1a35a439CB7FCC7Aa39Bf9A';
export const categoryContractAddress = '0x6C4F71C6f31F5D6afE97b30485149B7a9F7EAe8f';
export const invitationContractAddress = '0x9A67E9EBbF7E8747c46b03faEa0757a2A4583FcF'

const provider = window.ethereum ? window.ethereum : `https://holesky.infura.io/v3/e46d8ac23f55416a9c93c0efa005450a`;
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