import Web3 from "web3";
import CategoryContract from '../data/contracts/abis/CategoryContract.json';

export const GetCategories = async () => {
    let categories = [];
    const contractAddress = CategoryContract.networks[5777].address;
    const web3js = new Web3(window.ethereum);
    const contract = new web3js.eth.Contract(CategoryContract.abi, contractAddress)
    await contract.methods.getCategories().call({from: contractAddress})
    .then((res) => {
        categories = res;
    })

    return categories;
}