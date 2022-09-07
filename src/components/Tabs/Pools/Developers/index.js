import React, {useEffect, useState} from 'react';
import './developersPool.css';

//services
import {
    GetBalancePool, 
    GetEraContract, 
    GetEra, 
    CheckNextAprove, 
    CheckAllowanceTokens,
    GetBalanceDeveloper,
    AproveTokens,
    WithdrawTokens,
    GetDevelopers
} from '../../../../services/developersPoolService';
import DevelopersService from '../../../../services/developersService';

import DeveloperItem from './DeveloperItem';

export default function DevelopersPool({user, wallet}){
    const developerService = new DevelopersService(wallet);
    const [loading, setLoading] = useState(false);
    const [totalSACTokens, setTotalSACTokens] = useState('0');
    const [currentEra, setCurrentEra] = useState('0');
    const [eraInfo, setEraInfo] = useState([]);
    const [developerInfo, setDeveloperInfo] = useState([]);
    const [nextAprove, setNextAprove] = useState('0');
    const [tokensAllowed, setTokensAllowed] = useState('0');
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');
    const [developersList, setDevelopersList] = useState([]);

    useEffect(() => {
        getInfosPool();
    },[]);

    async function getInfosPool(){
        const developers = await GetDevelopers();
        setDevelopersList(developers);
        const totalTokens = await GetBalancePool();
        setTotalSACTokens(totalTokens);
        const currentEra = await GetEraContract();
        setCurrentEra(currentEra);
        const eraInfo = await GetEra(parseFloat(currentEra));
        setEraInfo(eraInfo);
        if(user === '4'){
            const developerInfo = await developerService.getDeveloper(wallet);
            setDeveloperInfo(developerInfo);
            const nextAprove = await CheckNextAprove(developerInfo.level.currentEra);
            setNextAprove(nextAprove);
            const tokensAllowed = await CheckAllowanceTokens(wallet);
            setTokensAllowed(tokensAllowed);
            const balanceDeveloper = await GetBalanceDeveloper(wallet);
            setBalanceDeveloper(balanceDeveloper);
        }
    }

    async function aproveTokens(){
        setLoading(true);
        await AproveTokens(wallet)
        setLoading(false);
    }

    async function withdraw(){
        setLoading(true);
        await WithdrawTokens(wallet, tokensAllowed);
        setLoading(false);
    }

    return(
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Developers Pool</h1>
                <div className='area-btn-header-isa-page'></div>
            </div>
            {user === '4' && (
                <div className='area-stats-developer'>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>My Level</h1>
                        <p className='card__title p-level'>
                            {developerInfo.level === undefined ? '0' : developerInfo.level.level}
                        </p>
                    </div>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>Balance</h1>
                        <p className='p'>Allowed: {parseFloat(tokensAllowed) / 1000000000000000000}</p>
                        <p className='p'>Cleared: {parseFloat(balanceDeveloper) / 1000000000000000000}</p>
                        <p className='p'>Total: {parseFloat(tokensAllowed) / 1000000000000000000 + parseFloat(balanceDeveloper) / 1000000000000000000}</p>
                    </div>

                    <button 
                        className="btn-create-create-category"
                        onClick={() => aproveTokens()}
                    >Aprove</button>
                    <button 
                        className='btn-new-category-isa'
                        onClick={() => withdraw()}
                    >Withdraw</button>
                </div>
            )}
            
            <div className='area-pool'>
                <div className='stats-developer__card card-pool'>
                    <h1 className='card__title'>Developers Pool 1.0</h1>
                    <h2 className='card__subtitle'>Total SAC Tokens</h2>
                    <p className='p'>{parseFloat(totalSACTokens) / 1000000000000000000}</p>

                    <h2 className='card__subtitle'>Tokens Per ERA</h2>
                    <p className='p'>{eraInfo.tokens}</p>

                    <h2 className='card__subtitle'>Current ERA</h2>
                    <p className='p'>{currentEra}</p>

                    <h2 className='card__subtitle'>Next Aprove In</h2>
                    <p className='p'>{nextAprove}</p>

                    <h2 className='card__subtitle'>Developers Levels Sum</h2>
                    <p className='p'>{eraInfo.levels}</p>
                </div>

                <div className='stats-developer__card card-developers-list'>
                    <h1 className='card__title'>Developers List</h1>
                    <table border="1">
                        <tr>
                        <th>#</th>
                        <th>Wallet</th>
                        <th>Name</th>
                        <th>Approved Tokens</th>
                        <th>Developer Level</th>
                        </tr>
                        {developersList.map((item) => (
                            <DeveloperItem data={item}/>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    )
}