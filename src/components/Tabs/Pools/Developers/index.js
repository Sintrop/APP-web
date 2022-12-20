import React, {useEffect, useState} from 'react';
import './developersPool.css';
import {useParams} from 'react-router-dom';

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
    GetDevelopers,
    TokensPerEra
} from '../../../../services/developersPoolService';
import DevelopersService from '../../../../services/developersService';

import DeveloperItem from './DeveloperItem';
import Loading from '../../../Loading';

export default function DevelopersPool({user, wallet, setTab}){
    const developerService = new DevelopersService(wallet);
    const [loading, setLoading] = useState(false);
    const [totalSACTokens, setTotalSACTokens] = useState('0');
    const [tokensPerEra, setTokensPerEra] = useState('0');
    const [currentEra, setCurrentEra] = useState('0');
    const [eraInfo, setEraInfo] = useState([]);
    const [developerInfo, setDeveloperInfo] = useState([]);
    const [nextAprove, setNextAprove] = useState('0');
    const [tokensAllowed, setTokensAllowed] = useState('0');
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');
    const [developersList, setDevelopersList] = useState([]);
    const {tabActive} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    
    useEffect(() => {
        getInfosPool();
    },[]);


    async function getInfosPool(){
        setLoading(true);
        const developers = await GetDevelopers();
        setDevelopersList(developers);
        const totalTokens = await GetBalancePool();
        setTotalSACTokens(totalTokens);
        const tokensPerEra = await TokensPerEra();
        setTokensPerEra(tokensPerEra);
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
            setLoading(false);
        }
        setLoading(false);
    }

    async function aproveTokens(){
        setLoading(true);
        await AproveTokens(wallet)
        setLoading(false);
        getInfosPool();
    }

    async function withdraw(){
        setLoading(true);
        await WithdrawTokens(wallet, tokensAllowed);
        setLoading(false);
        getInfosPool();
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
                        <h1 className='card__title'>Your Status</h1>
                        <p className='p'>
                            Level: {developerInfo.level === undefined ? '0' : developerInfo.level.level}
                        </p>
                        <p className='p'>
                            Current Era: {developerInfo.level === undefined ? '0' : developerInfo.level.currentEra}
                        </p>
                    </div>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>Balance</h1>
                        <p className='p'>Allowed: {parseFloat(tokensAllowed) / 10**18}</p>
                        <p className='p'>Cleared: {parseFloat(balanceDeveloper) / 10**18}</p>
                        <p className='p'>Total: {parseFloat(tokensAllowed) / 10**18 + parseFloat(balanceDeveloper) / 10**18}</p>
                    </div>

                    {parseFloat(nextAprove) < 1 && (
                        <button 
                            className="btn-create-create-category"
                            onClick={() => aproveTokens()}
                        >Aprove Tokens</button>
                    )}

                    {parseFloat(tokensAllowed) > 0 && (
                        <button 
                            className='btn-new-category-isa'
                            onClick={() => withdraw()}
                        >Withdraw</button>
                    )}
                    
                </div>
            )}
            
            <div className='area-pool'>
                <div className='stats-developer__card card-pool'>
                    <h1 className='card__title'>Developers Pool 1.0</h1>
                    <h2 className='card__subtitle'>Total SAC Tokens</h2>
                    <p className='p'>{parseFloat(totalSACTokens) / 10**18}</p>

                    <h2 className='card__subtitle'>Tokens Per ERA</h2>
                    <p className='p'>{parseFloat(tokensPerEra) / 10**18}</p>

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
                            <DeveloperItem 
                                data={item}
                                setTab={(tab, wallet) => setTab(tab, wallet)}
                            />
                        ))}
                    </table>
                </div>
            </div>
            {loading && (
                <Loading/>
            )}
        </div>
    )
}