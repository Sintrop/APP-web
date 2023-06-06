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
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

import Map from '../Map';
import Loading from '../Loading';
import { IndiceValueItem } from '../IndiceValueItem';
import { InspectionItemResult } from '../../pages/accountProducer/inspectionItemResult';
import { ResearchItem } from './Researches/ResearchItem';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: 8,
};

export function UserDetails({setTab}){
    const {t} = useTranslation();
    const {typeUser, tabActive, walletSelected} = useParams();
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
            setUserData(response);
            getInspections();
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
            console.log(response.data.user);
            const address = JSON.parse(response?.data?.user?.address)
            setProducerAddress(address);
            setPropertyPath(JSON.parse(response?.data?.user?.propertyGeolocation));
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }

    async function getInspections(){
        const response = await GetInspections();

        if(typeUser === '1'){
            const filterInspections = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
            const filterStatus = filterInspections.filter(item => item.status === '2');
            setInspections(filterStatus);
        }else{
            const filterInspections = response.filter(item => String(item.acceptedBy).toUpperCase() === walletSelected.toUpperCase())
            const filterStatus = filterInspections.filter(item => item.status === '2');
            setInspections(filterStatus);
        }
    }

    async function getResearches(){
        const response = await GetResearches();
        const filterResearches = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
        setResearches(filterResearches);
    }

    if(typeUser === '1'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                    <h1 className='font-bold text-2xl text-white'>{t('User Details')}</h1>
                </div>
                <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[250px] h-[250px] object-cover"
                    />
    
                    <div className="flex flex-col py-2">
                        <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white mt-2">{t('Wallet')}: <span className="text-white font-normal lg:text-lg max-w-[90%] lg:max-w-full text-ellipsis overflow-hidden">{userData?.producerWallet}</span></p>
                        
                        <p className="font-bold text-white mt-1">{t('Address')}: <span className="text-white font-normal lg:text-lg">{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</span></p>
                        <p className="font-bold text-white mt-1">{t('Certified Area')}: <span className="text-white font-normal">{userData?.certifiedArea}m²</span></p>
                        <p className="font-bold text-white mt-1">{t('Inspections Reiceved')}: <span className="text-white font-normal">{userData?.totalInspections}</span></p>
                        <p className="font-bold text-white mt-1">ISA {t('Score')}: <span className="text-white font-normal">{userData?.isa?.isaScore}</span></p>
                        
                    </div>
                </div>
    
                
                <div className="flex flex-col items-center lg:w-[1000px]">
                    {userData && (
                        <div className='flex w-full lg:w-[1000px] justify-center mt-5 px-2 lg:px-0 lg:mt-10'>
                            <div className='flex w-full justify-center'>
                            <LoadScript
                                googleMapsApiKey='AIzaSyD9854_llv58ijiMNKxdLbe6crnQuCpGuo'
                                libraries={['drawing']}
                            >
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={position}
                                    zoom={18}
                                    mapTypeId='satellite'
                                >
                                    <Marker position={position}/>
                                    <Polyline
                                        path={propertyPath}
                                    />
                                </GoogleMap>
                            </LoadScript>
                            </div>
                        </div>
                    )}
                </div>
                
    
                <div className="flex flex-col lg:mt-10 mt-5 lg:w-[1000px]">
                    <p className='text-[#ff9900] text-center text-xl font-bold mb-5'>Inspeções recebidas</p>

                    {inspections.length === 0 ? (
                        <p className="text-white font-bold text-lg">Nenhuma inspeção recebida</p>
                    ) : (
                        <>
                            {inspections.map(item => (
                                <InspectionItemResult
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </>
                    )}
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
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                    <h1 className='font-bold text-2xl text-white'>{t('User Details')}</h1>
                </div>
                <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[250px] h-[250px] object-cover"
                    />
    
                    <div className="flex flex-col items-center lg:items-start">
                        <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                        <p className="text-white lg:text-lg max-w-[80%] overflow-clip lg:max-w-full">{userData?.activistWallet}</p>
                        <p className="font-bold text-[#ff9900] lg:text-lg">{t('Inspections Realized')}: <span className="text-white">{userData?.totalInspections}</span></p>
                    </div>
                </div>
    
                <div className="flex flex-col lg:mt-10 mt-5 lg:w-[1000px]">
                    <p className='text-[#ff9900] text-center text-xl font-bold mb-5'>Inspeções realizadas</p>

                    {inspections.length === 0 ? (
                        <p className="text-white font-bold text-lg">Nenhuma inspeção realizada</p>
                    ) : (
                        <>
                            {inspections.map(item => (
                                <InspectionItemResult
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </>
                    )}
                </div>
    
                {loading && (
                    <Loading/>
                )}
            </div>
        )
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-20'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                <h1 className='font-bold text-2xl text-white'>{t('User Details')}</h1>
            </div>
            <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                <img
                    src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                    className="w-[250px] h-[250px] object-cover"
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
                            {typeUser === '4' && userData?.pool?.level}
                        </span>
                    </p>
                </div>
            </div>

            {typeUser === '3' && (
                <>
                    <p className='font-bold text-center text-[#ff9900] mt-5 mb-2 text-lg lg:w-[1000px]'>Pesquisas publicadas</p>
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