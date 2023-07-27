import React, {useEffect, useState} from 'react';
//import './developersPool.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import {useMainContext} from '../../../../hooks/useMainContext';
//services
import {
    GetTokensPerEra, 
    GetCurrentContractEra, 
    GetBalanceContract, 
    GetBalanceProducer, 
    CheckNextAprove,
} from '../../../../services/producerPoolService';
import ProducerService, {GetProducer, WithdrawTokens, GetTotalScoreProducers} from '../../../../services/producerService';
import ProducerItem from './ProducerItem';
import Loading from '../../../Loading';
import { LoadingTransaction } from '../../../LoadingTransaction';
import { UserPoolItem } from '../../../UserPoolItem';
import { BackButton } from '../../../BackButton';
import Loader from '../../../Loader';

export default function ProducersPool({wallet, setTab}){
    const {user, nextEraIn} = useMainContext();
    const {t} = useTranslation();
    const producerService = new ProducerService(wallet);
    const [loading, setLoading] = useState(false);
    const [balanceContract, setBalanceContract] = useState('0');
    const [tokensPerEra, setTokensPerEra] = useState('0');
    const [currentEra, setCurrentEra] = useState('0');
    const [producerInfo, setProducerInfo] = useState([]);
    const [balanceProducer, setBalanceProducer] = useState('0');
    const [scoresProducers, setScoreProducers] = useState('0');
    const [nextAprove, setNextAprove] = useState('0');
    const [producersList, setProducersList] = useState([]);
    const {tabActive, walletAddress, typeUser} = useParams();
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    
    useEffect(() => {
        getInfosPool();
    },[]);

    useEffect(() => {
        producerService
        .getProducerRanking()
        .then((res) =>{
            filterUsersPool(res);
        })
        .catch((err) => console.log(err));
    },[])


    async function getInfosPool(){
        setLoading(true);
        const tokensEra = await GetTokensPerEra();
        setTokensPerEra(tokensEra);
        const eraContract = await GetCurrentContractEra();
        setCurrentEra(eraContract);
        const balanceContract = await GetBalanceContract();
        setBalanceContract(balanceContract);
        // const scoreProducers = await GetTotalScoreProducers();
        // setScoreProducers(scoreProducers);
        if(typeUser === '1'){
            const producer = await GetProducer(walletAddress);
            setProducerInfo(producer);
            const balanceProducer = await GetBalanceProducer(walletAddress);
            setBalanceProducer(balanceProducer);
            const nextAprove = await CheckNextAprove(producer.pool?.currentEra);
            setNextAprove(nextAprove);
        }
        setLoading(false)
    }


    async function withdraw(){
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
            if(message.includes("Minimum inspections")){
                setLogTransaction({
                    type: 'error',
                    message: "Minimum inspections",
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
            if(Number(array[i].isa.isaScore) > 0){
                const balance = await GetBalanceProducer(array[i].producerWallet)
                if(Number(balance) > 0){
                    let data = {
                        producerWallet: array[i].producerWallet,
                        name: array[i].name,
                        isaScore: array[i].isa.isaScore,
                        balance: Number(balance),
                        userType: '1'
                    }
    
                    newArray.push(data);
                }

            }
        }

        let producerSort = newArray.map((item) => item ).sort( (a,b) => parseInt(b.balance) + parseInt(a.balance))
        setProducersList(producerSort)
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
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Producers Pool')}</h1>
                </div>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                <div className="flex items-center p-3 rounded-md bg-[#0a4303] w-[344px] mb-5">
                    <p className="font-bold text-white">{t('Next ERA in')} {nextEraIn} {t('Blocks')}</p>
                </div>
                {user === '1' && (
                    <div className="flex flex-col lg:flex-row lg:items-center w-full lg:w-[700px] gap-3 mb-7">
                        <div className="flex flex-col lg:w-[49%] px-2 py-4 bg-[#0A4303] rounded-md">
                            <p className="font-bold text-white">{t('Your Status')}</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">{t('Current ERA')}:</p>
                                <p className="font-bold text-[#ff9900]">{producerInfo?.pool?.currentEra}</p>
                            </div>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white ">{t('Next Withdrawal on')}:</p>
                                <p className="font-bold text-[#ff9900]">{nextAprove} {t('Blocks')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:w-[49%] h-full px-2 py-4 bg-[#0A4303] rounded-md">
                            <p className="font-bold text-white">{t('Balance')}</p>
                            <div className='flex items-center justify-between mt-2'>
                                <p className="text-white">Total:</p>
                                <p className="font-bold text-[#ff9900]">{(balanceProducer / 10 ** 18).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="lg:w-[700px] bg-[#0A4303] flex flex-col rounded-md">
                    <div className="flex w-full">
                        <div className="flex flex-col py-5 px-3 gap-2 w-[50%]">
                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-sm lg:text-normal text-[#ff9900]">{t('Contract Balance')}</p>
                                <p className="font-bold text-white text-sm lg:text-normal">{(balanceContract / 10 ** 18).toFixed(2)}</p>
                            </div>

                            <div className="p-2 border-2 flex flex-col w-full">
                                <p className="font-bold text-[#ff9900] text-sm lg:text-normal">Tokens por ERA</p>
                                <p className="font-bold text-white text-sm lg:text-normal">{tokensPerEra / 10 ** 18}</p>
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
                        <div>
                            <p className="font-bold text-white text-sm lg:text-normal">{t("Producers' total score")}</p>
                            <p className="font-bold text-[#ff9900] text-sm lg:text-normal">{scoresProducers}</p>
                        </div>

                        
                        {user === '1' && (
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
                            <p className='font-bold text-white text-lg lg:text-2xl border-b-2 pb-1'>{t('List of Approved Producers')}</p>
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
                                <p className='font-bold text-white'>{t('Score')}</p>
                            </div>
                            <div className='flex justify-center w-[20%] px-1 py-3 bg-[#783E19] border-t-2 border-l-2 border-[#3E9EF5]'>
                                <p className='font-bold text-white'>{t('Balance')}</p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            {producersList.map((item, index) => (
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