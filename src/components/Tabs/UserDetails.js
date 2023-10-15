import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useMainContext } from '../../hooks/useMainContext';
import { useTranslation } from 'react-i18next';

import { api } from '../../services/api';
import {GetProducer} from '../../services/producerService';
import {GetInspections, GetIsa} from '../../services/manageInspectionsService';
import {GetActivist} from '../../services/activistService';
import { GetResearcher, GetResearches } from '../../services/researchersService';
import {GetDeveloper} from '../../services/developersService';
import { GetAdvisor } from '../../services/advisorsService';
import {GetValidator} from '../../services/contributorService';
import { GetSupporter } from '../../services/investorService';
import { GetDelation } from '../../services/userService';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';
import {
    GetResearchesInfura, 
    GetInspectionsInfura, 
    GetProducerInfura, 
    GetInspectorInfura,
    GetDelationInfura,
    GetDeveloperInfura,
    GetResearcherInfura,
    GetSupporterInfura,
    GetValidatorInfura
} from '../../services/methodsGetInfuraApi';

import Map from '../Map';
import Loading from '../Loading';
import { IsProducerSyntropic } from '../IsProducerSyntropic';
import { InspectionItemResult } from '../../pages/accountProducer/inspectionItemResult';
import { ResearchItem } from './Researches/ResearchItem';
import * as Dialog from '@radix-ui/react-dialog';
import {ModalChooseTypeDelation} from '../ModalChooseTypeDelation';
import { BackButton } from '../BackButton';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import {ImLab} from 'react-icons/im';
import {QRCode} from "react-qrcode-logo";
import Loader from '../Loader';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: 8,
};

