import Web3 from "web3";
import ResearcherContract from '../data/contracts/abis/ResearcherContract.json';

export const NewAllowedResearcher = async (walletResearcher, walletAdm) => {
    const web3js = new Web3(window.ethereum);
    const contractAddress = ResearcherContract.networks[5777].address;
    const contract = new web3js.eth.Contract(ResearcherContract.abi, contractAddress);
    await contract.methods.newAllowedUser(walletResearcher).send({from: walletAdm})
    .on('transactionHash', hash => {
        if(hash){
            console.log(hash);
            return hash
        }else{
            return false
        }
    })
}