import React from "react";
import MainProvider from "./contexts/main";
import Router from "./routes";
import "./app.css";
import { useNetwork } from "./hooks/useNetwork";
function App() {
  const {  data, isSupported } = useNetwork()
  
  if (isSupported) {
    return (
      <MainProvider>
        <Router />
      </MainProvider>
    );
  } else {
    return< div className="background">
     <div className="network_wrong">
        <h1 className="title">Your connected network is <br/>unsupported</h1>
    </div>;
    </div>
  }
}

export default App;
