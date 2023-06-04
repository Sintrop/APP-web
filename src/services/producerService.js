import Web3 from "web3";
import ProducerContractJson from '../data/contracts/abis/ProducerContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const producerContractAddress = '0x693161f1e90270ba156179128f49c285c89447e7';

//initializing contract
const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);

export const GetProducer = async (wallet) => {
    let dataProducer = []
    await ProducerContract.methods.getProducer(wallet).call({from: producerContractAddress})
    .then((res) => {
        dataProducer = res;
    })
    return dataProducer;
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await ProducerContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!!"
        }
    })
    .on("error", (error, receipt) => {
        
    })

    return {
        type, 
        message,
        hashTransaction
    }
}

export const GetTotalScoreProducers = async () => {
    let score = '';
    await ProducerContract.methods.producersTotalScore().call({from: producerContractAddress})
    .then((res) => {
        score = res;
    })
    return score;
}

export const GetProducers = async () => {
    const producers = await ProducerContract.methods.getProducers().call()
    return producers;
}

class ProducerService {
    constructor(wallet) {
        this.web3 = web3;
        this.wallet = wallet;
        this.producerContractAddress = producerContractAddress;
    }

    async getProducerRanking(){
        const producers = await ProducerContract.methods.getProducers().call()
        return producers;
    }
}

export default ProducerService; 