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
import { GetInvestor } from "../../../../services/accountProducerService";
import {BurnTokens, GetCertificateTokens} from '../../../../services/sacTokenService';

//components
import Loading from '../../../Loading';
import { ModalContribute } from "./ModalContribute";

export default function InvestorCertificate({userType, wallet, setTab}){
    const {t} = useTranslation();
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
        const response = await GetInvestor(walletAddress);
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
        <div className='flex flex-col w-full h-[100vh] bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 lg:mb-10'>
                <h1 className="font-bold text-2xl text-white">{t('Investor Certificate')}</h1>
                <div className='flex justify-center items-center gap-2 mt-3 lg:mt-0'>
                    <button
                        className='px-4 py-2 bg-[#ff9900] rounded-md font-bold '
                        onClick={() => downloadCertificate()}
                    >
                        {t('Download')} {t('Certificate')}
                    </button>

                    <CopyToClipboard text={`${window.location.host}/account-investor/${wallet}`}>
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
                                        <div className="flex flex-col lg:w-[50%]">
                                            <p className="text-green-800 font-bold text-xl">{tokensBurned} Créditos de Regeneração</p>
                                        </div>

                                        <div className="flex flex-col lg:w-[50%]">
                                            <p className="text-black text-sm">Saldo de Carbono: 0 Co²</p>
                                            <p className="text-black text-sm">Saldo de Água: 0 m³</p>
                                            <p className="text-black text-sm">Saldo de Biodiversidade: 0</p>
                                            <p className="text-black text-sm">Saldo de Solo: 0 m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center lg:w-[30%]">
                                    <p className="text-black font-bold text-center mb-5">{t('Investor')}</p>
                                    <QRCode value={`${window.location.host}/account-investor/${wallet}`} size={180}/>
                                </div>
                            </div>

                            <p className="text-sm text-center mt-3">Wallet do investidor: {wallet}</p>
                        </div>
                    </div> 
                    
                </div>

                <div className="flex flex-col mt-5">
                    <h3 className="font-bold text-white lg:text-3xl text-center lg:w-[700px] border-b-2 pb-5">A terra agradece sua contribuição, juntos tornaremos a agricultura regenerativa</h3>

                    <div className="mt-5 flex items-center gap-2 lg:w-[710px]">
                        <Dialog.Root
                            open={modalContribute}
                            onOpenChange={(open) => setModalContribute(open)}
                        >
                            <ModalContribute 
                                wallet={walletAddress}
                                onFinished={() => getInvestor()}
                            />
                            <Dialog.Trigger
                                className='px-4 py-3 bg-[#ff9900] rounded-md font-bold w-[50%]'
                            >
                                {t('Contribute')}
                            </Dialog.Trigger>
                        </Dialog.Root>
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
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}