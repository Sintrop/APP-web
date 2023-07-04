import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {QRCode} from "react-qrcode-logo";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { api } from "../../../../services/api";
import axios from 'axios';
import { useTranslation } from "react-i18next";

//services
import { GetInvestor } from "../../../../services/accountProducerService";
import {BurnTokens, GetCertificateTokens} from '../../../../services/sacTokenService';

//components
import Loading from '../../../Loading';
import { ModalContribute } from "./ModalContribute";
import { BackButton } from "../../../BackButton";

export default function InvestorCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
    const {tabActive, walletAddress} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [tokensBurned, setTokensBurned] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalContribute, setModalContribute] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [impactInvestor, setImpactInvestor] = useState({});

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getInvestor();
        getImpact()
    }, []);

    async function getImpact(){
        let carbon = 0;
        let water = 0;
        let bio = 0;
        let soil = 0;

        const response = await api.get(`/tokens-burned/by-wallet/${walletAddress}`);
        const arrayTokens = response.data.tokensBurned;
        for(var i = 0; i < arrayTokens.length; i++){
            const tokens = arrayTokens[i].tokens;
            carbon += tokens * arrayTokens[i].carbon;
            water += tokens * arrayTokens[i].water;
            bio += tokens * arrayTokens[i].bio;
            soil += tokens * arrayTokens[i].soil;
        }

        setImpactInvestor({carbon, water, bio, soil})
    }

    async function getInvestor(){
        setLoading(true);
        const response = await GetInvestor(walletAddress);
        setInvestorData(response);
        const tokens = await GetCertificateTokens(walletAddress);
        setTokensBurned((Number(tokens) / 10**18));
        setLoading(false);
    }

    function downloadCertificate(){
        setLoading(true);
        const fileNameShort = `Certificate_${walletAddress}`;
        var certificateShort = document.querySelector("#certificate-investor");
        htmlToImage.toJpeg(certificateShort)
        .then((dataUrlShort) => {
            saveAs(dataUrlShort, fileNameShort);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false)
        })    
    }

    return(
        <div className='flex flex-col w-full h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-10'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Investor Certificate')}</h1>
                </div>
                <div className='flex justify-center items-center gap-2 mt-2 lg:mt-0'>
                    <button
                        className='px-4 py-1 lg:py-2 bg-[#ff9900] rounded-md font-bold '
                        onClick={() => downloadCertificate()}
                    >
                        {t('Download')} {t('Certificate')}
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-investor/${wallet}`}>
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

                <div className="flex flex-col lg:w-[715px]" id='certificate-investor'>
                    <div className="hidden lg:flex flex-col lg:flex-row lg:w-[700px] h-[330px] border-2 bg-[#0A4303] border-white rounded-md">

                    </div>

                    <div className="flex flex-col lg:flex-row lg:w-[700px] lg:ml-2 lg:mt-[-320px] bg-white lg:relative p-2 rounded-md">
                        <div className="flex flex-col w-full h-full border-4 py-5 px-5 border-[#783E19] rounded-md">
                            <div className="flex flex-col lg:flex-row w-full h-full">
                                <div className="flex flex-col lg:w-[70%]">
                                    <img
                                        src={require('../../../../assets/logo-cinza.png')}
                                        className="w-[150px] h-[80px] object-contain"
                                    />


                                    {investorData?.userType === '0' ? (
                                        <>
                                            <p className="font-bold text-black">Investidor Anônimo</p>
                                            <p className="font-bold text-black">Você contribuiu com um total de:</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-black">{investorData?.name}</p>
                                            <p className="font-bold text-black">Contribuiu com um total de:</p>
                                        </>
                                    )}


                                    <div className="flex w-full mt-7">
                                        <div className="flex flex-col items-center lg:w-[40%]">
                                            <p className="text-green-800 font-bold text-3xl">{Number(tokensBurned).toFixed(2).replace('.',',')}</p>
                                            <p className="text-green-800 font-bold text-sm">Créditos de Regeneração</p>
                                        </div>

                                        <div className="flex flex-col lg:w-[60%] lg:ml-3">
                                            <p className="text-black text-sm">Saldo de Carbono: {Number(impactInvestor?.carbon).toFixed(2)} kg</p>
                                            <p className="text-black text-sm">Saldo de Água: {Number(impactInvestor?.water).toFixed(2)} m³</p>
                                            <p className="text-black text-sm">Saldo de Biodiversidade: {Number(impactInvestor?.bio).toFixed(2)} uni</p>
                                            <p className="text-black text-sm">Saldo de Solo: {Number(impactInvestor?.soil).toFixed(2)} m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center lg:w-[30%]">
                                    <p className="text-black font-bold text-center mb-5">{t('Investor')}</p>
                                    <QRCode 
                                        value={`https://${window.location.host}/account-investor/${wallet}`} 
                                        size={180}
                                        logoImage={require('../../../../assets/icone.png')}
                                        qrStyle="dots"
                                        logoPadding={2}
                                        logoWidth={50}
                                        removeQrCodeBehindLogo
                                        eyeColor='#0a4303'
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-center mt-3">Wallet do investidor: {wallet}</p>
                        </div>
                    </div> 
                    
                </div>

                <div className="flex flex-col mt-5">
                    <h3 className="font-bold text-white lg:text-3xl text-center lg:w-[700px] border-b-2 pb-5">A terra agradece sua contribuição, juntos tornaremos a agricultura regenerativa</h3>

                    <div className="mt-5 flex flex-col lg:flex-row items-center gap-2 lg:w-[710px]">
                        <Dialog.Root
                            open={modalContribute}
                            onOpenChange={(open) => setModalContribute(open)}
                        >
                            <ModalContribute 
                                wallet={walletAddress}
                                onFinished={() => {
                                    getInvestor()
                                    getImpact()
                                }}
                            />
                            <Dialog.Trigger
                                className='py-3 bg-[#ff9900] rounded-md font-bold w-full lg:w-[50%]'
                            >
                                {t('Contribute')}
                            </Dialog.Trigger>
                        </Dialog.Root>
                        <button
                            className='py-3 bg-[#ff9900] rounded-md font-bold w-full lg:w-[50%]'
                            onClick={() => {}}
                        >
                            {t('Calculadora de Pegada Agrícola')}
                        </button>
                    </div>

                    <a
                        href='#'
                        className="text-white mt-5 text-xl"
                    >
                        Leia nossa documentação para entender mais
                    </a>
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}