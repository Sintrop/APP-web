import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import ProducerPage from './ProducerPage';
import ActvistPage from './ActivistPage';
import DeveloperPage from './DeveloperPage';
import ResearcherPage from './ResearcherPage';
import AdvisorPage from './AdvisorPage';
import ContributorPage from './ContributorPage';
import InvestorPage from './InvestorPage';

export default function MyAccount({wallet, userType, setTab}){
    const {tabActive} = useParams();

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);
    
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