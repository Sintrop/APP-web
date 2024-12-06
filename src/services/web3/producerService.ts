import { ProducerContract } from "./Contracts";
import { producerContractAddress } from "./Contracts";
import { web3RequestWrite } from "./requestService";

//@ts-ignore
export const addProducer = async (wallet, name, proofPhoto, geoLocation, areaProperty) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await ProducerContract.methods.addProducer(Number(areaProperty).toFixed(0), name, proofPhoto, geoLocation)
    .send({ from: wallet })
    //@ts-ignore
    .on('transactionHash', hash => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Producer registered!"
        }
    })
    //@ts-ignore
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

export const GetProducer = async (wallet: string) => {
    //@ts-ignore
    let dataProducer = []
    await ProducerContract.methods.getProducer(wallet).call({from: producerContractAddress})
    //@ts-ignore
    .then((res) => {
        dataProducer = res;
    })
    //@ts-ignore
    return dataProducer;
}

export const GetTotalScoreProducers = async () => {
    let score = '';
    await ProducerContract.methods.producersTotalScore().call({from: producerContractAddress})
    //@ts-ignore
    .then((res) => {
        score = res;
    })
    return score;
}

export const GetProducers = async () => {
    const producers = await ProducerContract.methods.getProducers().call()
    return producers;
}

interface WithdrawTokensProps{
    walletConnected: string;
}
export async function withdrawTokens({walletConnected}: WithdrawTokensProps){
    const response = await web3RequestWrite(ProducerContract, 'withdraw', [], walletConnected);
    return response;
}