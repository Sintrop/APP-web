import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from '../pages/dashboard';
import Register from "../components/Tabs/Register";
import ProducerRanking from "../components/Tabs/Ranking/Producer";
import ActivistRanking from "../components/Tabs/Ranking/Activist";
import AccountProducer from "../pages/accountProducer";
import OnlyOwner from "../pages/onlyOwner";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/dashboard/:walletAddress" element={<Dashboard/>}/>
                
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/account-producer/:walletAddress" element={<AccountProducer/>}/>
                <Route exact path="/only-owner" element={<OnlyOwner/>}/>

                <Route exact path="/producers-ranking" element={ <ProducerRanking />}/>
                <Route exact path="/activists-ranking" element={ <ActivistRanking />}/>
            </Routes>
        </BrowserRouter>
    );
}