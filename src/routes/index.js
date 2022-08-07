import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from '../pages/dashboard';
import ProducerRanking from "../components/Tabs/Ranking/Producer";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/dashboard/:walletAddress" element={<Dashboard/>}/>
                <Route exact path="/producers-ranking" element={ <ProducerRanking />}/>
            </Routes>
        </BrowserRouter>
    );
}