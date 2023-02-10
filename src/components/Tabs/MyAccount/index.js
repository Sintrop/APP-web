import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {MainContext} from '../../../contexts/main';
import ProducerPage from './ProducerPage';
import ActvistPage from './ActivistPage';
import DeveloperPage from './DeveloperPage';
import ResearcherPage from './ResearcherPage';
import AdvisorPage from './AdvisorPage';
import ContributorPage from './ContributorPage';
import InvestorPage from './InvestorPage';

export default function MyAccount({wallet, userType, setTab}){
    const navigate = useNavigate();
    const {user, walletConnected, chooseModalRegister} = useContext(MainContext);
    const {tabActive, walletAddress} = useParams();

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive]);

    useEffect(() => {
        if(user === '0'){
            chooseModalRegister()
        }
    },[])
    
    return(
        <div>
            {userType === '1' && (
                <ProducerPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '2' && (
                <ActvistPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '3' && (
                <ResearcherPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '4' && (
                <DeveloperPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '5' && (
                <AdvisorPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '6' && (
                <ContributorPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}

            {userType === '7' && (
                <InvestorPage 
                    wallet={wallet}
                    setTab={(tab, wallet) => setTab(tab, wallet)}
                />
            )}
        </div>
    )
}