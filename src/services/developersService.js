import { DeveloperContract } from "./web3/Contracts";

export const GetDeveloper = async (walletAdd) => {
    const developers = await DeveloperContract.methods.getDeveloper(walletAdd).call()
    return developers;
}

export const GetDevelopers = async () => {
    const developers = await DeveloperContract.methods.getDevelopers().call()
    return developers;
}

export const AddContribution = async (walletAddress, report) => {
    let type = '';
    let message = '';
    let hashTransaction = '';
    await DeveloperContract.methods.addContribution(report).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Inspection successfully accepted!"
        }
    })
    .on("error", (error, receipt) => {
        console.log(receipt);
    })
    return {
        type, 
        message,
        hashTransaction
    }
}

export const WithdrawTokens = async (wallet) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await DeveloperContract.methods.withdraw().send({from: wallet})
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