import React from "react";
import { QRCode } from "react-qrcode-logo";
import { IsCertified } from "./IsCertificate";
import { ImLab } from "react-icons/im";
import { MdDownload } from "react-icons/md";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from "react-toastify";

export function ProducerCertificate({ userData, certificateType, blockchainData }) {
    function downloadCertificateLong(){
        toast.success('Baixando certificado...')
        const fileNameLong = `Certificate_${blockchainData?.producer?.producerWallet}`;
        var certificateLong = document.querySelector("#certificate");
        htmlToImage.toJpeg(certificateLong)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameLong);
        })
        .catch((error) => {
        
        })
    }

    function downloadCertificateShort(){
        toast.success('Baixando certificado...')
        const fileNameShort = `Certificate_${blockchainData?.producer?.producerWallet}`;
        var certificateShort = document.querySelector("#certificate-short");
        htmlToImage.toJpeg(certificateShort)
        .then((dataUrl) => {
            saveAs(dataUrl, fileNameShort);
        })
        .catch((error) => {
        
        })
    }

    if (certificateType === 'long') {
        return (
            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">Certificado longo</h3>
                    <button 
                        onClick={downloadCertificateLong}
                        className="px-2 py-1 rounded-md bg-green-700 flex items-center font-semibold text-white gap-1"
                    >
                        <MdDownload size={20} color='white' />
                        Baixar
                    </button>
                </div>

                <div className="flex flex-col rounded-md p-2 w-[460px] bg-certificate" id='certificate'>
                    <div className="flex flex-col bg-white rounded-md p-2">
                        <div className="flex items-center">
                            <div className="lg:w-[60%] flex flex-col gap-1">
                                <img
                                    src={require('../../assets/logo-cinza.png')}
                                    className="w-24 h-10 object-contain"
                                />

                                <div className="flex flex-col p-2 rounded-md bg-green-100 border border-green-500">
                                    <p className="font-bold text-xs">{blockchainData?.producer?.name}</p>
                                    <p className="font-bold text-xs">Inspeções recebidas: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                                    <p className="font-bold text-xs">Nota de regeneração: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                                    <p className="font-bold text-xs">Média: <span className="font-normal">{Number(Number(blockchainData?.producer?.isa?.isaScore) / Number(blockchainData?.producer?.totalInspections)).toFixed(0)}</span></p>
                                </div>

                                <div className="flex flex-col p-2 rounded-md bg-green-100 border border-green-500">
                                    <p className="font-bold text-xs">Carbono: <span className="font-normal">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(userData?.carbonImpact / 1000)} t</span></p>
                                    <p className="font-bold text-xs">Solo: <span className="font-normal">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(userData?.soilImpact / 10000)} ha</span></p>
                                    <p className="font-bold text-xs">Água: <span className="font-normal">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(userData?.waterImpact)} m³</span></p>
                                    <p className="font-bold text-xs">Biodiversid.: <span className="font-normal">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(userData?.bioImpact)} uv</span></p>
                                    <p className="font-bold text-xs">Árvores: <span className="font-normal">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(userData?.trees)}</span></p>
                                </div>
                            </div>

                            <div className="lg:w-[40%] flex flex-col rounded-md items-center justify-center">
                                <IsCertified
                                    producer={blockchainData?.producer}
                                />

                                <div className="flex items-center justify-center gap-1 mt-1">
                                    <ImLab size={15} color='#ff9900' />
                                    <p className="font-bold text-[#ff9900] text-xs">Rede de testes</p>
                                </div>

                                <QRCode
                                    value={`https://${window.location.host}/producer/${blockchainData?.producer?.producerWallet}`}
                                    size={140}
                                    qrStyle="dots"
                                    logoImage={require('../../assets/token.png')}
                                    logoPadding={2}
                                    logoPaddingStyle="square"
                                    logoWidth={30}
                                    removeQrCodeBehindLogo
                                    eyeColor='#0a4303'
                                />

                                <p className="font-bold text-center text-xs">Produtor regenerativo</p>
                            </div>
                        </div>
                        <p className="text-xs text-center text-black mt-2">{blockchainData?.producer?.producerWallet}</p>
                    </div>
                </div>

                <ToastContainer/>
            </div>
        );
    }

    if (certificateType === 'short') {
        return (
            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">Certificado curto</h3>
                    <button 
                        onClick={downloadCertificateShort}
                        className="px-2 py-1 rounded-md bg-green-700 flex items-center font-semibold text-white gap-1"
                    >
                        <MdDownload size={20} color='white' />
                        Baixar
                    </button>
                </div>

                <div className="flex flex-col bg-white rounded-md p-2 w-[270px]" id='certificate-short'>

                    <div className="w-full items-center flex flex-col gap-1">
                        <img
                            src={require('../../assets/logo-cinza.png')}
                            className="w-24 h-10 object-contain"
                        />

                        <p className="font-bold text-xs">{blockchainData?.producer?.name}</p>

                        <IsCertified
                            producer={blockchainData?.producer}
                        />

                        <div className="flex items-center justify-center gap-1 mb-2">
                            <ImLab size={15} color='#ff9900' />
                            <p className="font-bold text-[#ff9900] text-xs">Rede de testes</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col p-2 bg-[#0a4303] rounded-md items-center justify-center">
                        <p className="font-bold text-white text-xs mb-1">Produtor regenerativo</p>
                        <QRCode
                            value={`https://${window.location.host}/producer/${blockchainData?.producer?.producerWallet}`}
                            size={140}
                            qrStyle="dots"
                            logoImage={require('../../assets/token.png')}
                            logoPadding={2}
                            logoPaddingStyle="square"
                            logoWidth={30}
                            removeQrCodeBehindLogo
                            eyeColor='#0a4303'
                        />
                        <p className="text-[10px] text-center text-white mt-2">{blockchainData?.producer?.producerWallet}</p>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        );
    }
}