export function UserDetails({setTab}){
    const {t} = useTranslation();
    const {viewMode} = useMainContext();
    const {typeUser, tabActive, walletSelected} = useParams();
    const [loading, setLoading] = useState(true);
    const [loadingApi, setLoadingApi] = useState(true)
    const [userData, setUserData] = useState([]);
    const [producerDataApi, setProducerDataApi] = useState({});
    const [userDataApi, setUserDataApi] = useState({});
    const [producerAddress, setProducerAddress] = useState({});
    const [propertyPath, setPropertyPath] = useState([]);
    const [position, setPosition] = useState({});
    const [inspections, setInspections] = useState([]);
    const [researches, setResearches] = useState([]);
    const [modalTypeDelation, setModalTypeDelation] = useState(false);
    const [delations, setDelations] = useState([]);
    const [soilTotal, setSoilTotal] = useState(0);
    const [carbonTotal, setCarbonTotal] = useState(0);
    const [bioTotal, setBioTotal] = useState(0);
    const [waterTotal, setWaterTotal] = useState(0);
    const [arvoresTotal, setarvoresTotal] = useState(0);

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
            let response = {};

            if(viewMode){
                const responseProducer = await GetProducerInfura(walletSelected);
                response = responseProducer
            }else{
                const responseProducer = await GetProducer(walletSelected);
                response = responseProducer
            }

            setPosition(JSON.parse(response.propertyAddress?.coordinate))
            setUserData(response);
            getInspections();
            fixCoordinates(JSON.parse(response.propertyAddress?.coordinate))
        }
        if(typeUser === '2'){
            if(viewMode){
                const response = await GetInspectorInfura(walletSelected);
                setUserData(response);
                console.log(response)
            }else{
                const response = await GetActivist(walletSelected);
                setUserData(response);
            }
            getInspections();
        }
        if(typeUser === '3'){
            if(viewMode){
                const response = await GetResearcherInfura(walletSelected);
                setUserData(response);
            }else{
                const response = await GetResearcher(walletSelected);
                setUserData(response);
            }
            getResearches();
        }
        if(typeUser === '4'){
            if(viewMode){
                const response = await GetDeveloperInfura(walletSelected);
                setUserData(response);
            }else{
                const response = await GetDeveloper(walletSelected);
                setUserData(response)
            }
        }
        if(typeUser === '5'){
            const response = await GetAdvisor(walletSelected);
            setUserData(response)
        }
        if(typeUser === '6'){
            if(viewMode){
                const response = await GetValidatorInfura(walletSelected);
                setUserData(response);
            }else{
                const response = await GetValidator(walletSelected);
                setUserData(response);
            }
        }
        if(typeUser === '7'){
            if(viewMode){
                const response = await GetSupporterInfura(walletSelected);
                setUserData(response);
            }else{
                const response = await GetSupporter(walletSelected);
                setUserData(response);
            }
            getApiInvestor()
        }

        if(viewMode){
            const resDelations = await GetDelationInfura(walletSelected);
            setDelations(resDelations);
        }else{
            const resDelations = await GetDelation(walletSelected);
            setDelations(resDelations);
        }
        setLoading(false)
    }

    async function getApiInvestor(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            setUserDataApi(response.data.user)
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }

    async function getApiProducer(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            setProducerDataApi(response.data.user); 
            const address = JSON.parse(response?.data?.user?.address)
            setProducerAddress(address);
            setPropertyPath(JSON.parse(response?.data?.user?.propertyGeolocation));
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }

    async function fixCoordinates(coords){
        const arrayLat = String(coords.lat).split('');
            const arrayLng = String(coords.lng).split('');
            let newLat = '';
            let newLng = '';

            for(var i = 0; i < arrayLat.length; i++){
                if(i === 3){
                    if(arrayLat[i] === '.'){
                        newLat += arrayLat[i]
                    }else{
                        if(arrayLat[i] === ','){
                            newLat += '.'
                        }else{
                            newLat += `.${arrayLat[i]}`
                        }
                    }
                }else{
                    newLat += arrayLat[i]
                }

            }

            for(var i = 0; i < arrayLng.length; i++){
                if(i === 3){
                    if(arrayLng[i] === '.'){
                        newLng += arrayLng[i]
                    }else{
                        if(arrayLng[i] === ','){
                            newLng += '.'
                        }else{
                            newLng += `.${arrayLng[i]}`
                        }
                    }
                }else{
                    newLng += arrayLng[i]
                }
            }
            setPosition({
                lat: Number(newLat),
                lng: Number(newLng)
            })
    }

    async function getInspections(){
        let response = [];

        if(viewMode){
            const responseInspections = await GetInspectionsInfura();
            response = responseInspections;
        }else{
            const responseInspections = await GetInspections();
            response = responseInspections;
        }

        if(typeUser === '1'){
            let totalCarbon = 0;
            let totalWater = 0;
            let totalBio = 0;
            let totalSoil = 0;
            const filterInspections = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
            const filterStatus = filterInspections.filter(item => item.status === '2');
            setInspections(filterStatus);
            calculateArvores(filterStatus);
            for(var i = 0; i < filterStatus.length; i++){
                let isaCarbon = {};
                let isaBio = {};
                let isaSoil = {};
                let isaWater = {};
    
                const inspectionId = filterStatus[i].id;
                const response = await GetIsa(inspectionId);
                for(var i = 0; i < response.length; i++){
                    if(response[i].categoryId === '1'){
                        isaCarbon = response[i]
                    }
                    if(response[i].categoryId === '2'){
                        isaBio = response[i]
                    }
                    if(response[i].categoryId === '3'){
                        isaWater = response[i]
                    }
                    if(response[i].categoryId === '4'){
                        isaSoil = response[i]
                    }
                }
    
                totalCarbon += Number(isaCarbon?.indicator);
                totalWater += Number(isaWater?.indicator);
                totalBio += Number(isaBio?.indicator);
                totalSoil += Number(isaSoil?.indicator);
            }
    
            setWaterTotal(totalWater);
            setCarbonTotal(totalCarbon);
            setBioTotal(totalBio);
            setSoilTotal(totalSoil);
        }else{
            const filterInspections = response.filter(item => String(item.acceptedBy).toUpperCase() === walletSelected.toUpperCase())
            const filterStatus = filterInspections.filter(item => item.status === '2');
            setInspections(filterStatus);
        }

    }

    async function calculateArvores(inspections){
        if(inspections.length < 1){
            return;
        }
        let totalArvores = 0;
        for(var i = 0; i < inspections.length; i++){
            let arvoresInspections = 0;

            const response = await api.get(`/inspection/${inspections[i].id}`);
            const resCategories = JSON.parse(response.data?.inspection?.resultCategories);
            const arvoresMudas = resCategories.filter(item => item.categoryId === '9');
            const arvoresJovens = resCategories.filter(item => item.categoryId === '10');
            const arvoresAdultas = resCategories.filter(item => item.categoryId === '11');
            const arvoresAncias = resCategories.filter(item => item.categoryId === '12');

            arvoresInspections = Number(arvoresMudas[0].value) + Number(arvoresJovens[0].value) + Number(arvoresAdultas[0].value) + Number(arvoresAncias[0].value);
            totalArvores += arvoresInspections
        }

        setarvoresTotal(totalArvores / inspections.length)
    }

    async function getResearches(){
        if(viewMode){
            const response = await GetResearchesInfura();
            const filterResearches = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
            setResearches(filterResearches);
        }else{
            const response = await GetResearches();
            const filterResearches = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
            setResearches(filterResearches);
        }
    }

    function downloadCertificateSocial(){
        setLoading(true);
        const fileNameSocial = `Certificate_Social${walletSelected}`;
        var certificateSocial = document.querySelector("#certificate-social");
        htmlToImage.toPng(certificateSocial)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameSocial)
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false);
        })
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

    if(typeUser === '1'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto pb-40 '>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2 lg:mb-5'> 
                    <div className='flex items-center gap-2'>
                        <BackButton/>
                        <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('User Details')}</h1>
                    </div>

                    <div className='flex flex-col lg:flex-row items-center gap-2 lg:gap-5 mt-2'>
                        <button
                            className='flex py-1 lg:py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0 w-full lg:w-auto justify-center'
                            onClick={downloadCertificateSocial}
                        >
                            {t('Download')} {t('Certificate')}
                        </button>

                        <button
                            className='flex py-1 lg:py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0 w-full lg:w-auto justify-center'
                            onClick={() => setModalTypeDelation(true)}
                        >
                            {t('Report User')}
                        </button>
                    </div>
                </div>

                <div className='flex flex-col w-full h-[78vh] overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
                
                <IsProducerSyntropic data={userData}/>
                <div className='flex flex-col gap-2 lg:gap-5 lg:flex-row w-full lg:w-[1000px] bg-[#0a4303] mt-5'>
                    <img
                        src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                        className="w-[250px] h-[250px] object-cover"
                    />
    
                    <div className="flex flex-col w-full p-2">
                        <h2 className="font-bold text-[#ff9900] text-lg lg:text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white mt-2">{t('Wallet')}: <span className="text-white font-normal lg:text-lg max-w-[90%] lg:max-w-full text-ellipsis overflow-hidden">{userData?.producerWallet}</span></p>
                        
                        <p className="font-bold text-white mt-1">{t('Address')}: <span className="text-white font-normal lg:text-lg">{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</span></p>
                        <p className="font-bold text-white mt-1">{t('Certified Area')}: <span className="text-white font-normal">{userData?.certifiedArea}m²</span></p>
                        <p className="font-bold text-white mt-1">{t('Inspections Reiceved')}: <span className="text-white font-normal">{userData?.totalInspections}</span></p>
                        <p className="font-bold text-white mt-1">ISA {t('Score')}: <span className="text-white font-normal">{userData?.isa?.isaScore}</span></p>
                        <p className="font-bold text-red-400 mt-1">{t('Complaints Received')}: <span className="text-white font-normal">{delations.length}</span></p>
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
                
                <div className="flex flex-col lg:w-[1000px] items-center mt-8">
                    <p className="font-bold text-white">{t('Certified for social networks')}</p>
                    <div className="">
                    <div className="bg-certificate-instagram lg:w-[700px] flex flex-col rounded-md bg-center" id='certificate-social'>
                        <div className="flex flex-col w-full h-full p-5 bg-[rgba(6,32,16,0.5)]">
                            <div className="w-full flex flex-col lg:flex-row justify-between">
                                <img
                                    src={require('../../assets/logo-branco.png')}
                                    className="w-[110px] h-[60px] mt-[-10px] object-contain"
                                />

                                <div className="flex flex-col gap-2">
                                    <IsProducerSyntropic data={userData}/>
                                    <div className="flex items-center gap-3 px-4 py-1 rounded-md bg-orange-400">
                                        <ImLab size={18} color='white'/>
                                        <p className="font-bold text-white">Testnet</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center border-4 border-white mt-5">
                                <img
                                    src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                                    className="w-[110px] h-[110px] object-cover rounded-full border-4 border-white mt-[-60px]"
                                />
                           
                                <p className="font-bold text-[#ff9900] text-lg">{userData?.name}</p>
                                <p className="font-bold text-white text-lg">
                                    Latitude: {position.lat}, Longitude: {position.lng}
                                </p>
                                <p className="font-bold text-white">
                                    {t('Area')}: <span className="font-bold text-[#ff9900]">{userData?.certifiedArea} m²</span>
                                </p>

                                <div className="flex flex-col items-center justify-center w-full mt-5 gap-5">
                                    <QRCode 
                                        value={`https://${window.location.host}/account-producer/${walletSelected}`} 
                                        size={180}
                                        logoImage={require('../../assets/icone.png')}
                                        qrStyle="dots"
                                        logoPadding={2}
                                        logoPaddingStyle="square"
                                        logoWidth={50}
                                        removeQrCodeBehindLogo
                                        eyeColor='#0a4303'
                                    /> 

                                    <div className="flex items-center gap-1">
                                        <p className="font-bold text-[#ff9900]">Total de Árvores:</p>       
                                        <p className="font-bold text-white">{arvoresTotal}</p>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-3 w-full mt-2">
                                    <div className="flex flex-col items-center gap-1 w-[45%]">
                                        <p className="font-bold text-white">
                                            {t('Inspections Reiceved')}: <span className="font-bold text-[#ff9900]">{userData?.totalInspections}</span>
                                        </p>
                                        <p className="font-bold text-white">
                                            {t('Regeneration Score')}: <span className="font-bold text-[#ff9900]">{userData?.isa?.isaScore}</span>
                                        </p>
                                        <p className="font-bold text-white">
                                            {t('Average')}: <span className="font-bold text-[#ff9900]">{Number(userData?.isa?.isaScore)/Number(userData?.totalInspections)}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1 w-[45%]">
                                        <p className="font-bold text-white">
                                            {t('Carbon Balance')}: <span className="font-bold text-[#ff9900]">{(carbonTotal / 1000).toFixed(1)} t</span>
                                        </p>
                                        <p className="font-bold text-white">
                                            {t('Water Balance')}: <span className="font-bold text-[#ff9900]">{waterTotal.toFixed(0)} m³</span>
                                        </p>
                                        <p className="font-bold text-white">
                                            {t('Soil Balance')}: <span className="font-bold text-[#ff9900]">{soilTotal.toFixed(0)} m²</span>
                                        </p>
                                        <p className="font-bold text-white">
                                            {t('Biodiversity Balance')}: <span className="font-bold text-[#ff9900]">{bioTotal.toFixed(0)} uni</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full mt-3">
                                    <p className="text-white text-center">Wallet {t('Producer')}: {userData?.producerWallet}</p>
                                </div>
                            </div>
                            <p className="text-white text-center mb-[-5px]">sintrop.com</p> 
                        </div>
                    </div>
                    </div>
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

                <Dialog.Root
                    open={modalTypeDelation}
                    onOpenChange={(open) => {
                        setModalTypeDelation(open)
                    }}
                >
                    <ModalChooseTypeDelation/>
                </Dialog.Root>
                </div>
            </div>
        )
    }

    if(typeUser === '2'){
        return(
            <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2 lg:mb-10'> 
                    <div className='flex items-center gap-2'>
                        <BackButton/>
                        <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('User Details')}</h1>
                    </div>

                    <button
                        className='flex mt-2 py-1 lg:py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0 justify-center'
                        onClick={() => setModalTypeDelation(true)}
                    >
                        {t('Report User')}
                    </button>
                </div>

                <div className="flex flex-col overflow-auto h-[95vh] pb-40 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
                    <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                        <img
                            src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                            className="w-[250px] h-[250px] object-cover"
                        />
        
                        <div className="flex flex-col items-center lg:items-start">
                            <h2 className="font-bold text-[#ff9900] text-lg lg:text-2xl">{userData?.name}</h2>
                            <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                            <p className="text-white lg:text-lg max-w-[90%] overflow-clip lg:max-w-full text-ellipsis">{userData?.activistWallet}</p>
                            <p className="font-bold text-[#ff9900] lg:text-lg">{t('Inspections Realized')}: <span className="text-white">{userData?.totalInspections}</span></p>
                            <p className="font-bold text-red-400 mt-1">{t('Complaints Received')}: <span className="text-white font-normal">{delations.length}</span></p>
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
                </div>

                <Dialog.Root
                    open={modalTypeDelation}
                    onOpenChange={(open) => {
                        setModalTypeDelation(open)
                    }}
                >
                    <ModalChooseTypeDelation/>
                </Dialog.Root>
    
                {loading && (
                    <Loading/>
                )}
            </div>
        )
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto h-[95vh] pb-20'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('User Details')}</h1>
                </div> 

                <button
                    className='flex mt-2 py-1 lg:py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0 justify-center'
                    onClick={() => setModalTypeDelation(true)}
                >
                    {t('Report User')}
                </button>
            </div>

            <div className="flex flex-col overflow-auto h-[95vh] pb-40 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
                <div className='flex flex-col gap-5 lg:flex-row lg:w-[1000px] bg-[#0a4303]'>
                    {typeUser === '7' ? (
                        <img
                            src={`https://ipfs.io/ipfs/${userDataApi?.imgProfileUrl}`}
                            className="w-[250px] h-[250px] object-cover"
                        />
                    ) : (
                        <img
                            src={`https://ipfs.io/ipfs/${userData?.proofPhoto}`}
                            className="w-[250px] h-[250px] object-cover"
                        />
                    )}

                    <div className="flex flex-col items-center lg:items-start">
                        <h2 className="font-bold text-[#ff9900] text-lg lg:text-2xl">{userData?.name}</h2>
                        <p className="font-bold text-white lg:text-lg mt-3">{t('Wallet')}:</p>
                        <p className="text-white lg:text-lg max-w-[90%] lg:max-w-full overflow-hidden text-ellipsis">
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
                        <p className="font-bold text-red-400 mt-1">{t('Complaints Received')}: <span className="text-white font-normal">{delations.length}</span></p>
                    </div>
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

            <Dialog.Root
                open={modalTypeDelation}
                onOpenChange={(open) => {
                    setModalTypeDelation(open)
                }}
            >
                <ModalChooseTypeDelation/>
            </Dialog.Root>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}