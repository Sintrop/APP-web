import React, { useEffect, useState } from "react";
import ProducerService from "../../../../services/producerService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";
import { BackButton } from "../../../BackButton";
import Loader from "../../../Loader";

export default function ProducerRanking({ wallet, setTab }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const producerService = new ProducerService(wallet);
    const [producers, setProducers] = useState([]);
    const {tabActive, walletAddress} = useParams();
    const [inputFilter, setInputFilter] = useState('');
    const [filterSelect, setFilterSelect] = useState('reais');
        
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getProducers();
    }, []);
    
    function getProducers(){
        setLoading(true)
        producerService
        .getProducerRanking()
        .then((res) =>{
            orderRanking(res);
            setLoading(false);
        })
        .catch((err) => setLoading(false));
    }

    function orderRanking(data){
        if(data.length > 0){
            let producerSort = data.map((item) => item ).sort( (a,b) => parseInt(b.isa.isaScore) - parseInt(a.isa.isaScore))
            setProducers(producerSort)
        }
    }

    function filter(type, producersArray){
        if(type === 'all'){
            getProducers('all');
        }

        if(type === 'wallet'){
            let users = producers;
            const usersFilter = users.filter(item => item.producerWallet === inputFilter);
            setProducers(usersFilter);
        }

        if(type === 'reais'){
            let users = producersArray;
            const usersFilter = users.filter(item => item.producerWallet === '0xaC3Dd98E8025BD37Ca653f314B5CBE8492738919' ||
                item.producerWallet === '0x72482AE19928D654EB6D55f741157AE4701E3abe' ||
                item.producerWallet === '0x566C073Ec7B0d9e9Dd1CAf58e74CB954d8cB5DEf'
            );
            setProducers(usersFilter);
        }
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

    return (
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-2 lg:mb-5'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Producers')}</h1>
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                        onChange={(e) => {
                            setFilterSelect(e.target.value)
                            if(e.target.value === 'all'){
                                setInputFilter('');
                                filter('all')
                            }
                            if(e.target.value === 'reais'){
                                setInputFilter('');
                                filter('reais', producers)
                            }
                        }}
                        value={filterSelect}
                    >
                        <option value="reais">Produtores reais</option>
                        <option value="all">Todos os produtores</option>
                        <option value="wallet">Buscar pela wallet</option>
                    </select>
                </div>
                <div className="flex bg-white h-full w-[70%] px-3 rounded-r-md">
                    <input
                        className="bg-white border-0 h-full w-full"
                        placeholder="Digite aqui"
                        value={inputFilter}
                        onChange={(e) => setInputFilter(e.target.value)}
                    />
                    <button
                        className="font-bold py-2 rounded-md bg-white"
                        onClick={() => filter(filterSelect)}
                    >
                        <img
                            src={require('../../../../assets/icon-search.png')}
                            className="w-[20px] lg:w-[30px] object-contain"
                        />
                    </button>
                </div>
            </div>

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-2 lg:mt-14 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
                {producers.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum produtor cadastrado no sistema!</p>
                ) : (
                    <>
                    {producers.map((item, index) => (
                        <RankingItem
                            key={item.id}
                            data={item}
                            position={index + 1}
                            filterSelect={filterSelect}
                        />
                    ))}
                    </>
                )}
            </div>
        </div>
    )
}
