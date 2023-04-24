import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {MainContext} from '../../../contexts/main';
import { useTranslation } from 'react-i18next';

import {GetProducer} from '../../../services/producerService';
import {GetInspections} from '../../../services/manageInspectionsService';
import {GetActivist} from '../../../services/activistService';
import { GetResearcher } from '../../../services/researchersService';
import {GetDeveloper} from '../../../services/developersService';
import { GetAdvisor } from '../../../services/advisorsService';
import {GetContributor} from '../../../services/contributorService';
import { GetInvestor } from '../../../services/investorService';

import { IndiceValueItem } from '../../IndiceValueItem';
import Loading from '../../Loading';
import { api } from '../../../services/api';
import Map from '../../Map';

import {InspectionItemResult} from '../../../pages/accountProducer/inspectionItemResult'

export default function MyAccount({wallet, userType, setTab}){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user, walletConnected, chooseModalRegister, checkUser} = useContext(MainContext);
    const {tabActive, walletAddress} = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingApi, setLoadingApi] = useState(true)
    const [userData, setUserData] = useState([]);
    const [producerDataApi, setProducerDataApi] = useState({});
    const [producerAddress, setProducerAddress] = useState({});
    const [propertyPath, setPropertyPath] = useState([]);
    const [position, setPosition] = useState({});
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive]);

    useEffect(() => {
        async function check() {
            const response = await checkUser(walletAddress);
            setTimeout(() => {
                if(response === '0'){
                    chooseModalRegister()
                }
            }, 1000)
        }
        check();

        getUserData();
    },[]);

    async function getApiProducer(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(wallet).toUpperCase()}`);
            setProducerDataApi(response.data.user)
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
        const filterInspections = response.filter(item => String(item.createdBy).toUpperCase() === walletAddress.toUpperCase())
        setInspections(filterInspections);
    }

    async function getUserData(){
        setLoading(true);
        if(user === '1'){
            getApiProducer();
            const response = await GetProducer(walletAddress);
            //getBase64(response)
            setPosition(JSON.parse(response.propertyAddress?.coordinate))
            setUserData(response);
            getInspections();
        }
        if(user === '2'){
            const response = await GetActivist(walletAddress);
            setUserData(response)
        }
        if(user === '3'){
            const response = await GetResearcher(walletAddress);
            setUserData(response)
        }
        if(user === '4'){
            const response = await GetDeveloper(walletAddress);
            setUserData(response)
        }
        if(user === '5'){
            const response = await GetAdvisor(walletAddress);
            setUserData(response)
        }
        if(user === '6'){
            const response = await GetContributor(walletAddress);
            setUserData(response)
        }
        if(user === '7'){
            const response = await GetInvestor(walletAddress);
            setUserData(response)
        }
        setLoading(false)
    }

    if(user === '0'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <h1 className='font-bold text-white'>Account is not registered</h1>
            </div>
        )
    }

    if(user === '1'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col items-center gap-5 lg:flex-row'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[200px] h-[200px] rounded-[100%] object-cover border-4 border-[#3e9ef5]"
                    />
    
                    <div className="flex flex-col gap-3">
                        <button
                            className='w-52 h-10 rounded-md bg-[#ff9900] font-bold '
                        >
                            {t('Request New Inspection')}
                        </button>
    
                        <a  
                            target='_blank'
                            href={`${window.location.host}/account-producer/${walletAddress}`}
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
                            <p className="text-white lg:text-lg">{userData?.producerWallet}</p>
    
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
                                    
                <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px] mt-5 lg:mt-10">
                    <div className="flex items-center w-full bg-[#80421A]">
                        <div className="w-[60%] px-3 py-2">
                            <p className='font-bold text-white'>Insumos</p>
                        </div>
                        <div className="w-[40%] px-3 py-2">
                            <p className='font-bold text-white'>Valor</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <IndiceValueItem/>
                        <IndiceValueItem/>
                        <IndiceValueItem/>
                        <IndiceValueItem/>
                        <IndiceValueItem/>
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

    if(user === '2'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col items-center gap-5 lg:flex-row'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[200px] h-[200px] rounded-[100%] object-cover border-4 border-[#3e9ef5]"
                    />
    
                    <div className="flex flex-col">
                        <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                        <p className="text-white lg:text-lg">{userData?.activistWallet}</p>
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
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
            <div className='flex flex-col items-center gap-5 lg:flex-row'>
                <img
                    src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                    className="w-[200px] h-[200px] rounded-[100%] object-cover border-4 border-[#3e9ef5]"
                />

                <div className="flex flex-col">
                    <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                    <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                    <p className="text-white lg:text-lg">
                        {user === '3' && userData?.researcherWallet}
                        {user === '4' && userData?.developerWallet}
                        {user === '5' && userData?.advisorWallet}
                        {user === '6' && userData?.contributorWallet}
                        {user === '7' && userData?.investorWallet}
                    </p>
                    <p className="font-bold text-[#ff9900] lg:text-lg">
                        {user === '3' && t('Published Works')}
                        {user === '4' && t('Developer Level')}
                        : <span className="text-white">
                            {user === '3' && userData?.publishedWorks}
                            {user === '4' && userData?.level?.level}
                        </span>
                    </p>
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}