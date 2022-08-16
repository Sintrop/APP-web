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
import ProducerPage from '../../components/Tabs/ProducerPage';
import ActivistPage from '../../components/Tabs/ActivistPage';
import MyAccount from '../../components/Tabs/MyAccount';

//Services
import CheckUserRegister from '../../services/checkUserRegister';
import HistoryInspections from '../../components/Tabs/HistoryInspections';
import ActivistRanking from '../../components/Tabs/Ranking/Activist';

export default function Dashboard(){
    const navigate = useNavigate();
    const {walletAddress} = useParams();
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
        if(user == 0){
            setActiveTab('register');
            return;
        }
        setActiveTab('isa');
    }, [user]);

    return(
        <div className='container-dashboard'>
            <Menu 
                changeTab={(tab) => setActiveTab(tab)}
            />

            <div className='content-dashboard'>
                <HeaderAccount wallet={walletAddress}/>
                <TabIndicator activeTab={activeTab} wallet={walletAddress}/>

                {activeTab === 'register' && (
                    <Register wallet={walletAddress}/>
                )}

                {activeTab === 'isa' && (
                    <ISA user={user} walletAddress={walletAddress}/>
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
                {activeTab ===  'producer-page' && (
                    <ProducerPage wallet={walletSelect}/>
                )}
                {activeTab === 'activist-page' && (
                    <ActivistPage wallet={walletSelect}/>
                )}
                {activeTab === 'my-account' && (
                    <MyAccount wallet={walletAddress} userType={user}/>
                )}
            </div>
        </div>
    )
}