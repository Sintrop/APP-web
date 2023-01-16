import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Router from "./routes";
import Activist from "./data/contracts/abis/ActivistContract.json";
import "./app.css";
function App() {
  const [networkWallet, setNetworkWallet] = useState();
  const NetworkContract = Object.keys(Activist.networks).toString();
  const web3 = new Web3(window.ethereum);
  web3.eth.net.getId().then((data) => setNetworkWallet(String(data)));

  if (networkWallet === NetworkContract) {
    return <Router />;
  } else {
    return< div className="background">
     <div className="network_wrong">
        <h1 className="title">Your connected network is <br/>unsupported</h1>
    </div>;
    </div>
  }
}

export default App;
