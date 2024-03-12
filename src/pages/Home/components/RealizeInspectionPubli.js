import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../services/api";
import { Blocks } from 'react-loader-spinner';

export function RealizeInspectionPubli({ data }) {
    const additionalData = JSON.parse(data?.additionalData);
    const navigate = useNavigate();
    const [inspectionData, setInspectionData] = useState({});
    const [loadingInspection, setLoadingInspection] = useState(false);

    useEffect(() => {
        getIsas(additionalData.inspectionId);
    }, []);

    async function getIsas(id) {
        setLoadingInspection(true);
        const response = await api.get(`/web3/inspection/${id}`);
        setInspectionData(response.data);
        setLoadingInspection(false);
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center w-full justify-between">
                <p className="text-white">Realizou a inspeção #{additionalData.inspectionId}</p>

                <div className="flex flex-col items-center justify-center p-2 bg-green-950 border-2 border-white rounded-md">
                    <p className="font-bold text-white">{inspectionData?.inspection?.isaScore}</p>
                    <p className="text-white text-xs">Pontos de regeneração</p>
                </div>
            </div>

            <p className="text-gray-400 text-xs mt-1 text-center mb-1">Impacto da inspeção</p>
            {loadingInspection ? (
                <div className="flex w-full justify-center">
                    <Blocks
                        height="40"
                        width="40"
                        color="#4fa94d"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        visible={true}
                    />
                </div>
            ) : (
                <>
                    <div className="flex w-full items-center justify-between p-2 bg-green-950 rounded-md">
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../../assets/co2.png')}
                                className="h-5 w-5 object-contain"
                            />

                            <p className="font-bold text-white text-sm">Carbono</p>
                        </div>

                        <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number((inspectionData?.isaData?.carbon?.indicator) / 1000).toFixed(1))} t</p>
                    </div>
                    <div className="flex w-full items-center justify-between p-2 bg-green-950 rounded-md mt-2">
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../../assets/solo.png')}
                                className="h-5 w-5 object-contain"
                            />

                            <p className="font-bold text-white text-sm">Solo</p>
                        </div>

                        <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(inspectionData?.isaData?.soil?.indicator).toFixed(0))} m²</p>
                    </div>
                    <div className="flex w-full items-center justify-between p-2 bg-green-950 rounded-md mt-2">
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../../assets/agua.png')}
                                className="h-5 w-5 object-contain"
                            />

                            <p className="font-bold text-white text-sm">Água</p>
                        </div>

                        <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(inspectionData?.isaData?.water?.indicator).toFixed(0))} m³</p>
                    </div>
                    <div className="flex w-full items-center justify-between p-2 bg-green-950 rounded-md mt-2">
                        <div className="flex items-center gap-2">
                            <img
                                src={require('../../../assets/bio.png')}
                                className="h-5 w-5 object-contain"
                            />

                            <p className="font-bold text-white text-sm">Biodiversidade</p>
                        </div>

                        <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(inspectionData?.isaData?.bio?.indicator).toFixed(0))} uv</p>
                    </div>

                    <p 
                        className="mt-5 underline text-blue-400 text-center"
                    >
                        Ver resultado detalhado
                    </p>
                </>
            )}
        </div>
    )
}