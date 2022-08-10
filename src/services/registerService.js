import Web3 from "web3";
import {
  ethErrors,
  serializeError,
  errorCodes,
  getMessageFromCode,
} from "eth-rpc-errors";
import ProducerContract from "../data/contracts/abis/ProducerContract.json";
import ActivistContract from "../data/contracts/abis/ActivistContract.json";
import { toast } from "react-toastify";

class RegisterService {
  constructor(wallet) {
    this.web3 = new Web3(window.ethereum);
    this.address = wallet;
  }

  async addActivist(name, document, documentType, country, state, city, cep) {
    const activistDataNetwork = ActivistContract.networks["5777"];
    const activistContractAddress = activistDataNetwork.address;
    const activistABI = ActivistContract.abi;
    if (activistContractAddress && activistDataNetwork) {
      const activistContract = new this.web3.eth.Contract(
        activistABI,
        activistContractAddress
      );

      if (activistContract) {
        await activistContract.methods
          .addActivist(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Activist registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }
  }

  async addProducer(name, document, documentType, country, state, city, cep) {
    const producerDataNetwork = ProducerContract.networks["5777"];
    const producerContractAddress = producerDataNetwork.address;
    const producerABI = ProducerContract.abi;
    if (producerContractAddress && producerDataNetwork) {
      const producerContract = new this.web3.eth.Contract(
        producerABI,
        producerContractAddress
      );

      if (producerContract) {
        producerContract.methods
          .addProducer(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Producer registered!")
          )
          .on("error", (error) => {
            if (error.stack.includes("This producer already exist"))
              toast.error("This producer already exist");
          });
      }
    }
  }
}

export default RegisterService;
