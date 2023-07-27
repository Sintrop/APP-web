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
    GetBalanceDeveloper,
    WithdrawTokens,
    GetDevelopers,
    TokensPerEra
} from '../../../../services/developersPoolService';
import {GetDeveloper} from '../../../../services/developersService';

import Loading from '../../../Loading';
import { LoadingTransaction } from '../../../LoadingTransaction';
import { UserPoolItem } from '../../../UserPoolItem';
import { BackButton } from '../../../BackButton';
import Loader from '../../../Loader';

export default function DevelopersPool({wallet, setTab}){
    const {user, nextEraIn} = useMainContext();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [totalSACTokens, setTotalSACTokens] = useState('0');
    const [tokensPerEra, setTokensPerEra] = useState('0');
    const [currentEra, setCurrentEra] = useState('0');
    const [eraInfo, setEraInfo] = useState([]);
    const [developerInfo, setDeveloperInfo] = useState([]);
    const [nextAprove, setNextAprove] = useState('0');
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');
    const [developersList, setDevelopersList] = useState([]);
    const {tabActive, walletAddress, typeUser} = useParams();
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
        filterUsersPool(developers);
        const totalTokens = await GetBalancePool();
        setTotalSACTokens(totalTokens);
        const tokensPerEra = await TokensPerEra();
        setTokensPerEra(tokensPerEra);
        const currentEra = await GetEraContract();
        setCurrentEra(currentEra);
        const eraInfo = await GetEra(parseFloat(currentEra));
        setEraInfo(eraInfo);
        if(typeUser === '4'){
            const developerInfo = await GetDeveloper(walletAddress);
            setDeveloperInfo(developerInfo);
            console.log(developerInfo)
            const nextAprove = await CheckNextAprove(developerInfo.pool.currentEra);
            setNextAprove(nextAprove);
            const balanceDeveloper = await GetBalanceDeveloper(walletAddress);
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

    async function filterUsersPool(array){
        let newArray = [];
        for(var i = 0; i < array.length; i++){
            if(Number(array[i].pool?.level) > 0){
                const balance = await GetBalanceDeveloper(array[i].developerWallet)
                if(Number(balance) > 0){
                    let data = {
                        developerWallet: array[i].developerWallet,
                        name: array[i].name,
                        balance: Number(balance),
                        userType: '4',
                        level: array[i].pool?.level
                    }
    
                    newArray.push(data);
                }

            }
        }

        let developerSort = newArray.map((item) => item ).sort( (a,b) => parseInt(b.balance) + parseInt(a.balance))
        setDevelopersList(developerSort)
    }

    if(loading){
        return(
            <div className="flex items-center justify-center bg-green-950 w-full h-screen">
                <Loader
                    color='white'
                    type='hash'
                />
            </div>
        )
    }

    return(
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-10'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Developers Pool')}</h1>
                </div>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                <div className="flex items-center p-3 rounded-md bg-[#0a4303] w-[344px] mb-5">
                    <p className="font-bold text-white">{t('Next ERA in')} {nextEraIn} {t('Blocks')}</p>
                </div>
                {user === '4' && (
                    <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-[700px] gap-3 mb-7">
                        <div className="flex flex-col lg:w-[49%] px-2 py-4 bg-[#0A4303] rounded-md">
                            <p className="font-bold text-white">{t('Your Status')}</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">{t('Current ERA')}:</p>
                                <p className="font-bold text-[#ff9900]">{developerInfo?.pool?.currentEra}</p>
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white ">{t('Next Withdrawal on')}:</p>
                                <p className="font-bold text-[#ff9900]">{nextAprove}</p>
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white ">{t('Level')}:</p>
                                <p className="font-bold text-[#ff9900]">{developerInfo?.pool?.level}</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:w-[49%] h-full px-2 py-4 bg-[#0A4303] rounded-md">
                            <p className="font-bold text-white">t{('Balance')}</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">Total:</p>
                                <p className="font-bold text-[#ff9900]">{(Number(balanceDeveloper) / 10 ** 18).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="lg:w-[700px] bg-[#0A4303] flex flex-col rounded-md">
                    <div className="flex w-full">
                        <div className="flex flex-col py-5 px-3 gap-2 w-[50%]">
                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900] text-sm lg:text-normal">{t('Contract Balance')}</p>
                                <p className="font-bold text-white text-sm lg:text-normal">{totalSACTokens / 10 ** 18}</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900] text-sm lg:text-normal">Tokens por ERA</p>
                                <p className="font-bold text-white text-sm lg:text-normal">{(tokensPerEra / 10 ** 18).toFixed(2)}</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900] text-sm lg:text-normal">{t('Current ERA')}</p>
                                <p className="font-bold text-white text-sm lg:text-normal">{currentEra}</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center w-[50%] h-full'>
                            <img
                                src={require('../../../../assets/token.png')}
                                className='w-[250px] h-[250px] object-contain'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between w-full px-4 py-2 bg-[#783E19] mb-3'>
                        <div className='flex flex-col'>
                            <p className="font-bold text-white text-sm lg:text-normal">{t('Total sum of developer levels')}</p>
                            <p className="font-bold text-[#ff9900] text-sm lg:text-normal">{eraInfo?.levels}</p>
                        </div>

                        {user === '4' && (
                            <button
                                className='px-4 py-2 bg-[#ff9900] rounded-md font-bold text-sm lg:text-normal'
                                onClick={withdraw}
                            >
                                {t('Withdraw')} Tokens
                            </button>
                        )}
                    </div>

                </div>
                    <div className='flex flex-col lg:w-[700px] bg-[#0a4303] rounded-sm pl-2 pt-2 mt-10'>
                        <div className='flex items-center justify-center w-full'>
                            <p className='font-bold text-center text-white text-lg lg:text-2xl border-b-2 pb-1'>{t('List of Approved Developers')}</p>
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
                                <p className='font-bold text-white'>{t('Level')}</p>
                            </div>
                            <div className='flex justify-center w-[20%] px-1 py-3 bg-[#783E19] border-t-2 border-l-2 border-[#3E9EF5]'>
                                <p className='font-bold text-white'>{t('Balance')}</p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            {developersList.map((item, index) => (
                                <UserPoolItem
                                    key={item.id}
                                    data={item}
                                    position={index + 1}
                                />
                            ))}
                        </div>
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