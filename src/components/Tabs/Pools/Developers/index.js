import React, {useEffect, useState} from 'react';
import './developersPool.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
//services
import {
    GetBalancePool, 
    GetEraContract, 
    GetEra, 
    CheckNextAprove, 
    CheckAllowanceTokens,
    GetBalanceDeveloper,
    WithdrawTokens,
    GetDevelopers,
    TokensPerEra
} from '../../../../services/developersPoolService';
import DevelopersService from '../../../../services/developersService';

import DeveloperItem from './DeveloperItem';
import Loading from '../../../Loading';
import { LoadingTransaction } from '../../../LoadingTransaction';

export default function DevelopersPool({user, wallet, setTab}){
    const {t} = useTranslation();
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
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(true);
    
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

    function withdraw(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        WithdrawTokens(wallet)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            if(message.includes("You can't withdraw yet")){
                setLogTransaction({
                    type: 'error',
                    message: "You can't withdraw yet",
                    hash: ''
                })
                return;
            }
            if(message.includes("You don't have SAC Tokens")){
                setLogTransaction({
                    type: 'error',
                    message: "You don't have SAC Tokens",
                    hash: ''
                })
                return;
            }
            if(message.includes("Not a contract pool")){
                setLogTransaction({
                    type: 'error',
                    message: "Not a contract pool",
                    hash: ''
                })
                return;
            }
            if(message.includes("Insufficient balance.")){
                setLogTransaction({
                    type: 'error',
                    message: "Insufficient balance.",
                    hash: ''
                })
                return;
            }
            if(message.includes("Insufficient allowance.")){
                setLogTransaction({
                    type: 'error',
                    message: "Insufficient allowance.",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
    }

    return(
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>{t('Developers Distribution Pool')}</h1>
                <div className='area-btn-header-isa-page'></div>
            </div>
            {user === '4' && (
                <div className='area-stats-developer'>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>{t('Your Status')}</h1>
                        <p className='p'>
                            {t('Level')}: {developerInfo.level === undefined ? '0' : developerInfo.level.level}
                        </p>
                        <p className='p'>
                            {t('Current Era')}: {developerInfo.level === undefined ? '0' : developerInfo.level.currentEra}
                        </p>
                    </div>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>{t('Balance')}</h1>
                        <p className='p'>Total: {parseFloat(tokensAllowed) / 10**18 + parseFloat(balanceDeveloper) / 10**18}</p>
                    </div>
                        <button 
                            className='btn-new-category-isa'
                            onClick={() => {withdraw()}}
                        >{t('Withdraw')}</button>
                </div>
            )}
            
            <div className='area-pool'>
                <div className='stats-developer__card card-pool'>
                    <h1 className='card__title'>{t('Developers Pool')}</h1>
                    <h2 className='card__subtitle'>{t('Contract Balance')}</h2>
                    <p className='p'>{parseFloat(totalSACTokens) / 10**18}</p>

                    <h2 className='card__subtitle'>Tokens {t('Per')} ERA</h2>
                    <p className='p'>{parseFloat(tokensPerEra) / 10**18}</p>

                    <h2 className='card__subtitle'>{t('Current Era')}</h2>
                    <p className='p'>{currentEra}</p>

                    <h2 className='card__subtitle'>{t('Next Aprove In')}</h2>
                    <p className='p'>{nextAprove}</p>

                    <h2 className='card__subtitle'>{t('Developers Levels Sum')}</h2>
                    <p className='p'>{eraInfo.levels}</p>
                </div>

                <div className='stats-developer__card card-developers-list'>
                    <h1 className='card__title'>{t('Developers List')}</h1>
                    <table border="1">
                        <tr>
                        <th>#</th>
                        <th>{t('Wallet')}</th>
                        <th>{t('Name')}</th>
                        <th>{t('Balance')}</th>
                        <th>{t('Developer Level')}</th>
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
            <Dialog.Root 
                open={modalTransaction} 
                onOpenChange={(open) => {
                    if(!loadingTransaction){
                        setModalTransaction(open);
                        getInfosPool();
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
            {loading && (
                <Loading/>
            )}
        </div>
    )
}