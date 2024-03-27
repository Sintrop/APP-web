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
import {Register} from "../pages/register";
import { Checkout } from "../pages/checkout";
import { ViewPdf } from "../pages/ViewPdf";
import {Education} from '../pages/Education';

//
import { Home } from "../pages/Home";
import { Centers } from "../pages/Centers";
import { RegenerationCredit } from "../pages/RegenerationCredit";
import { Community } from "../pages/Community";
import { Actions } from '../pages/Actions';
import { UserDetails } from "../pages/UserDetails";
import { InspectionsCenter } from "../pages/InspectionsCenter";
import { ResultInspection } from "../pages/ResultInspection";
import { ResearchesCenter } from "../pages/ResearchesCenter";
import { Ranking } from "../pages/Ranking";
import { Market } from "../pages/RegenerationCredit/Market";
import { Contribute } from "../pages/RegenerationCredit/Contribute";
import { Pools } from "../pages/RegenerationCredit/Pools";
import { Services } from "../pages/RegenerationCredit/Services";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/centers" element={<Centers/>}/>
                <Route exact path="/regeneration-credit" element={<RegenerationCredit/>}/>
                <Route exact path="/community" element={<Community/>}/>
                <Route exact path="/actions" element={<Actions/>}/>
                <Route exact path="/user-details/:wallet" element={<UserDetails/>}/>
                <Route exact path="/inspections-center" element={<InspectionsCenter/>}/>
                <Route exact path="/result-inspection/:id" element={<ResultInspection/>}/>
                <Route exact path="/researches-center" element={<ResearchesCenter/>}/>
                <Route exact path="/ranking/:userType" element={<Ranking/>}/>
                <Route exact path="/market" element={<Market/>}/>
                <Route exact path="/contribute" element={<Contribute/>}/>
                <Route exact path="/services" element={<Services/>}/>
                <Route exact path="/pools/:poolType" element={<Pools/>}/>

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
                <Route exact path="/view-pdf/:hash" element={<ViewPdf/>}/>
                <Route exact path="/education" element={<Education/>}/>
            </Routes>
        </BrowserRouter>
    );
}