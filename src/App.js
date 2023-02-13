import React from "react";
import MainProvider from "./contexts/main";
import Router from "./routes";
import "./app.css";
import { useNetwork } from "./hooks/useNetwork";
import { UnsupportedNetwork } from "./components/UnsupportedNetwork";

function App() {
    const {  data, isSupported } = useNetwork();
    
    if (isSupported) {
        return (
            <MainProvider>
                <Router />
            </MainProvider>
        );
    } else {
        return <UnsupportedNetwork/>
    }
}

export default App;
