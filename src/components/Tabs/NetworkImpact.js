import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useParams } from 'react-router';
import {GetProducers} from '../../services/producerService';
import {GetActivists} from '../../services/activistService';
import {GetResearchers} from '../../services/researchersService';
import Loading from '../Loading';
import {GetBalanceContract} from '../../services/producerPoolService';
import {GetBalancePool} from '../../services/developersPoolService';
import { Warning } from '../Warning';

export function NetworkImpact({setTab}){
    const [impact, setImpact] = useState({});
    const [impactPerToken, setImpactPerToken] = useState({});
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const [producersCount, setProducersCount] = useState(0);
    const [activistsCount, setActivistsCount] = useState(0);
    const [researchersCount, setResearchersCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getImpact();
    }, []);

    async function getImpact(){
        setLoading(true);
        const response = await api.get('network-impact')
        setImpact(response.data?.impact[0]);
        
        const producers = await GetProducers();
        setProducersCount(producers.length);

        const activists = await GetActivists();
        setActivistsCount(activists.length);

        const researchers = await GetResearchers();
        setResearchersCount(researchers.length);
        
        const balanceProducers = await GetBalanceContract();
        const balanceDevelopers = await GetBalancePool();
        calculateImpactPerToken(balanceProducers, balanceDevelopers, response.data?.impact[0]);
        setLoading(false);
    }
    
    async function calculateImpactPerToken(balanceProducers, balanceDevelopers, impact){
        const totalBalanceProducers = 750000000000000000000000000;
        const totalBalanceDevelopers = 15000000000000000000000000;

        const sacProducers = totalBalanceProducers - balanceProducers;
        const sacDevelopers = totalBalanceDevelopers - balanceDevelopers;

        const totalSac = sacProducers + sacDevelopers;

        const carbon = (totalSac / Number(impact.carbon)) / 10 ** 18;
        const bio = (totalSac / Number(impact.bio)) / 10 ** 18;
        const water = (totalSac / Number(impact.agua)) / 10 ** 18;
        const soil = (totalSac / Number(impact.solo)) / 10 ** 18;

        let impactToken = {
            carbon,
            bio,
            water,
            soil
        }
        setImpactPerToken(impactToken);
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto h-screen'>
            <h1 className='font-bold text-2xl text-white'>{t('Network Impact')}</h1>

            <Warning
                message='Data from our test network'
                width={250}
            />

            <section className="flex flex-col items-center py-5 rounded-lg bg-[#0A4303] lg:w-[1000px] mt-5 px-2 mx-2 lg:mx-0">
                    <p className="text-white mb-5 font-bold">{t('IMPACTO DA NOSSA REDE')}</p>

                    <div className="flex items-center gap-2 flex-wrap justify-center">

                        <div className="flex flex-col lg:w-[300px] lg:h-[250px] justify-between lg:p-2 lg:border-r-2 border-green-950">
                            <div className="flex items-center gap-2 py-5">
                                <img
                                    src={require('../../assets/token.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <div className='flex flex-col'>
                                    <p className='text-white'>{t("VALOR DO CRÉDITO DE REGENERAÇÃO")}</p>
                                    <p className='text-white'>R$ 0,025</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-5 border-b-2 lg:border-0">
                                <img
                                    src={require('../../assets/globo-branco.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <div className='flex flex-col'>
                                    <p className='text-white'>CIRCULATING MARKET CAP</p>
                                    <p className='text-white'>R$ 0,00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-[90%] lg:w-[300px] lg:h-[250px] lg:p-2 lg:border-r-2 gap-2 border-green-950">
                            
                                <div className="flex items-center gap-2">
                                    <div className='flex flex-col font-bold'>
                                        <p className='text-[#ff9900]'>CO²</p>
                                        <img
                                            src={require('../../assets/co2.png')}
                                            alt='Token da sintrop'
                                            className='w-[40px] h-[40px] object-contain mt-[-8px]'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5'>{(Number(impact?.carbon) / 1000).toFixed(0)} <span className='font-bold text-sm'>t</span></p>
                                </div>

                                <div className="flex items-center gap-2 mt-[-8px]">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Solo")}</p>
                                        <img
                                            src={require('../../assets/solo.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5 ml-1'>{impact?.solo} <span className='font-bold text-sm'>m²</span></p>
                                </div>
                            
                                <div className="flex items-center gap-2">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Biodiversidade")}</p>
                                        <img
                                            src={require('../../assets/bio.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg ml-[-75px] flex items-end gap-1 mt-5'>{impact?.bio} <span className='font-bold text-sm'>uni</span></p>
                                </div>

                                <div className="flex items-center gap-2 ">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Água")}</p>
                                        <img
                                            src={require('../../assets/agua.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5 ml-[-5px]'>{impact?.agua} <span className='font-bold text-sm'>m³</span></p>
                                </div>
                            
                        </div>

                        <div className="flex flex-col w-[300px] h-[250px] justify-between lg:p-2 px-5">
                            <div className="flex items-center gap-2">
                                <img
                                    src={require('../../assets/token.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <p className='text-white'>{t("IMPACTO POR TOKEN")}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/co2.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>{Number(impactPerToken?.carbon).toFixed(2)} <span className='font-bold text-base'>kg</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/solo.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>{Number(impactPerToken?.soil).toFixed(2)} <span className='font-bold text-base'>m²</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/agua.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>{Number(impactPerToken?.water).toFixed(2)} <span className='font-bold text-base'>m³</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/bio.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>{Number(impactPerToken?.bio).toFixed(2)} <span className='font-bold text-base'>uni</span></p>
                            </div>
                        </div>

                    </div>

                    <div className='flex flex-col lg:flex-row items-center w-full justify-between lg:px-20 mt-5'>
                        <p className='text-white font-bold'>{t("PRODUTORES")}: <span className='text-blue-500'>{producersCount}</span></p>
                        <p className='text-white font-bold'>{t("ATIVISTAS")}: <span className='text-blue-500'>{activistsCount}</span></p>
                        <p className='text-white font-bold'>{t("PESQUISADORES")}: <span className='text-blue-500'>{researchersCount}</span></p>
                    </div>
                </section>

                {loading && (
                    <Loading/>
                )}
        </div>
    )
}