import { api } from "./api";
import { GetCurrentContractEra, GetCurrentEpoch, NextEraIn } from "./producerPoolService";

export async function getEraInfo(){
    const hasProvider = window.ethereum ? true : false;

    if(hasProvider){
        const response = await getBlockchain();
        return response;
    }else{
        const response = await getApi();
        return response;
    }
}  

async function getApi(){
    const response = await api.get('/web3/era-info');
    const {nextEraIn, eraAtual, epoch} = response.data;
    
    return {
        nextEraIn, eraAtual, epoch
    }
}

async function getBlockchain(){
    const eraAtual = await GetCurrentContractEra();
    const epoch = await GetCurrentEpoch();
    const nextEraIn = await NextEraIn(eraAtual);

    return {eraAtual, epoch, nextEraIn}
}