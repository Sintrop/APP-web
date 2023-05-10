import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useMainContext } from '../../hooks/useMainContext';
import { useTranslation } from 'react-i18next';

import { api } from '../../services/api';
import {GetProducer} from '../../services/producerService';
import {GetInspections} from '../../services/manageInspectionsService';
import {GetActivist} from '../../services/activistService';
import { GetResearcher, GetResearches } from '../../services/researchersService';
import {GetDeveloper} from '../../services/developersService';
import { GetAdvisor } from '../../services/advisorsService';
import {GetContributor} from '../../services/contributorService';
import { GetInvestor } from '../../services/investorService';

import Map from '../Map';
import Loading from '../Loading';
import { IndiceValueItem } from '../IndiceValueItem';
import { InspectionItemResult } from '../../pages/accountProducer/inspectionItemResult';
import { ResearchItem } from './Researches/ResearchItem';

export function UserDetails({setTab}){
    const {t} = useTranslation();
    const {walletSelected} = useMainContext();
    const {typeUser, tabActive} = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingApi, setLoadingApi] = useState(true)
    const [userData, setUserData] = useState([]);
    const [producerDataApi, setProducerDataApi] = useState({});
    const [producerAddress, setProducerAddress] = useState({});
    const [propertyPath, setPropertyPath] = useState([]);
    const [position, setPosition] = useState({});
    const [inspections, setInspections] = useState([]);
    const [researches, setResearches] = useState([]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);

    useEffect(() => {
        getUserData();
    },[])

    async function getUserData(){
        setLoading(true);
        if(typeUser === '1'){
            getApiProducer();
            const response = await GetProducer(walletSelected);
            //getBase64(response)
            setPosition(JSON.parse(response.propertyAddress?.coordinate))
            setUserData(response);
            getInspections();
        }
        if(typeUser === '2'){
            const response = await GetActivist(walletSelected);
            setUserData(response)
        }
        if(typeUser === '3'){
            getResearches();
            const response = await GetResearcher(walletSelected);
            setUserData(response)
        }
        if(typeUser === '4'){
            const response = await GetDeveloper(walletSelected);
            setUserData(response)
        }
        if(typeUser === '5'){
            const response = await GetAdvisor(walletSelected);
            setUserData(response)
        }
        if(typeUser === '6'){
            const response = await GetContributor(walletSelected);
            setUserData(response)
        }
        if(typeUser === '7'){
            const response = await GetInvestor(walletSelected);
            setUserData(response)
        }
        setLoading(false)
    }

    async function getApiProducer(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            setProducerDataApi(response.data.user);
            console.log(response)
            setPropertyPath(JSON.parse(response?.data?.user?.propertyGeolocation));
            const address = JSON.parse(response?.data?.user?.address)
            setProducerAddress(address);
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getResearches(){
        const response = await GetResearches();
        const filterResearches = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
        setResearches(filterResearches);
    }

    if(typeUser === '1'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col items-center gap-5 lg:flex-row'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[200px] h-[200px] rounded-[100%] object-cover border-4 border-[#3e9ef5]"
                    />
    
                    <div className="flex flex-col gap-3">
                        <a  
                            target='_blank'
                            href={`https://www.sintropapp.com.br/account-producer/${walletSelected}`}
                            className='w-52 h-10 rounded-md bg-[#ff9900] font-bold flex items-center justify-center'
                        >
                            Página do Produtor
                        </a>
                    </div>
                </div>
    
                <div className="flex flex-col lg:items-center lg:flex-wrap gap-5 mt-5 lg:mt-16 lg:flex-row">
                    <div className="flex w-full flex-col lg:w-[450px]">
                        <div className="flex flex-col w-full h-[330px] lg:h-[370px] bg-[#0A4303] p-2 border-2 border-[#3E9EF5] rounded-sm">
                            <h2 className="font-bold text-center text-[#A75722] text-2xl">{userData?.name}</h2>
                            <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                            <p className="text-white lg:text-lg max-w-full overflow-hidden text-ellipsis">{userData?.producerWallet}</p>
    
                            <p className="font-bold text-white text-lg mt-2">{t('Address')}:</p>
                            <p className="text-white lg:text-lg">{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
    
                            <p className="font-bold text-[#ff9900] lg:text-lg mt-5">{t('Inspections Reiceved')}: <span className="text-white">{userData?.totalInspections}</span></p>
                            <p className="font-bold text-[#ff9900] lg:text-lg mt-1">ISA {t('Score')}: <span className="text-white">{userData?.isa?.isaScore}</span></p>
                        </div>
    
                        <div className="flex flex-col w-full lg:w-[70%] bg-green-950 p-2 border-2 border-[#3E9EF5] rounded-sm mt-[-65px] lg:mt-[-75px]">
                            <p className="font-bold text-[#ff9900] lg:text-lg">Prox. Request:</p>
                            <p className="text-white lg:text-lg">{t('Your May Request Inspections')}</p>
                        </div>
                    </div>
    
                    <div className="flex flex-col items-center">
                        {position && (
                            <>
                                {!loadingApi && (
                                    <div className='flex flex-col'>
                                        <div className='flex border-2 border-[#3e9ef5]'>
                                            <Map
                                                editable={false}
                                                //position={userData?.propertyAddress?.complement}
                                                position={position}
                                                pathPolyline={propertyPath}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                                    
                <div className="flex flex-col lg:mt-10 mt-5">
                    {inspections.map(item => (
                        <InspectionItemResult
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
    
                {loading && (
                    <Loading/>
                )}
            </div>
        )
    }

    if(typeUser === '2'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col items-center gap-5 lg:flex-row'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[200px] h-[200px] rounded-full object-cover border-4 border-[#3e9ef5]"
                    />
    
                    <div className="flex flex-col items-center lg:items-start">
                        <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                        <p className="text-white lg:text-lg max-w-[80%] overflow-clip lg:max-w-full">{userData?.activistWallet}</p>
                        <p className="font-bold text-[#ff9900] lg:text-lg">{t('Inspections Realized')}: <span className="text-white">{userData?.totalInspections}</span></p>
                    </div>
                </div>
    
                <div className="flex flex-col lg:mt-10 mt-5">
                    {inspections.map(item => (
                        <InspectionItemResult
                            key={item.id}
                            data={item}
                        />
                    ))}
                </div>
    
                {loading && (
                    <Loading/>
                )}
            </div>
        )
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-20'>
            <div className='flex flex-col items-center gap-5 lg:flex-row mb-5 lg:mb-10'>
                <img
                    src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                    className="w-[200px] h-[200px] rounded-[100%] object-cover border-4 border-[#3e9ef5]"
                />

                <div className="flex flex-col items-center lg:items-start">
                    <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                    <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                    <p className="text-white lg:text-lg max-w-[80%] lg:max-w-full overflow-hidden text-ellipsis">
                        {typeUser === '3' && userData?.researcherWallet}
                        {typeUser === '4' && userData?.developerWallet}
                        {typeUser === '5' && userData?.advisorWallet}
                        {typeUser === '6' && userData?.contributorWallet}
                        {typeUser === '7' && userData?.investorWallet}
                    </p>
                    <p className="font-bold text-[#ff9900] lg:text-lg">
                        {typeUser === '3' && t('Published Works')}
                        {typeUser === '4' && t('Developer Level')}
                        : <span className="text-white">
                            {typeUser === '3' && userData?.publishedWorks}
                            {typeUser === '4' && userData?.level?.level}
                        </span>
                    </p>
                </div>
            </div>

            {typeUser === '3' && (
                <>
                    {researches.length === 0 ? (
                        <p className='font-bold text-white'>Nenhuma pesquisa publicada</p>
                    ) : (
                        <>
                            {researches.map(item => (
                                <ResearchItem 
                                    key={item.id}
                                    data={item}
                                    myAccount
                                />
                            ))}
                        </>
                    )}
                </>
            )}

            {loading && (
                <Loading/>
            )}
        </div>
    )
}