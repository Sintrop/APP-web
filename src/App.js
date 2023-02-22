import React from "react";
import MainProvider from "./contexts/main";
import Router from "./routes";
import "./app.css";

function App() {
    return (
        <MainProvider>
            <Router />
        </MainProvider>
    );
}

export default App;