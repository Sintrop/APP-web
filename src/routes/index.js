import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from '../pages/dashboard';
import AccountProducer from "../pages/accountProducer";
import AccountInvestor from '../pages/accountInvestor';
import OnlyOwner from "../pages/onlyOwner";
import IndicesControl from "../pages/indicesControl";
import { RequestSepolia } from "../pages/RequestSepolia";
import { ViewImage } from "../pages/ViewImage";
import { ResearchersCenter } from "../pages/ResearchersCenter";
import { DevelopersCenter } from "../pages/DevelopersCenter";
import { PrivateSales } from "../pages/privateSales";
import {Register} from "../pages/register";
import { Checkout } from "../pages/checkout";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route path="/dashboard/:walletAddress/:tabActive/:typeUser/:walletSelected" element={<Dashboard/>}/>
                
                <Route exact path="/only-owner" element={<OnlyOwner/>}/>
                <Route exact path="/indices-control" element={<IndicesControl/>}/>
                <Route exact path="/account-producer/:walletSelected" element={<AccountProducer/>}/>
                <Route exact path="/account-investor/:walletSelected" element={<AccountInvestor/>}/>
                <Route exact path="/requests-sepolia" element={<RequestSepolia/>}/>
                <Route exact path="/view-image/:hashPhoto" element={<ViewImage/>}/>
                <Route exact path="/researchers-center/:walletAddress/:typeUser" element={<ResearchersCenter/>}/>
                <Route exact path="/developers-center/:walletAddress/:typeUser" element={<DevelopersCenter/>}/>
                <Route exact path="/register/:walletAddress" element={<Register/>}/>
                <Route exact path="/checkout" element={<Checkout/>}/>
            </Routes>
        </BrowserRouter>
    );
}