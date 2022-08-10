import Web3 from "web3";
import ProducerContract from '../data/contracts/abis/ProducerContract.json';

export const GetProducer = async (wallet) => {
    let dataProducer = []
    const web3js = new Web3(window.ethereum);
    const contractAddress = ProducerContract.networks[5777].address;
    const contract = new web3js.eth.Contract(ProducerContract.abi, contractAddress);
    await contract.methods.getProducer(wallet).call({from: contractAddress})
    .then((res) => {
        //console.log(res);
        dataProducer = res;
    })

    return dataProducer;
}