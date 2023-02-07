import React from "react";

import Router from "./routes";
import "./app.css";
import { useNetwork } from "./hooks/useNetwork";
function App() {
  const {  data, isSupported } = useNetwork()
  console.log(data)
  if (isSupported) {
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
