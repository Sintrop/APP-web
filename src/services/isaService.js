import Web3 from "web3";
import CategoryContractJson from '../data/contracts/abis/CategoryContract.json';
const web3 = new Web3(window.ethereum);

//contract address
const categoryContractAddress = CategoryContractJson.networks[5777].address;

//initializing contract
const CategoryContract = new web3.eth.Contract(CategoryContractJson.abi, categoryContractAddress);

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