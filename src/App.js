import React from "react";
import MainProvider from "./contexts/main";
import Router from "./routes";
import "./app.css";
import { HelmetProvider } from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
            <MainProvider>
                <Router />
            </MainProvider>
        </HelmetProvider>
    );
}

export default App;