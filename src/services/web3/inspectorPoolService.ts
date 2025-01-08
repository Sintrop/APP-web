import { InspectorPoolContract, web3 } from "./Contracts";

export async function currentContractEra(): Promise<number>{
    const response = await InspectorPoolContract.methods.currentContractEra().call();
    return parseInt(response);
}

export async function currentContractEpoch(): Promise<number>{
    const response = await InspectorPoolContract.methods.currentEpoch().call();
    return parseInt(response);
}

export async function tokensPerEra(currentEpoch: number, halving: number): Promise<number>{
    const response = await InspectorPoolContract.methods.tokensPerEra(currentEpoch, halving).call();
    return Number(web3.utils.fromWei(response));
}

export async function nextEraIn(atualEra: number): Promise<number>{
    const response = await InspectorPoolContract.methods.nextEraIn(atualEra).call();
    return parseInt(response);
}