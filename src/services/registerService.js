import Web3 from "web3";
import {
  ethErrors,
  serializeError,
  errorCodes,
  getMessageFromCode,
} from "eth-rpc-errors";
import ProducerContract from "../data/contracts/abis/ProducerContract.json";
import ActivistContract from "../data/contracts/abis/ActivistContract.json";
import ContributorContract from "../data/contracts/abis/ContributorContract.json";
import ResearcherContract from "../data/contracts/abis/ResearcherContract.json";
import DeveloperContract from "../data/contracts/abis/DeveloperContract.json";
import AdvisorContract from "../data/contracts/abis/AdvisorContract.json";
import InvestorContract from "../data/contracts/abis/InvestorContract.json";
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
    try {
      
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
            .catch((error) => {
              
              const serializedError = serializeError(error);
              console.log({ serializedError });
              console.log(error.stack)
              if (error.stack.includes("This producer already exist"))
                toast.error("This producer already exist");
            });
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async addContributor(name, document, documentType, country, state, city, cep) {
    const contributorDataNetwork = ContributorContract.networks["5777"];
    const contributorContractAddress = contributorDataNetwork.address;
    const contributorABI = ContributorContract.abi;
    if (contributorContractAddress && contributorDataNetwork) {
      const contributorContract = new this.web3.eth.Contract(
        contributorABI,
        contributorContractAddress
      );

      if (contributorContract) {
        await contributorContract.methods
          .addContributor(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Contributor registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }    
  }

  async addInvestor(name, document, documentType, country, state, city, cep) {
    const investorDataNetwork = InvestorContract.networks["5777"];
    const investorContractAddress = investorDataNetwork.address;
    const investorABI = InvestorContract.abi;
    if (investorContractAddress && investorDataNetwork) {
      const investorContract = new this.web3.eth.Contract(
        investorABI,
        investorContractAddress
      );

      if (investorContract) {
        await investorContract.methods
          .addInvestor(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Investor registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }    
  }

  async addDeveloper(name, document, documentType, country, state, city, cep) {
    const developerDataNetwork = DeveloperContract.networks["5777"];
    const developerContractAdress = developerDataNetwork.address;
    const developerABI = DeveloperContract.abi;
    if (developerContractAdress && developerDataNetwork) {
      const developerContract = new this.web3.eth.Contract(
        developerABI,
        developerContractAdress
      );

      if (developerContract) {
        await developerContract.methods
          .addDeveloper(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Developer registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }    
  }

  async addResearcher(name, document, documentType, country, state, city, cep) {
    const researcherDataNetwork = ResearcherContract.networks["5777"];
    const researcherContractAddress = researcherDataNetwork.address;
    const researcherABI = ResearcherContract.abi;
    if (researcherContractAddress && researcherDataNetwork) {
      const researcherContract = new this.web3.eth.Contract(
        researcherABI,
        researcherContractAddress
      );

      if (researcherContract) {
        await researcherContract.methods
          .addResearcher(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Researcher registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }    
  }

  async addAdvisor(name, document, documentType, country, state, city, cep) {
    const advisorDataNetwork = AdvisorContract.networks["5777"];
    const advisorContractAddress = advisorDataNetwork.address;
    const advisorABI = AdvisorContract.abi;
    if (advisorContractAddress && advisorDataNetwork) {
      const advisorContract = new this.web3.eth.Contract(
        advisorABI,
        advisorContractAddress
      );

      if (advisorContract) {
        await advisorContract.methods
          .addAdvisor(name, document, documentType, country, state, city, cep)
          .send({ from: this.address, gas: 1500000 })
          .on("confirmation", (receipt) =>
            toast.success("Advisor registered!")
          )
          .on("error", (error, receipt) => {
            if (error.stack.includes("User already exists"))
              toast.error("User already exists");
          });
      }
    }    
  }             
}

export default RegisterService;

