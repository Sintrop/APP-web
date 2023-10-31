import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useParams } from 'react-router';
import {GetProducers} from '../../services/producerService';
import {GetActivists} from '../../services/activistService';
import {GetResearchers} from '../../services/researchersService';
import {GetActivistsInfura, GetProducersInfura, GetResearchersInfura} from '../../services/methodsGetInfuraApi';
import Loading from '../Loading';
import { Warning } from '../Warning';
import { useNavigate } from 'react-router';
import { useMainContext } from '../../hooks/useMainContext';
import { BackButton } from '../BackButton';
import Loader from '../Loader';
import { CardImpact } from '../CardImpact';

export function NetworkImpact({setTab}){
    const {impactPerToken, viewMode} = useMainContext();
    const navigate = useNavigate();
    const [impact, setImpact] = useState({});
    const [impactPhoenix, setImpactPhoenix] = useState({});
    const [impactManual, setImpactManual] = useState({});
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const [producersCount, setProducersCount] = useState(0);
    const [activistsCount, setActivistsCount] = useState(0);
    const [researchersCount, setResearchersCount] = useState(0);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);

    useEffect(() => {
        getImpact();
    }, []);

    async function getImpact(){
        setLoading(true);
        const response = await api.get('/network-impact')
        const impacts = response.data?.impact;
        
        if(viewMode){
            const producers = await GetProducersInfura();
            setProducersCount(producers.length);
    
            const activists = await GetActivistsInfura();
            setActivistsCount(activists.length);
    
            const researchers = await GetResearchersInfura();
            setResearchersCount(researchers.length);
        }else{
            const producers = await GetProducers();
            setProducersCount(producers.length);
    
            const activists = await GetActivists();
            setActivistsCount(activists.length);
    
            const researchers = await GetResearchers();
            setResearchersCount(researchers.length);
        }

        for(var i = 0; i < impacts.length; i++){
            if(impacts[i].id === '1'){
                setImpact(impacts[i]);
            }
            if(impacts[i].id === '2'){
                setImpactPhoenix(impacts[i]);
            }
            if(impacts[i].id === '3'){
                setImpactManual(impacts[i]);
            }
        }
        setLoading(false);
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
        <div className='flex flex-col bg-green-950 px-2 lg:pl-10 pt-1 lg:pt-10 overflow-auto h-screen pb-24 lg:pb-0'>
            <div className='flex items-center gap-2'>
                <BackButton/>
                <h1 
                    className='font-bold text-lg lg:text-2xl text-white'
                >{t('Network Impact')}</h1>
            </div>

            <div className='overflow-auto mt-2 lg:mt-5 pb-20 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
            <Warning
                message='Data from our test network'
                width={250}
            />

            <section className='flex flex-col px-2 mt-5 lg:w-[1000px] lg:px-0'>
                <h3 className='font-bold text-center text-white text-2xl lg:text-start'>{t('Token Crédito de Regeneração')}</h3>
                <div className='flex items-center gap-5 flex-wrap mt-3'>
                    <div className='flex flex-col justify-center p-3 border-2 border-white rounded-lg w-full lg:w-[300px] h-[320px]'>
                        <img
                            src={require('../../assets/token.png')}
                            alt='Imagem do token de regeneração'
                            className='w-[80px] object-contain'
                        />

                        <p className='text-white mt-6'>{t('FORNECIMENTO TOTAL MÁXIMO')}</p>
                        <p className='text-white font-bold'>1,499,437,064 RCT</p>

                        <p className='text-white mt-6'>{t('TITULARES')}</p>
                        <p className='text-white font-bold'>18</p>

                        <p className='text-white mt-6'>{t('TOTAL DE TRANFERÊNCIAS')}</p>
                        <p className='text-white font-bold'>56</p>
                    </div>

                    <div className='flex flex-col p-3 justify-center border-2 border-white bg-green-900 rounded-lg w-full lg:w-[300px] h-[320px]'>
                        <p className='text-white font-bold'>{t('MERCADO')}</p>

                        <p className='text-white mt-6'>{t('VALOR DE MERCADO')}</p>
                        <p className='text-white font-bold'>R$0,0282</p>

                        <p className='text-white mt-6'>{t('CAPITALIZAÇÃO DE MERCADO DE OFERTA CIRCULANTE')}</p>
                        <p className='text-white font-bold'>R$0,00</p>
                    </div>

                    <div className='flex flex-col justify-center p-3 border-2 border-white rounded-lg w-full lg:w-[300px] h-[320px]'>
                        <p className='text-white font-bold'>{t('OUTRAS INFORMAÇÕES')}</p>

                        <p className='text-white mt-6'>{t('TOKEN CONTRACT (WITH 18 DECIMALS)')}</p>

                        <a 
                            className='text-blue-500 border-b-2 border-blue-500 font-bold mt-6 max-w-[30ch] overflow-hidden text-ellipsis'
                            href='https://sepolia.etherscan.io/token/0xf8033bbfe9c645f52d170ddd733274371e75369f'
                            target='_blank'
                        >0xF8033Bbfe9c645F52d170DDD733274371E75369F</a>
                    </div>
                </div>
            </section>

            <section className='flex flex-col px-2 mt-5 lg:px-0 lg:flex-row lg:w-[1000px] gap-5'>
                <CardImpact
                    title='ECOSYSTEM IMPACT OF THE NETWORK'
                    impact={impact}
                />

                <CardImpact
                    title='ECOSYSTEM IMPACT PER TOKEN'
                    impact={impactPerToken}
                    type='impactToken'
                />
            </section>
   
        </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}