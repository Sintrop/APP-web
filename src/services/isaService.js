import Web3 from "web3";
import CategoryContract from '../data/contracts/abis/CategoryContract.json';
const CategoryContractAddress = CategoryContract.networks[5777].address;

export const GetCategories = async () => {
    let categories = [];
    const contractAddress = CategoryContract.networks[5777].address;
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(CategoryContract.abi, contractAddress)
    await contract.methods.getCategories().call({from: contractAddress})
    .then((res) => {
        categories = res;
    })
    let categoriesSorted = categories.map(item => item).sort((a, b) => parseInt(b.votesCount) - parseInt(a.votesCount))
    return categoriesSorted;
}

export const AddCategory = async (
    walletAddress, name, description, tutorial, totallySustainable, partiallySustainable, neutro, partiallyNotSustainable, totallyNotSustainable 
    ) => {
    let type = '';
    let message = '';
    let hashTransaction = ''; 
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(CategoryContract.abi, CategoryContractAddress);
    await contract.methods.addCategory(
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