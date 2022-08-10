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

class ProducerService {
    constructor(wallet) {
        this.web3 = new Web3(window.ethereum);
        this.wallet = wallet;
        this.producerDataNetwork = ProducerContract.networks["5777"];
        this.producerContractAddress = this.producerDataNetwork.address;
        this.producerABI = ProducerContract.abi;
    }

    async getProducerRanking(){
      if (this.producerContractAddress && this.producerDataNetwork) {
          const ProducerContract = new this.web3.eth.Contract(this.producerABI, this.producerContractAddress);
          const producers = await ProducerContract.methods.getProducers().call()
          return producers;
        } 
    }
}



export default ProducerService; 