import { InspectorContract } from "./web3/Contracts";

export const GetInspector = async (wallet) => {
    const inspector = await InspectorContract.methods.getInspector(wallet).call();
    return inspector
}

export const GetInspectors = async () => {
    const inspectors = await InspectorContract.methods.getInspectors().call()
    console.log(inspectors);
    return inspectors;
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await InspectorContract.methods.withdraw().send({from: wallet})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Token withdrawal successful!"
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