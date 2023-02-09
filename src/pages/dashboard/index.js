import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './dashboard.css';

//Components
import Menu from '../../components/Menu';
import HeaderAccount from '../../components/HeaderAccount';
import TabIndicator from '../../components/TabIndicator';
import ManageInspections from '../../components/Tabs/ManageInspections';

//Tabs
import Register from '../../components/Tabs/Register';
import ISA from '../../components/Tabs/ISA';
import ProducerRanking from '../../components/Tabs/Ranking/Producer';
import ProducerPage from '../../components/Tabs/MyAccount/ProducerPage';
import ActivistPage from '../../components/Tabs/MyAccount/ActivistPage';
import DeveloperPage from '../../components/Tabs/MyAccount/DeveloperPage';
import ResearcherPage from '../../components/Tabs/MyAccount/ResearcherPage';
import InvestorPage from '../../components/Tabs/MyAccount/InvestorPage';
import ContributorPage from '../../components/Tabs/MyAccount/ContributorPage';
import AdvisorPage from '../../components/Tabs/MyAccount/AdvisorPage';
import MyAccount from '../../components/Tabs/MyAccount';
import ProducerCertificate from '../../components/Tabs/Certificate';
import InvestorCertificate from '../../components/Tabs/Certificate/Investor';
import DevelopersPool from '../../components/Tabs/Pools/Developers';
import ReportsPage from '../../components/Tabs/Reports';
import ProducersPool from '../../components/Tabs/Pools/Producers';
import ResearchesPage from '../../components/Tabs/Researches';

//Services
import CheckUserRegister from '../../services/checkUserRegister';
import HistoryInspections from '../../components/Tabs/HistoryInspections';
import ActivistRanking from '../../components/Tabs/Ranking/Activist';
import DevelopersRanking from '../../components/Tabs/Ranking/Developers';
import ContributorsRanking from '../../components/Tabs/Ranking/Contributors';
import InvestorRanking from '../../components/Tabs/Ranking/Investor';
import ResearchersRanking from '../../components/Tabs/Ranking/Researchers';
import AdvisorsRanking from '../../components/Tabs/Ranking/Advisors';

export default function Dashboard(){
    const navigate = useNavigate();
    const {walletAddress, tabActive} = useParams();
    const [activeTab, setActiveTab] = useState('isa');
    const {user} = CheckUserRegister({walletAddress: walletAddress});
    const [walletSelect, setWalletSelect] = useState('');

    useEffect(() => {
        async function checkConnection(){
            if(window.ethereum){
                await window.ethereum.request({
                    method: 'eth_accounts'
                })
                .then((accounts) => {
                    if(accounts.length == 0){
                        navigate('/')
                    }else{
                        if(accounts[0] != walletAddress){
                            navigate('/')
                        }
                    }
                })
                .catch(() => {
                    console.log('error')
                })
            }
        }
        checkConnection();
    },[]);

    useEffect(() => {
        if(user === 0){
            setActiveTab('register');
            return;
        }
        setActiveTab(tabActive);
    }, [user]);

    return(
        <div className='container-dashboard'>
            <Menu 
                changeTab={(tab) => {
                    setActiveTab(tab)
                    if(tab === 'my-account'){
                        navigate(`/dashboard/${walletAddress}/${tab}/${walletAddress}`)
                    }else{
                        navigate(`/dashboard/${walletAddress}/${tab}/main`)
                    }
                }}
            />

            <div className='content-dashboard'>
                <HeaderAccount wallet={walletAddress}/>
                <TabIndicator activeTab={activeTab} wallet={walletAddress}/>

                {activeTab === 'register' && (
                    <Register wallet={walletAddress}/>
                )}

                {activeTab === 'isa' && (
                    <ISA 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'manage-inspections' && (
                    <ManageInspections 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'inspection-history' && (
                    <HistoryInspections 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'producers' && (
                    <ProducerRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'activists' && (
                    <ActivistRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'developers' && (
                    <DevelopersRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'contributors' && (
                    <ContributorsRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'investors' && (
                    <InvestorRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'researchers' && (
                    <ResearchersRanking
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'advisors' && (
                    <AdvisorsRanking
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab ===  'producer-page' && (
                    <ProducerPage 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'activist-page' && (
                    <ActivistPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'developer-page' && (
                    <DeveloperPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'researcher-page' && (
                    <ResearcherPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'advisor-page' && (
                    <AdvisorPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'contributor-page' && (
                    <ContributorPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'investor-page' && (
                    <InvestorPage 
                        wallet={walletSelect}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'my-account' && (
                    <MyAccount 
                        wallet={walletAddress} 
                        userType={user}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'producer-certificate' && (
                    <ProducerCertificate 
                        userType={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'investor-certificate' && (
                    <InvestorCertificate 
                        userType={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'developers-pool' && (
                    <DevelopersPool 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'producers-pool' && (
                    <ProducersPool 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'delations' && (
                    <ReportsPage 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'researches' && (
                    <ResearchesPage 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
            </div>
        </div>
    )
}