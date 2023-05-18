import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {MainContext} from '../../../contexts/main';
import { useTranslation } from 'react-i18next';
import {FaCheck, FaLock} from 'react-icons/fa';

import {GetProducer} from '../../../services/producerService';
import {GetInspections, RequestInspection} from '../../../services/manageInspectionsService';
import {GetActivist} from '../../../services/activistService';
import { GetResearcher, GetResearches } from '../../../services/researchersService';
import {GetDeveloper} from '../../../services/developersService';
import { GetAdvisor } from '../../../services/advisorsService';
import {GetContributor} from '../../../services/contributorService';
import { GetInvestor } from '../../../services/investorService';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

import { IndiceValueItem } from '../../IndiceValueItem';
import Loading from '../../Loading';
import { api } from '../../../services/api';
import Map from '../../Map';
import * as Dialog from '@radix-ui/react-dialog';

import { LoadingTransaction } from '../../LoadingTransaction';  
import {InspectionItemResult} from '../../../pages/accountProducer/inspectionItemResult';
import { ResearchItem } from '../Researches/ResearchItem';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: 8,
};

export default function MyAccount({wallet, userType, setTab}){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user, walletConnected, blockNumber,chooseModalRegister, checkUser} = useContext(MainContext);
    const {tabActive, walletAddress} = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingApi, setLoadingApi] = useState(true)
    const [userData, setUserData] = useState([]);
    const [producerDataApi, setProducerDataApi] = useState({});
    const [producerAddress, setProducerAddress] = useState({});
    const [propertyPath, setPropertyPath] = useState([]);
    const [position, setPosition] = useState({});
    const [inspections, setInspections] = useState([]);
    const [researches, setResearches] = useState([]);
    const [lastResquested, setLastRequested] = useState('');
    const [btnRequestHover, setBtnRequestHover] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

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

    useEffect(() => {
        if(user === '1'){
            isProducer()
        }
    }, []);

    async function isProducer() {
        const producer = await GetProducer(walletAddress);
        setLastRequested(producer.lastRequestAt);
    }

    async function getApiProducer(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(wallet).toUpperCase()}`);
            setProducerDataApi(response.data.user)
            setPropertyPath(JSON.parse(response?.data?.user?.propertyGeolocation));
            const address = JSON.parse(response?.data?.user?.address)
            setProducerAddress(address);
            console.log(address);
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

    async function getResearches(){
        const response = await GetResearches();
        const filterResearches = response.filter(item => String(item.createdBy).toUpperCase() === walletAddress.toUpperCase())
        setResearches(filterResearches);
    }

    async function getUserData(){
        setLoading(true);
        if(user === '1'){
            getApiProducer();
            const response = await GetProducer(walletAddress);
            //getBase64(response)
            setPosition(JSON.parse(response.propertyAddress?.coordinate))
            setUserData(response);
            console.log(response)
            getInspections();
        }
        if(user === '2'){
            const response = await GetActivist(walletAddress);
            setUserData(response)
        }
        if(user === '3'){
            getResearches();
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

    async function requestInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        RequestInspection(walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
            getInspections();
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Request OPEN or ACCEPTED")){
                setLogTransaction({
                    type: 'error',
                    message: 'Request OPEN or ACCEPTED',
                    hash: ''
                })
                return;
            }
            if(message.includes("Recent inspection")){
                setLogTransaction({
                    type: 'error',
                    message: 'Recent inspection!',
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
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                <h1 className='font-bold text-2xl text-white'>{t('My Account')}</h1>
                <div className='flex justify-center items-center gap-5'>
                    {user == 1 && (
                        <button
                            
                            className='flex mt-5 py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0'
                            onClick={() => {
                                if(Number(userData?.totalInspections) < 3){
                                    requestInspection();
                                }
                                if(Number(lastResquested) === 0){
                                    requestInspection()
                                }
                                if(Number(lastResquested) !== 0){
                                    if((Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0){
                                        requestInspection()
                                    }
                                }
                            }}
                            onMouseEnter={() => setBtnRequestHover(true)}
                            onMouseOut={() => setBtnRequestHover(false)}
                        >
                            {Number(lastResquested) === 0 ? (
                                `${t('Request New Inspection')}`
                            ) : (
                                <>
                                {(Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0 ? (
                                    `${t('Request New Inspection')}`
                                ) : (
                                    <>
                                    {btnRequestHover ? (
                                        <>
                                            <FaLock 
                                                size={25}
                                                onMouseEnter={() => setBtnRequestHover(true)}
                                                onMouseOut={() => setBtnRequestHover(false)}
                                            />
                                            {t('Wait')} {(Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber)} {t('blocks to request')}
                                        </>
                                    ) : `${t('Request New Inspection')}`}
                                    </>
                                )}
                                </>
                            )}
                        </button>
                    )}
                    <a  
                        target='_blank'
                        href={`${window.location.host}/account-producer/${walletAddress}`}
                        className='w-52 h-10 rounded-md bg-[#ff9900] font-bold flex items-center justify-center'
                    >
                        Página do Produtor
                    </a>
                </div>
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
                        
                        <div className="flex w-full gap-2 mt-1">
                            <p className="font-bold text-[#ff9900]">Prox. Request: </p>
                            <div className='flex items-center'>
                            {Number(userData?.lastRequestAt) === 0 ? (
                                <div className='flex items-center text-green-500'
                                >
                                    <FaCheck size={15} style={{marginRight: 5}}/>
                                    {t('You Can Request Inspections')}
                                </div>
                                
                            ) : (
                                <>
                                {(Number(userData?.lastRequestAt) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0 ? (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'green', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaCheck size={15} style={{marginRight: 5}}/>
                                        {t('You Can Request Inspections')}
                                    </div>
                                ) : (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'red', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaLock size={15} style={{marginRight: 5}}/>
                                        {t('Wait')} {(Number(userData?.lastRequestAt) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber)} {t("blocks to request")}
                                    </div>
                                )}
                                </>
                            )}
                            
                        </div>
                        </div>
                    </div>
                </div>
    
                
                <div className="flex flex-col items-center lg:w-[1000px]">
                    {userData && (
                        <div className='flex w-full lg:w-[1000px] justify-center mt-5 px-2 lg:px-0 lg:mt-10'>
                            <div className='flex w-full justify-center'>
                            <LoadScript
                                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
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

                <Dialog.Root 
                    open={modalTransaction} 
                    onOpenChange={(open) => {
                        if(!loadingTransaction){
                            setModalTransaction(open);
                        }
                    }}
                >
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>
            </div>
        )
    }

    if(user === '2'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-10 overflow-auto h-[95vh] pb-40'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                    <h1 className='font-bold text-2xl text-white'>{t('My Account')}</h1>
                </div>
                <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[250px] h-[250px] object-cover"
                    />
    
                    <div className="flex flex-col items-center lg:items-start">
                        <h2 className="font-bold text-[#ff9900] text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                        <p className="text-white lg:text-lg max-w-[80%] lg:max-w-full text-ellipsis overflow-hidden">{userData?.activistWallet}</p>
                        <p className="font-bold text-[#ff9900] lg:text-lg">{t('Inspections Realized')}: <span className="text-white">{userData?.totalInspections}</span></p>
                        <div className='flex items-center'>
                            {Number(userData?.lastAcceptedAt) === 0 ? (
                                <div className='flex text-green-500'
                                >
                                    <FaCheck size={15} style={{marginRight: 5}}/>
                                    {t('You Can Accept Inspections')}
                                </div>
                            ) : (
                                <>
                                {(Number(userData?.lastAcceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)) - Number(blockNumber) < 0 ? (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'green', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaCheck size={15} style={{marginRight: 5}}/>
                                        {t('You Can Accept Inspections')}
                                    </div>
                                ) : (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'red', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaLock size={15} style={{marginRight: 5}}/>
                                        {t('Wait')} {(Number(userData?.lastAcceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)) - Number(blockNumber)} {t('blocks to accept')}.
                                    </div>
                                )}
                                </>
                            )}
                            
                        </div>                    
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
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                <h1 className='font-bold text-2xl text-white'>{t('My Account')}</h1>
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

            {user === '3' && (
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