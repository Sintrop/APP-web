import React, {useEffect, useState} from 'react';
import './developersPool.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../hooks/useMainContext';
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
import { UserPoolItem } from '../../../UserPoolItem';

export default function DevelopersPool({wallet, setTab}){
    const {user} = useMainContext();
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
        <div className='flex flex-col h-[100vh] bg-green-950 px-10 pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-10'>
                <h1 className="font-bold text-2xl text-white">{t('Developers Pool')}</h1>
                <div className='flex items-center gap-2'>
                    <button
                        className='px-4 py-2 bg-[#ff9900] rounded-md font-bold '
                        onClick={() => {}}
                    >
                        {t('Withdraw')} Tokens
                    </button>
                </div>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                {user === '1' && (
                    <div className="flex items-center w-[700px] gap-3 mb-7">
                        <div className="flex flex-col w-[49%] px-2 py-4 bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md">
                            <p className="font-bold text-white">Seu Status</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">ERA Atual:</p>
                                <p className="font-bold text-[#ff9900]">10</p>
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white ">Próxima aprovação em:</p>
                                <p className="font-bold text-[#ff9900]">5</p>
                            </div>
                        </div>

                        <div className="flex flex-col w-[49%] h-full px-2 py-4 bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md">
                            <p className="font-bold text-white">Saldo</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">Total:</p>
                                <p className="font-bold text-[#ff9900]">458796.0000</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="lg:w-[700px] bg-[#0A4303] flex flex-col border-2 border-[#3E9EF5] rounded-md">
                    <div className="flex w-full">
                        <div className="flex flex-col py-5 px-3 gap-2 w-[50%]">
                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">Saldo do contrato</p>
                                <p className="font-bold text-white">454585.00000</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">Tokens por ERA</p>
                                <p className="font-bold text-white">456.000</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">ERA atual</p>
                                <p className="font-bold text-white">123</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center w-[50%] h-full'>
                            <img
                                src={require('../../../../assets/token.png')}
                                className='w-[250px] h-[250px] object-contain'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col w-full px-4 py-2 bg-[#783E19] mb-3 border-2 border-[#3E9EF5]'>
                        <p className="font-bold text-white">Soma total dos níveis dos desenvolvedores</p>
                        <p className="font-bold text-[#ff9900]">456</p>
                    </div>

                </div>
                    <div className='flex flex-col lg:w-[700px] bg-[#0a4303] border-2 border-[#3E9EF5] rounded-sm pl-2 pt-2 mt-10'>
                        <div className='flex items-center justify-center w-full'>
                            <p className='font-bold text-white text-2xl border-b-2 pb-1'>Lista de desenvolvedores</p>
                        </div>
                        <div className='flex w-full items-center'>
                            <div className='flex w-[5%] px-1 py-3'>
                                <p className='font-bold text-white'>#</p>
                            </div>
                            <div className='flex justify-center w-[20%] px-1 py-3'>
                                <p className='font-bold text-white'>{t('Wallet')}</p>
                            </div>
                            <div className='flex justify-center w-[30%] px-1 py-3'>
                                <p className='font-bold text-white'>{t('Name')}</p>
                            </div>
                            <div className='flex justify-center w-[25%] px-1 py-3'>
                                <p className='font-bold text-white'>{t('Balance')}</p>
                            </div>
                            <div className='flex justify-center w-[20%] px-1 py-3 bg-[#783E19] border-t-2 border-l-2 border-[#3E9EF5]'>
                                <p className='font-bold text-white'>{t('Score')}</p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            {developersList.map((item, index) => (
                                <UserPoolItem
                                    data={item}
                                    position={index + 1}
                                />
                            ))}
                        </div>
                    </div>
            </div>
        </div>
    )

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