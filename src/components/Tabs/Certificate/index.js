import React, {useEffect, useState} from "react";
import './certificate.css';
import '../isa.css';
import {useParams} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {QRCode} from "react-qrcode-logo";
import { api } from "../../../services/api";
import { useTranslation } from "react-i18next";
import {ImLab} from 'react-icons/im';
import * as Dialog from '@radix-ui/react-dialog';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

//services
import {GetProducer} from '../../../services/producerService';
import {GetDelation} from '../../../services/userService';
import {GetInspections, GetIsa} from '../../../services/manageInspectionsService';

//components
import Loading from '../../Loading';
import {IsProducerSyntropic} from '../../IsProducerSyntropic';
import { BackButton } from "../../BackButton";
import { ModalDownloadCertificate } from "../../ModalDownloadCertificate";

export default function ProducerCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
    const {tabActive, walletAddress, typeUser} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [delationsReceived, setDelationsReceived] = useState('0');
    const [producerAddress, setProducerAddress] = useState({});
    const [soilTotal, setSoilTotal] = useState(0);
    const [carbonTotal, setCarbonTotal] = useState(0);
    const [bioTotal, setBioTotal] = useState(0);
    const [waterTotal, setWaterTotal] = useState(0);
    const [modalDownload, setModalDownload] = useState(false);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        if(typeUser == 1){
            getProducer();
            getInspections(walletAddress);
        }
    }, []);

    async function getProducer(){
        setLoading(true);
        const response = await GetProducer(walletAddress);
        setProducerData(response);
        getProducerDataApi(response.producerWallet);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReceived(delations.length);
        setLoading(false);
    }

    async function getInspections(producerWallet){
        let totalCarbon = 0;
        let totalWater = 0;
        let totalBio = 0;
        let totalSoil = 0;

        const response = await GetInspections();
        const filterInspectionProducer = response.filter(item => String(item.createdBy).toUpperCase() === String(producerWallet).toUpperCase())
        const filterInspected = filterInspectionProducer.filter(item => item.status === '2');
        
        for(var i = 0; i < filterInspected.length; i++){
            let isaCarbon = {};
            let isaBio = {};
            let isaSoil = {};
            let isaWater = {};

            const inspectionId = filterInspected[i].id;
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
    }

    function downloadCertificateLong(){
        setLoading(true);
        const fileNameLong = `Certificate_${walletAddress}`;
        var certificateLong = document.querySelector("#certificate");
        htmlToImage.toJpeg(certificateLong)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameLong)
            setLoading(false)
            setModalDownload(false)
        })
        .catch((error) => {
            setLoading(false);
        })
    }

    function downloadCertificateShort(){
        setLoading(true);
        const fileNameShort = `Certificate_Short${walletAddress}`;
        var certificateShort = document.querySelector("#certificate-short");
        htmlToImage.toJpeg(certificateShort)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameShort)
            setLoading(false)
            setModalDownload(false)
        })
        .catch((error) => {
            setLoading(false);
        })
    }

    function downloadCertificateInstagram(){
        setLoading(true);
        const fileNameInstagram = `Certificate_Instagram${walletAddress}`;
        var certificateInstagram = document.querySelector("#certificate-instagram");
        htmlToImage.toJpeg(certificateInstagram)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameInstagram)
            setLoading(false)
            setModalDownload(false)
        })
        .catch((error) => {
            setLoading(false);
        })
    }

    if(userType != 1){
        return(
            <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
                <h1 className="font-bold text-white">This account is not a producer.</h1>
            </div>
        )
    }

    async function getProducerDataApi(wallet){
        try{
            const response = await api.get(`/user/${String(wallet).toUpperCase()}`);
            //setProducerDataApi(response.data);
            const address = JSON.parse(response.data.user.address);
            setProducerAddress(address);
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:items-center lg:justify-between mb-2 lg:mb-10 lg:flex-row'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Certificate')}</h1>
                </div>
                <div className='flex items-center justify-center mt-2 gap-2 lg:mt-0'>
                    <button
                        className='px-4 py-1 lg:py-2 bg-[#ff9900] rounded-md font-bold '
                        onClick={() => setModalDownload(true)}
                    >
                        {t('Download')} {t('Certificate')}
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-producer/${wallet}`}>
                        <button
                            className='px-4 py-1 lg:py-2 bg-[#ff9900] rounded-md font-bold '
                            onClick={() => alert('URL copied to clipboard')}
                        >
                            {t('Copy')} URL
                        </button>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                <p className="font-bold text-white text-lg">{t('Long Certificate')}</p>
                <div className="flex flex-col lg:w-[715px] " id='certificate'>
                    <div className="hidden lg:flex flex-col w-full lg:flex-row lg:w-[700px] h-[350px] border-2 bg-[#0A4303] border-white rounded-md mr-2">

                    </div>

                    <div className="flex flex-col lg:flex-row w-full lg:w-[700px] lg:ml-2 lg:mt-[-340px] bg-white lg:relative p-2 rounded-md" >
                        <div className="flex flex-col w-full h-full border-4 py-5 px-5 border-[#783E19] rounded-md">
                            <div className="flex flex-col lg:flex-row w-full h-full">
                                <div className="flex flex-col lg:w-[70%]">
                                    <div className="flex flex-col lg:flex-row items-center gap-5">
                                        <img
                                            src={require('../../../assets/logo-cinza.png')}
                                            className="w-[150px] h-[80px] object-contain"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <IsProducerSyntropic data={producerData}/>
                                            <div className="flex items-center gap-3 px-4 py-1 rounded-md bg-orange-400">
                                                <ImLab size={18} color='white'/>
                                                <p className="font-bold text-white">Testnet</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="font-bold text-black">{producerData?.name}</p>
                                    <p className="font-bold text-black">{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                                    <p className="font-bold text-black">{producerAddress?.complement}</p>

                                    <div className="flex w-full mt-7">
                                        <div className="flex flex-col w-[40%]">
                                            <p className="text-black text-sm">{t('Inspections Reiceved')}: {producerData?.totalInspections}</p>
                                            <p className="text-black text-sm">ISA {t('Score')}: {producerData?.isa?.isaScore}</p>
                                            <p className="text-black text-sm">ISA {t('Average')}: {Number(producerData?.isa?.isaScore)/Number(producerData?.totalInspections)}</p>
                                        </div>

                                        <div className="flex flex-col w-[60%]">
                                            <p className="text-black text-sm">Saldo de Carbono: {carbonTotal.toFixed(0)} Kg</p>
                                            <p className="text-black text-sm">Saldo de Água: {waterTotal.toFixed(0)} m³</p>
                                            <p className="text-black text-sm">Saldo de Biodiversidade: {bioTotal.toFixed(0)} uni</p>
                                            <p className="text-black text-sm">Saldo de Solo: {soilTotal.toFixed(0)} m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center lg:w-[30%]">
                                    <p className="text-black font-bold text-center mb-5">Produtor Regenerativo</p>
                                    <QRCode 
                                        value={`${window.location.host}/account-producer/${wallet}`} 
                                        size={180}
                                        logoImage={require('../../../assets/icone.png')}
                                        qrStyle="dots"
                                        logoPadding={2}
                                        logoPaddingStyle="square"
                                        logoWidth={50}
                                        removeQrCodeBehindLogo
                                        eyeColor='#0a4303'
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-center mt-3">Wallet do produtor: {wallet}</p>
                        </div>
                    </div> 
                    
                </div>

                <p className="font-bold text-white text-lg mt-5">{t('Short Certificate')}</p>

                <div className="flex flex-col lg:w-[360px] mr-2" id='certificate-short'>
                    <div className="hidden lg:flex flex-col w-full lg:flex-row lg:w-[350px] h-[470px] border-2 bg-[#0A4303] border-white rounded-md mr-2">

                    </div>

                    <div className="flex flex-col lg:flex-row w-full lg:w-[350px] lg:ml-2 lg:mt-[-460px] bg-white lg:relative p-2 rounded-md" >
                        <div className="flex flex-col w-full h-full items-center border-4 py-5 px-5 border-[#783E19] rounded-md">
                                <img
                                    src={require('../../../assets/logo-cinza.png')}
                                    className="w-[150px] h-[80px] object-contain"
                                />
                                <p className="text-black font-bold text-center">Produtor Regenerativo</p>
                                <QRCode 
                                    value={`${window.location.host}/account-producer/${wallet}`} 
                                    size={180}
                                    logoImage={require('../../../assets/icone.png')}
                                    qrStyle="dots"
                                    logoPadding={2}
                                    logoPaddingStyle="square"
                                    logoWidth={50}
                                    removeQrCodeBehindLogo
                                    eyeColor='#0a4303'
                                />

                                <p className="text-sm text-center my-3 ">{wallet}</p>
                                <IsProducerSyntropic data={producerData}/>
                                <div className="flex mt-2 items-center gap-3 px-4 py-1 rounded-md bg-orange-400">
                                    <ImLab size={18} color='white'/>
                                    <p className="font-bold text-white">Testnet</p>
                                </div>
                        </div>
                    </div> 
                    
                </div>

                <p className="font-bold text-white text-lg mt-5">{t('Certified for social networks')}</p>

                <div className="bg-white p-2 rounded-md lg:w-[615px]">
                <div className="bg-certificate-instagram lg:w-[600px] flex flex-col rounded-md bg-center" id='certificate-instagram'>
                    <div className="flex flex-col w-full h-full bg-[rgba(0,0,0,0.5)] p-3">
                        <div className="w-full flex flex-col lg:flex-row items-center justify-between">
                            <img
                                src={require('../../../assets/logo-branco.png')}
                                className="w-[110px] h-[60px] object-contain"
                            />

                            <div className="flex flex-col gap-2">
                                <IsProducerSyntropic data={producerData}/>
                                <div className="flex items-center gap-3 px-4 py-1 rounded-md bg-orange-400">
                                    <ImLab size={18} color='white'/>
                                    <p className="font-bold text-white">Testnet</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 mt-10">
                            <p className="font-bold text-white text-lg">{producerData?.name}</p>
                            <p className="font-bold text-white text-lg">{(producerData?.propertyAddress?.coordinate)}</p>
                        </div>

                        <div className="flex items-center justify-center w-full mt-5">
                            <QRCode 
                                    value={`${window.location.host}/account-producer/${wallet}`} 
                                    size={180}
                                    logoImage={require('../../../assets/icone.png')}
                                    qrStyle="dots"
                                    logoPadding={2}
                                    logoPaddingStyle="square"
                                    logoWidth={50}
                                    removeQrCodeBehindLogo
                                eyeColor='#0a4303'
                            />        
                        </div>

                        <div className="flex justify-center gap-3 w-full mt-5">
                            <div className="flex flex-col items-center gap-1 w-[45%]">
                                <p className="font-bold text-white">
                                    {t('Inspections Reiceved')}: <span className="font-bold text-[#ff9900]">{producerData?.totalInspections}</span>
                                </p>
                                <p className="font-bold text-white">
                                    ISA {t('Score')}: <span className="font-bold text-[#ff9900]">{producerData?.isa?.isaScore}</span>
                                </p>
                                <p className="font-bold text-white">
                                    ISA {t('Average')}: <span className="font-bold text-[#ff9900]">{Number(producerData?.isa?.isaScore)/Number(producerData?.totalInspections)}</span>
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 w-[45%]">
                                <p className="font-bold text-white">
                                    {t('Carbon Balance')}: <span className="font-bold text-[#ff9900]">{carbonTotal.toFixed(0)} Kg</span>
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
                            <p className="text-white text-center">Wallet {t('Producer')}: {producerData?.producerWallet}</p>
                            <p className="text-white text-right">sintrop.com</p> 
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <Dialog.Root
                open={modalDownload}
                onOpenChange={(open) => setModalDownload(open)}
            >
                <ModalDownloadCertificate 
                    close={() => setModalDownload(false)}
                    long={downloadCertificateLong}
                    short={downloadCertificateShort}
                    social={downloadCertificateInstagram}
                />
            </Dialog.Root>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}