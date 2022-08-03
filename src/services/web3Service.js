import Web3 from "web3";
import UserContract from "../data/contracts/abis/UserContract.json";
import ProducerContract from "../data/contracts/abis/ProducerContract.json";
import ActivistContract from "../data/contracts/abis/ActivistContract.json";



export const loadActivist = async () => {
  const web3 = new Web3(window.ethereum);
  const activistDataNetwork = ActivistContract.networks["5777"];
  const activistContractAddress = activistDataNetwork.address;
  const activistABI = ActivistContract.abi;
  const address = localStorage.getItem("account")
  if (activistContractAddress && activistDataNetwork) {
    await allowedContract(activistContractAddress);
    const activistContract =  new web3.eth.Contract(
      activistABI,
      activistContractAddress
    );
    
    if(activistContract){

      const activists = await activistContract.methods.getActivist(address).call();
      console.log(activists);
    }
  }
}

const loadContracts = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    const address = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    localStorage.setItem("account" , address[0]);
    const userDataNetwork = UserContract.networks["5777"];
    const userContractAddress = userDataNetwork.address;
    const userABI = UserContract.abi;
    if (userContractAddress && userDataNetwork) {
      const UserContract = new web3.eth.Contract(userABI, userContractAddress);
      
      return UserContract;
    } else {
      return false;
    }
  } else {
    alert("Precisa instalar o metamask");
    return false;
  }
};

export const addActivist = async (
  name,
  document,
  documentType,
  country,
  state,
  city,
  cep

) => {
  const web3 = new Web3(window.ethereum);
  const activistDataNetwork = ActivistContract.networks["5777"];
  const activistContractAddress = activistDataNetwork.address;
  const activistABI = ActivistContract.abi;
  const address = localStorage.getItem("account");
  await allowedContract(activistContractAddress);
  if (activistContractAddress && activistDataNetwork) {
    const activistContract =  new web3.eth.Contract(
      activistABI,
      activistContractAddress
    );
    
    if(activistContract){
      await activistContract.methods.addActivist(
        name,
        document,
        documentType,
        country,
        state,
        city,
        cep
      ).send( { from: address });

      const activists = await activistContract.methods.getActivist(address).call();
      console.log(activists);
    }
  }
}


export const addProducer = async (
  name,
  document,
  documentType,
  country,
  state,
  city,
  cep

) => {
  const web3 = new Web3(window.ethereum);
  const producerDataNetwork = ProducerContract.networks["5777"];
  const producerContractAddress = producerDataNetwork.address;
  console.log(producerContractAddress)
  const producerABI = ProducerContract.abi;
  const address = localStorage.getItem("account")
  if (producerContractAddress && producerDataNetwork) {
    //await allowedContract(producerContractAddress);
    const producerContract =  new web3.eth.Contract(
      producerABI,
      producerContractAddress
    );
    
    if(producerContract){
      producerContract.methods.addProducer(
        name,
        document,
        documentType,
        country,
        state,
        city,
        cep
      ).send( { from: address });
    }
  }
};

export const allowedContract = async (addressContract) => {
  const userContract = await loadContracts();
  const address = localStorage.getItem("account")
  if (userContract) {
    console.log(addressContract)
    userContract.methods.newAllowedCaller(addressContract).send({ from: address});
    return;
  }
};
