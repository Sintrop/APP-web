import React from "react";

interface Props{
    networkName: string;
}
export function UnsupportedNetworkPage({networkName}: Props){
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#043832] to-[#1F5D38]">
            <div className="flex flex-col max-w-[700px] p-5">
                <img
                    src={require('../../assets/logo-cr.png')}
                    alt='Logo do credito de regeneração'
                    className="w-[300px] object-contain"
                />

                <h1 className="text-white font-bold text-2xl mt-10">Rede imcompatível!</h1>
                <p className="text-white mt-3">
                    A rede {networkName} a qual você está conectado no momento, não é compatível. Troque para nossa rede ou adicione nossa rede em seu metamask
                </p>

                <h2 className="font-bold text-white mt-10 text-center">Dados da Sequoia Test Network</h2>
                <p className="text-white mt-3">
                    Nome da rede: <span className="font-bold">Sequoia Test Network</span>
                </p>
                <p className="text-white">
                    URL do RPC: <span className="font-bold">https://sequoiarpc.sintrop.com</span>
                </p>
                <p className="text-white">
                    ID da cadeia (ID da rede): <span className="font-bold">1500</span>
                </p>
                <p className="text-white">
                    Símbolo: <span className="font-bold">SIN</span>
                </p>
                <p className="text-white">
                    URL do explorador: <span className="font-bold">https://sequoia.sintrop.com</span>
                </p>
            </div>
        </div>
    )
}