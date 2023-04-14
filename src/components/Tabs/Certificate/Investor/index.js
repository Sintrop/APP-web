import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import Logo from '../../../../assets/img/262543420-sintrop-logo-com-degrade.png';
import axios from 'axios';
import { useTranslation } from "react-i18next";

//services
import InvestorService from '../../../../services/investorService';
import {BurnTokens, GetCertificateTokens} from '../../../../services/sacTokenService';

//components
import Loading from '../../../Loading';
import { ModalContribute } from "./ModalContribute";
import { ItemReceipt } from "./ItemReceipt";

export default function InvestorCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
    const investorService = new InvestorService(wallet);
    const {tabActive, walletAddress} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [tokensBurned, setTokensBurned] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalContribute, setModalContribute] = useState(false);
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getInvestor();
        getReceipts();
    }, []);

    async function getReceipts(){
        //add try catch in future
        const receipts = await axios.get(`https://api-goerli.etherscan.io/api?module=account&action=tokentx&contractaddress=0x3b25db3d9853ef80f60079ab38e5739cd1543b34&address=0x49b85e2d9f48252bf32ba35221b361da77aac683&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
        if(receipts.data.status === '1'){
            setReceipts(receipts.data.result);
        }
    }

    async function getInvestor(){
        setLoading(true);
        const response = await investorService.getInvestor(walletAddress);
        setInvestorData(response);
        console.log(response)
        const tokens = await GetCertificateTokens(walletAddress);
        setTokensBurned(Number(tokens) / 10**18);
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
        <div className='flex flex-col w-full h-[100vh] bg-green-950 px-10 pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-10'>
                <h1 className="font-bold text-2xl text-white">{t('Investor Certificate')}</h1>
                <div className='flex items-center gap-2'>
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

            <div className="flex flex-col lg:w-[715px]" id='certificate-investor'>
                    <div className="flex lg:w-[700px] lg:h-[330px] border-2 bg-[#0A4303] border-white rounded-md">

                    </div>

                    <div className="flex w-[700px] ml-2 mt-[-320px] bg-white relative p-2 rounded-md">
                        <div className="flex flex-col w-full h-full border-4 py-5 px-5 border-[#783E19] rounded-md">
                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-[70%]">
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
                                        <div className="flex flex-col w-[50%]">
                                            <p className="text-green-800 font-bold text-xl">{tokensBurned} SAC Tokens</p>
                                        </div>

                                        <div className="flex flex-col w-[50%]">
                                            <p className="text-black text-sm">Saldo de Carbono: 10 Co²</p>
                                            <p className="text-black text-sm">Saldo de Água: 25 m³</p>
                                            <p className="text-black text-sm">Saldo de Biodiversidade: 25</p>
                                            <p className="text-black text-sm">Saldo de Solo: 50 m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center w-[30%]">
                                    <p className="text-black font-bold text-center mb-5">{t('Investor')}</p>
                                    <QRCode value={`${window.location.host}/account-investor/${wallet}`} size={180}/>
                                </div>
                            </div>

                            <p className="text-sm text-center mt-3">Wallet do investidor: {wallet}</p>
                        </div>
                    </div> 
                    
                </div>

                <div className="flex flex-col items-center w-full mt-10">
                    <h3 className="font-bold text-white text-3xl text-center lg:w-[700px] border-b-2 pb-5">A terra agradece sua contribuição, juntos tornaremos a agricultura regenerativa</h3>
                
                    <div className="flex flex-col lg:w-[800px] p-4 mt-10 bg-[#0A4303] rounded-md border-2 border-[#3E9EF5]">
                        <div className="flex w-full py-1 items-center justify-center bg-[#783E19] rounded-md">
                            <p className="font-bold text-white text-xl">Meu impacto</p>

                        </div>
                        <div className="flex w-full justify-center flex-wrap gap-2 mt-5">
                            <div className="flex w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Carbono</p>
                                    <img
                                        src={require('../../../../assets/icon-co2.png')}
                                        className="w-[70px] h-[60px] object-cover"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">25</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">ton</p>
                                </div>
                            </div>

                            <div className="flex w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Solo</p>
                                    <img
                                        src={require('../../../../assets/icon-solo.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">50</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">m²</p>
                                </div>
                            </div>

                            <div className="flex w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Biodiversidade</p>
                                    <img
                                        src={require('../../../../assets/icon-bio.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">35</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">uni</p>
                                </div>
                            </div>

                            <div className="flex w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Água</p>
                                    <img
                                        src={require('../../../../assets/icon-agua.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">62</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">m³</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center gap-2 lg:w-[750px]">
                        <button
                            className='px-4 py-3 bg-[#ff9900] rounded-md font-bold w-[50%]'
                            onClick={() => {}}
                        >
                            {t('Contribute More')}
                        </button>
                        <button
                            className='px-4 py-3 bg-[#ff9900] rounded-md font-bold w-[50%]'
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

                <div className="flex justify-center flex-wrap gap-10 mt-10">
                    {receipts.length !== 0 && (
                        <>
                        {receipts.map((item, index) => (
                            <ItemReceipt
                                data={item}
                                index={index + 1}
                            />
                        ))}
                        </>
                    )}
                </div>
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}