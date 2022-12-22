import React, {useEffect, useState} from 'react';
//import './developersPool.css';
import {useParams} from 'react-router-dom';

//services
import {GetTokensPerEra, GetCurrentContractEra, GetBalanceContract, GetBalanceProducer} from '../../../../services/producerPoolService';
import ProducerService, {GetProducer, WithdrawTokens} from '../../../../services/producerService';
import ProducerItem from './ProducerItem';
import Loading from '../../../Loading';

export default function ProducersPool({user, wallet, setTab}){
    const producerService = new ProducerService(wallet);
    const [loading, setLoading] = useState(false);
    const [balanceContract, setBalanceContract] = useState('0');
    const [tokensPerEra, setTokensPerEra] = useState('0');
    const [currentEra, setCurrentEra] = useState('0');
    const [producerInfo, setProducerInfo] = useState([]);
    const [balanceProducer, setBalanceProducer] = useState('0');
    const [producersList, setProducersList] = useState([]);
    const {tabActive} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    
    useEffect(() => {
        getInfosPool();
    },[]);


    async function getInfosPool(){
        const tokensEra = await GetTokensPerEra();
        setTokensPerEra(tokensEra);
        const eraContract = await GetCurrentContractEra();
        setCurrentEra(eraContract);
        const balanceContract = await GetBalanceContract();
        setBalanceContract(balanceContract);
        if(user === '1'){
            const producer = await GetProducer(wallet);
            setProducerInfo(producer);
            const balanceProducer = await GetBalanceProducer(wallet);
            setBalanceProducer(balanceProducer);
        }
        const producersRanking = await producerService.getProducerRanking();
        setProducersList(producersRanking);
    }


    async function withdraw(){
        setLoading(true);
        await WithdrawTokens(wallet);
        setLoading(false);
        getInfosPool();
    }

    return(
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Producers Pool</h1>
                <div className='area-btn-header-isa-page'></div>
            </div>
            {user === '1' && (
                <div className='area-stats-developer'>
                    <div className='stats-developer__card card-stats'>
                        <h1 className='card__title'>Your Status</h1>
                        <p className='p'>
                            Current Era: {producerInfo.pool === undefined ? '0' : producerInfo.pool.currentEra}
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

                </div>

                <div className='stats-developer__card card-developers-list'>
                    <h1 className='card__title'>Producers List</h1>
                    <table border="1">
                        <tr>
                        <th>#</th>
                        <th>Wallet</th>
                        <th>Name</th>
                        <th>Balance</th>
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
            {loading && (
                <Loading/>
            )}
        </div>
    )
}