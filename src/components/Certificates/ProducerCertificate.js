import React from "react";
import { QRCode } from "react-qrcode-logo";
import { IsCertified } from "./IsCertificate";

export function ProducerCertificate({ userData, certificateType, blockchainData }) {

    if (certificateType === 'long') {
        return (
            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                <h3 className="font-bold text-white">Certificado longo</h3>

                <div className="flex flex-col bg-white rounded-md p-2 w-[500px]">
                <div className="flex ">
                    <div className="w-[250px] flex flex-col gap-1">
                        <img
                            src={require('../../assets/logo-cinza.png')}
                            className="w-24 h-10 object-contain"
                        />

                        <IsCertified
                            producer={blockchainData?.producer}
                        />

                        <p className="font-bold text-xs">{blockchainData?.producer?.name}</p>
                        <p className="font-bold text-xs">Inspeções recebidas: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                        <p className="font-bold text-xs">Nota de regeneração: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                        <p className="font-bold text-xs">Média: <span className="font-normal">{Number(Number(blockchainData?.producer?.isa?.isaScore) / Number(blockchainData?.producer?.totalInspections)).toFixed(0)}</span></p>

                        <div className="w-full border border-dashed border-black my-2" />

                        <p className="font-bold text-xs">Carbono: <span className="font-normal">{Intl.NumberFormat('pt-BR').format(Number(userData?.carbonImpact).toFixed(0))} kg</span></p>
                        <p className="font-bold text-xs">Solo: <span className="font-normal">{Intl.NumberFormat('pt-BR').format(Number(userData?.soilImpact).toFixed(0))} m²</span></p>
                        <p className="font-bold text-xs">Água: <span className="font-normal">{Intl.NumberFormat('pt-BR').format(Number(userData?.waterImpact).toFixed(0))} m³</span></p>
                        <p className="font-bold text-xs">Biodiversid.: <span className="font-normal">{Intl.NumberFormat('pt-BR').format(Number(userData?.bioImpact).toFixed(0))} uv</span></p>
                        <p className="font-bold text-xs">Árvores: <span className="font-normal">{Intl.NumberFormat('pt-BR').format(Number(userData?.trees).toFixed(0))}</span></p>
                    </div>

                    <div className="w-[250px] flex flex-col gap-1 bg-[#0a4303] rounded-md items-center justify-center">
                        <QRCode
                            value={`https://${window.location.host}/account-producer/${blockchainData?.producer?.wallet}`}
                            size={140}
                            qrStyle="dots"
                            logoImage={require('../../assets/icone.png')}
                            logoPadding={2}
                            logoPaddingStyle="square"
                            logoWidth={30}
                            removeQrCodeBehindLogo
                            eyeColor='#0a4303'
                        />
                    </div>
                </div>
                <p className="text-xs text-center text-black mt-2">{blockchainData?.producer?.producerWallet}</p>
                </div>
            </div>
        );
    }

    if (certificateType === 'short') {
        return (
            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                <h3 className="font-bold text-white">Certificado curto</h3>

                <div className="flex flex-col bg-white rounded-md p-2 w-[270px]">
                
                    <div className="w-full items-center flex flex-col gap-1">
                        <img
                            src={require('../../assets/logo-cinza.png')}
                            className="w-24 h-10 object-contain"
                        />

                        <IsCertified
                            producer={blockchainData?.producer}
                        />

                        <p className="font-bold text-xs">{blockchainData?.producer?.name}</p>
                        
                    </div>

                    <div className="w-full flex flex-col p-4 bg-[#0a4303] rounded-md items-center justify-center">
                        <QRCode
                            value={`https://${window.location.host}/account-producer/${blockchainData?.producer?.wallet}`}
                            size={140}
                            qrStyle="dots"
                            logoImage={require('../../assets/icone.png')}
                            logoPadding={2}
                            logoPaddingStyle="square"
                            logoWidth={30}
                            removeQrCodeBehindLogo
                            eyeColor='#0a4303'
                        />
                    </div>
                    <p className="text-xs text-center text-black mt-2">{blockchainData?.producer?.producerWallet}</p>
                </div>
            </div>
        );
    }
}