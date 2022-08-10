import {BrowserRouter, Route, Routes} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from '../pages/dashboard';
<<<<<<< HEAD
import Register from "../components/Tabs/Register";
import ProducerPage from "../pages/producerPage";
=======
import ProducerRanking from "../components/Tabs/Ranking/Producer";
import ActivistRanking from "../components/Tabs/Ranking/Activist";
>>>>>>> 606060eb5aa0c0181589789e7856d4980882ceab

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/dashboard/:walletAddress" element={<Dashboard/>}/>
<<<<<<< HEAD
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/producer-page/:walletAddress" element={<ProducerPage/>}/>
=======
                <Route exact path="/producers-ranking" element={ <ProducerRanking />}/>
                <Route exact path="/activists-ranking" element={ <ActivistRanking />}/>
>>>>>>> 606060eb5aa0c0181589789e7856d4980882ceab
            </Routes>
        </BrowserRouter>
    );
}