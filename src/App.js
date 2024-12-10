import React from "react";
import MainProvider from "./contexts/main";
import Router from "./routes";
import "./app.css";
import { HelmetProvider } from "react-helmet-async";
import { useNetwork } from "./hooks/useNetwork";
import { UnsupportedNetworkPage } from "./pages/UnsupportedNetworkPage/UnsupportedNetworkPage";

function App() {
    const {isSupported, data} = useNetwork();

    return (
        <HelmetProvider>
            <MainProvider>
                {isSupported ? (
                    <Router />
                ) : (
                    <UnsupportedNetworkPage
                        networkName={data}
                    />
                )}
            </MainProvider>
        </HelmetProvider>
    );
}

export default App;
