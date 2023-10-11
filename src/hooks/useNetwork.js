import { useState } from "react";
import useSWR from "swr";
import Web3 from "web3";
const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  5777: "Ganache",
  11155111: 'Sepolia Test Network'
};
const targetNetwork = NETWORKS["11155111"];
export const useNetwork = () => {
  const web3 = new Web3(window.ethereum);
  // window.ethereum.on("chainChanged", (_chainId) => {
  //   console.log(parseInt(_chainId, 16));
  // });
  const { data, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = await web3.eth.net.getId();

      return NETWORKS[chainId];
    }
  );
  // useEffect(() => {}, [])

  // const [networkWallet, setNetworkWallet] = useState();
  return {
    data,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
