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
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 lg:mb-10'>
                <h1 className="font-bold text-2xl text-white">{t('Developers Pool')}</h1>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                {user === '4' && (
                    <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-[700px] gap-3 mb-7">
                        <div className="flex flex-col lg:w-[49%] px-2 py-4 bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md">
                            <p className="font-bold text-white">Seu Status</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">ERA Atual:</p>
                                <p className="font-bold text-[#ff9900]">{developerInfo?.level?.currentEra}</p>
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white ">Próxima aprovação em:</p>
                                <p className="font-bold text-[#ff9900]">{nextAprove}</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:w-[49%] h-full px-2 py-4 bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md">
                            <p className="font-bold text-white">Saldo</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">Total:</p>
                                <p className="font-bold text-[#ff9900]">{balanceDeveloper}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="lg:w-[700px] bg-[#0A4303] flex flex-col border-2 border-[#3E9EF5] rounded-md">
                    <div className="flex w-full">
                        <div className="flex flex-col py-5 px-3 gap-2 w-[50%]">
                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">Saldo do contrato</p>
                                <p className="font-bold text-white">{totalSACTokens / 10 ** 18}</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">Tokens por ERA</p>
                                <p className="font-bold text-white">{tokensPerEra / 10 ** 18}</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900]">ERA atual</p>
                                <p className="font-bold text-white">{currentEra}</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center w-[50%] h-full'>
                            <img
                                src={require('../../../../assets/token.png')}
                                className='w-[250px] h-[250px] object-contain'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between w-full px-4 py-2 bg-[#783E19] mb-3 border-2 border-[#3E9EF5]'>
                        <div className='flex flex-col'>
                            <p className="font-bold text-white">Soma total dos níveis dos desenvolvedores</p>
                            <p className="font-bold text-[#ff9900]">{eraInfo?.levels}</p>
                        </div>

                        {user === '4' && (
                            <button
                                className='px-4 py-2 bg-[#ff9900] rounded-md font-bold '
                                onClick={withdraw}
                            >
                                {t('Withdraw')} Tokens
                            </button>
                        )}
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
}