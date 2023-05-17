import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from '../pages/dashboard';
import Register from "../components/Tabs/Register";
import ProducerRanking from "../components/Tabs/Ranking/Producer";
import ActivistRanking from "../components/Tabs/Ranking/Activist";
import AccountProducer from "../pages/accountProducer";
import AccountInvestor from '../pages/accountInvestor';
import OnlyOwner from "../pages/onlyOwner";
import IndicesControl from "../pages/indicesControl";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route path="/dashboard/:walletAddress/:tabActive/:typeUser" element={<Dashboard/>}/>
                
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/only-owner" element={<OnlyOwner/>}/>
                <Route exact path="/indices-control" element={<IndicesControl/>}/>
                <Route exact path="/account-producer/:walletSelected" element={<AccountProducer/>}/>
                <Route exact path="/account-investor/:walletSelected" element={<AccountInvestor/>}/>
                
            </Routes>
        </BrowserRouter>
    );
}