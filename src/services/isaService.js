import { CategoryContract } from "./web3/Contracts";
import { categoryContractAddress } from "./web3/Contracts";

export const GetCategories = async () => {
    let categories = [];
    await CategoryContract.methods.getCategories().call({from: categoryContractAddress})
    .then((res) => {
        categories = res;
    })
    let categoriesSorted = categories.map(item => item).sort((a, b) => parseInt(b.votesCount) - parseInt(a.votesCount))
    return categoriesSorted;
}

export const AddCategory = async (
        walletAddress, 
        name, 
        description, 
        tutorial, 
        totallySustainable, 
        partiallySustainable, 
        neutro, 
        partiallyNotSustainable, 
        totallyNotSustainable 
    ) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    await CategoryContract.methods.addCategory(
        name, 
        description,
        tutorial, 
        totallySustainable, 
        partiallySustainable,
        neutro,
        partiallyNotSustainable,
        totallyNotSustainable
    ).send({from: walletAddress})
    .on('transactionHash', (hash) => {
        if(hash){
            hashTransaction = hash
            type = 'success'
            message = "Category added successfully!"
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