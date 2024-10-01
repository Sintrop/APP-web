import { ProducerContract } from "./web3/Contracts";
import { producerContractAddress } from "./web3/Contracts";

export const addProducer = async (wallet, name, proofPhoto, geoLocation, areaProperty) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ProducerContract.methods.addProducer(Number(areaProperty).toFixed(0), name, proofPhoto, geoLocation)
    .send({ from: wallet })
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Producer registered!"
        }
    })
    .on("error", (error, receipt) => {
        if(error.stack.includes("Not allowed user")){
            type = 'error'
            message = 'Not allowed user!'
        }
        if (error.stack.includes("User already exists")){
            type = 'error'
            message = 'User already exists'
        }
    });
        
    return {
        type, 
        message,
        hashTransaction
    }
}

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