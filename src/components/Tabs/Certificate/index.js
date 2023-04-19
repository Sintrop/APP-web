import React, {useEffect, useState} from "react";
import './certificate.css';
import '../isa.css';
import {useParams} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { api } from "../../../services/api";
import { useTranslation } from "react-i18next";

//services
import {GetProducer} from '../../../services/producerService';
import {GetDelation} from '../../../services/userService';

//components
import Loading from '../../Loading';

export default function ProducerCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [delationsReceived, setDelationsReceived] = useState('0');
    const [producerAddress, setProducerAddress] = useState({});

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        if(userType == 1){
            getProducer();
        }
    }, []);

    async function getProducer(){
        setLoading(true);
        const response = await GetProducer(wallet);
        setProducerData(response);
        getProducerDataApi(response.producerWallet);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReceived(delations.length);
        setLoading(false);
    }

    function downloadCertificate(){
        setLoading(true);
        const fileNameLong = `Certificate_${wallet}`;
        var certificateLong = document.querySelector("#certificate");
        htmlToImage.toJpeg(certificateLong)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameLong)
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false);
        })
    }

    if(userType != 1){
        return(
            <div>
                <h1>This account is not a producer.</h1>
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
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:items-center lg:justify-between mb-5 lg:mb-10 lg:flex-row'>
                <h1 className="font-bold text-2xl text-white">{t('Certificate')}</h1>
                <div className='flex items-center justify-center mt-3 gap-2 lg:mt-0'>
                    <button
                        className='px-4 py-2 bg-[#ff9900] rounded-md font-bold '
                        onClick={() => downloadCertificate()}
                    >
                        {t('Download')} {t('Certificate')}
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-producer/${wallet}`}>
                        <button
                            className='px-4 py-2 bg-[#ff9900] rounded-md font-bold '
                            onClick={() => alert('URL copied to clipboard')}
                        >
                            {t('Copy')} URL
                        </button>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="flex flex-col h-[90vh] overflow-auto pb-40">
                <div className="flex flex-col lg:w-[715px] " id='certificate'>
                    <div className="hidden lg:flex flex-col w-full lg:flex-row lg:w-[700px] h-[350px] border-2 bg-[#0A4303] border-white rounded-md mr-2">

                    </div>

                    <div className="flex flex-col lg:flex-row w-full lg:w-[700px] lg:ml-2 lg:mt-[-340px] bg-white lg:relative p-2 rounded-md" >
                        <div className="flex flex-col w-full h-full border-4 py-5 px-5 border-[#783E19] rounded-md">
                            <div className="flex flex-col lg:flex-row w-full h-full">
                                <div className="flex flex-col lg:w-[70%]">
                                    <img
                                        src={require('../../../assets/logo-cinza.png')}
                                        className="w-[150px] h-[80px] object-contain"
                                    />

                                    <p className="font-bold text-black">{producerData?.name}</p>
                                    <p className="font-bold text-black">{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                                    <p className="font-bold text-black">{producerAddress?.complement}</p>

                                    <div className="flex w-full mt-7">
                                        <div className="flex flex-col w-[50%]">
                                            <p className="text-black text-sm">{t('Inspections Reiceved')}: {producerData?.totalInspections}</p>
                                            <p className="text-black text-sm">ISA {t('Score')}: {producerData?.isa?.isaScore}</p>
                                            <p className="text-black text-sm">ISA {t('Average')}: {producerData?.isa?.isaAverage}</p>
                                        </div>

                                        <div className="flex flex-col w-[50%]">
                                            <p className="text-black text-sm">Saldo de Carbono: 10 Co²</p>
                                            <p className="text-black text-sm">Saldo de Água: 25 m³</p>
                                            <p className="text-black text-sm">Saldo de Biodiversidade: 25</p>
                                            <p className="text-black text-sm">Saldo de Solo: 50 m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center lg:w-[30%]">
                                    <p className="text-black font-bold text-center mb-5">Produtor Regenerativo</p>
                                    <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={180}/>
                                </div>
                            </div>

                            <p className="text-sm text-center mt-3">Wallet do produtor: {wallet}</p>
                        </div>
                    </div> 
                    
                </div>

            {/* <div className="area-certificates">
                <div className="certificate__container">
                    <div className="container__area-info-producer">
                        <div className="area-info-producer__card-info">
                            <h1 className="card-info__title">{t('Name')}</h1>
                            <p className="card-info__description">{producerData === [] ? '' : producerData.name}</p>
                        </div>
                        <div className="area-info-producer__card-info">
                            <h1 className="card-info__title">{t('Address')}</h1>
                            <p className="card-info__description">{producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.city}/${producerData.propertyAddress.state}, ${producerData.propertyAddress.country}`}</p>
                            <p className="card-info__description">{t('Zip Code')}: {producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.cep}`}</p>
                        </div>
                    </div>

                    <p className="card-info__title">{t('Certificate')}</p>
                    <div className="container__certificate-container">
                        <div className="qrcode-area">
                            <div className="qrcode">
                                <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={180}/>
                            </div>
                            <p className="hash-qrcode">{producerData === [] ? '' : producerData.producerWallet}</p>                            </div>

                        <div className="certificate-container__producer-score-info">
                            <img src={Logo} className='img-logo-certificate'/>

                            <p className="producer-score-info__description">
                                {t('Sustainability Score')}: {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                            </p>
                            <p className="producer-score-info__description">
                                {t('Total Inspections')}: {producerData === [] ? '' : producerData.totalInspections}
                            </p>
                            <p className="producer-score-info__description color-red">{t('Received Complaints')}: {delationsReceived}</p>
                        </div>
                    </div>
                </div>

                <div className="container__certificate-container-short">
                    <img src={Logo} className='img-logo-certificate'/>
                    <QRCode value={`${window.location.host}/account-producer/${wallet}`} size={190}/>
                    <p className="hash-qrcode">{producerData === [] ? '' : producerData.producerWallet}</p>
                </div>
            </div> */}
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}