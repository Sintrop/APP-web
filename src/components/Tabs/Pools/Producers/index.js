import React, {useEffect, useState} from 'react';
//import './developersPool.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';

//services
import {
    GetTokensPerEra, 
    GetCurrentContractEra, 
    GetBalanceContract, 
    GetBalanceProducer, 
    CheckNextAprove
} from '../../../../services/producerPoolService';
import ProducerService, {GetProducer, WithdrawTokens, GetTotalScoreProducers} from '../../../../services/producerService';
import ProducerItem from './ProducerItem';
import Loading from '../../../Loading';
import { LoadingTransaction } from '../../../LoadingTransaction';

export default function ProducersPool({user, wallet, setTab}){
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
    const {tabActive} = useParams();
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
            if(res.length > 0){

            let producerSort = res.map((item) => item ).sort( (a,b) => parseInt(b.isa.isaScore) - parseInt(a.isa.isaScore))
            
            setProducersList(producerSort)
            } 
        })
        .catch((err) => console.log(err));
    },[])


    async function getInfosPool(){
        const tokensEra = await GetTokensPerEra();
        setTokensPerEra(tokensEra);
        const eraContract = await GetCurrentContractEra();
        setCurrentEra(eraContract);
        const balanceContract = await GetBalanceContract();
        setBalanceContract(balanceContract);
        const scoreProducers = await GetTotalScoreProducers();
        setScoreProducers(scoreProducers);
        if(user === '1'){
            const producer = await GetProducer(wallet);
            setProducerInfo(producer);
            const balanceProducer = await GetBalanceProducer(wallet);
            setBalanceProducer(balanceProducer);
            const nextAprove = await CheckNextAprove(producerInfo.pool.currentEra);
            setNextAprove(nextAprove);
        }
        
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

    return(
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Producers distribution pool</h1>
                <div className='area-btn-header-isa-page'></div>
            </div>
            {user === '1' && (
                <div className='area-stats-developer'>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>Your Status</h1>
                        <p className='p'>
                            Current Era: {producerInfo.pool === undefined ? '0' : producerInfo.pool.currentEra}
                        </p>

                        <p className='p'>
                            Next Aprove In: {nextAprove}
                        </p>
                    </div>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>Balance</h1>
                        <p className='p'>Total: {parseFloat(balanceProducer) / 10**18}</p>
                    </div>

                    {user === '1' && (
                        <button 
                            className='btn-new-category-isa'
                            onClick={() => withdraw()}
                        >Withdraw</button>
                    )}
                    
                </div>
            )}
            
            <div className='area-pool'>
                <div className='stats-developer__card card-pool'>
                    <h1 className='card__title'>Producers Pool 1.0</h1>

                    <h2 className='card__subtitle'>Contract Balance</h2>
                    <p className='p'>{parseFloat(balanceContract) / 10**18}</p>

                    <h2 className='card__subtitle'>Tokens Per ERA</h2>
                    <p className='p'>{parseFloat(tokensPerEra) / 10**18}</p>

                    <h2 className='card__subtitle'>Current ERA</h2>
                    <p className='p'>{currentEra}</p>

                    <h2 className='card__subtitle'>Producers total score</h2>
                    <p className='p'>{scoresProducers}</p>

                </div>

                <div className='stats-developer__card card-developers-list'>
                    <h1 className='card__title'>Producers List</h1>
                    <table border="1">
                        <tr>
                        <th>#</th>
                        <th>Wallet</th>
                        <th>Name</th>
                        <th>Balance</th>
                        <th>Score</th>
                        </tr>
                        {producersList.map((item) => (
                            <ProducerItem 
                                key={item.name}
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