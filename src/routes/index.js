import {BrowserRouter, Route, Routes} from "react-router-dom";

import AccountProducer from "../pages/accountProducer";
import AccountInvestor from '../pages/accountInvestor';
import OnlyOwner from "../pages/onlyOwner";
import IndicesControl from "../pages/indicesControl";
import { RequestSepolia } from "../pages/RequestSepolia";
import { ViewImage } from "../pages/ViewImage";
import { Checkout } from "../pages/checkout";
import { ViewPdf } from "../pages/ViewPdf";
import {Education} from '../pages/Education';

//
import { Home } from "../pages/Home";
import { Centers } from "../pages/Centers";
import { RegenerationCredit } from "../pages/RegenerationCredit";
import { Community } from "../pages/Community";
import { Actions } from '../pages/Actions';
import { UserDetails } from "../pages/UserDetails/UserDetails";
import { InspectionsCenter } from "../pages/InspectionsCenter";
import { ResultInspection } from "../pages/ResultInspection";
import { ResearchesCenter } from "../pages/ResearchesCenter";
import { Ranking } from "../pages/Community/Ranking/Ranking";
import { Market } from "../pages/RegenerationCredit/Market";
import { Pools } from "../pages/RegenerationCredit/Pools";
import { Services } from "../pages/RegenerationCredit/Services";
import { MyTokens } from "../pages/RegenerationCredit/MyTokens";
import { Ico } from "../pages/RegenerationCredit/Ico";
import { PreSale } from "../pages/RegenerationCredit/PreSale";
import { Publication } from "../pages/Publication";
import { Impact } from "../pages/RegenerationCredit/Impact";
import { ViewBooking } from "../pages/RegenerationCredit/PreSale/ViewBookings";
import { Profile } from "../pages/Profile";
import { DeveloperCenter } from "../pages/Centers/DeveloperCenter";
import { ValidationCenter } from "../pages/Centers/ValidationCenter/ValidationCenter";
import { ImpactCalculator } from "../pages/ImpactCalculator";
import { MethodSintrop } from "../pages/Methods/Sintrop";
import { ActivistCenter } from "../pages/Centers/ActivistCenter";
import { Researche } from "../pages/Researche";
import { ContentDetails } from "../pages/Education/ContentDetails";
import { Player } from "../pages/Education/Player";
import { ColaborativeCenter } from "../pages/Centers/ColaborativeCenter";

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
                <Route exact path="/services" element={<Services/>}/>
                <Route exact path="/pools/:poolType" element={<Pools/>}/>
                <Route exact path="/my-tokens" element={<MyTokens/>}/>
                <Route exact path="/ico" element={<Ico/>}/>
                <Route exact path="/pre-sale" element={<PreSale/>}/>
                <Route exact path="/publication/:id" element={<Publication/>}/>
                <Route exact path="/producer/:walletSelected" element={<AccountProducer/>}/>
                <Route exact path="/supporter/:walletSelected" element={<AccountInvestor/>}/>
                <Route exact path="/impact" element={<Impact/>}/>
                <Route exact path="/bookings" element={<ViewBooking/>}/>
                <Route exact path="/profile" element={<Profile/>}/>
                <Route exact path="/development-center" element={<DeveloperCenter/>}/>
                <Route exact path="/validation-center" element={<ValidationCenter/>}/>
                <Route exact path="/activist-center" element={<ActivistCenter/>}/>
                <Route exact path="/impact-calculator" element={<ImpactCalculator/>}/>
                <Route exact path="/methods/sintrop" element={<MethodSintrop/>}/>
                <Route exact path="/researche/:id" element={<Researche/>}/>
                <Route exact path="/education" element={<Education/>}/>
                <Route exact path="/content/:id" element={<ContentDetails/>}/>
                <Route exact path="/content/player/:fileServer" element={<Player/>}/>
                <Route exact path="/colaborative-center" element={<ColaborativeCenter/>}/>
                
                <Route exact path="/only-owner" element={<OnlyOwner/>}/>
                <Route exact path="/indices-control" element={<IndicesControl/>}/>
                <Route exact path="/requests-sepolia" element={<RequestSepolia/>}/>
                <Route exact path="/view-image/:hashPhoto" element={<ViewImage/>}/>
                <Route exact path="/checkout" element={<Checkout/>}/>
                <Route exact path="/view-pdf/:hash" element={<ViewPdf/>}/>
            </Routes>
        </BrowserRouter>
    );
}