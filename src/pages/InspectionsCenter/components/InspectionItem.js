import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { getImage } from "../../../services/getImage";
import format from "date-fns/format";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function InspectionItem({ data, type }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [producerData, setProducerData] = useState({});
    const [inspectorData, setInspectorData] = useState({});
    const [addressProducer, setAddressProducer] = useState({});
    const [loading, setLoading] = useState(false);
    const [blocksExpire, setBlocksExpire] = useState(0);
    const [zones, setZones] = useState([]);
    const [imageProfileProducer, setImageProfileProducer] = useState(null);
    const [imageProfileInspector, setImageProfileInspector] = useState(null);

    useEffect(() => {
        getProducer();
        getInspector();

        if (data.status === 1) {
            getExpires();
        }
    }, []);

    async function getProducer() {
        const response = await api.get(`/user/${String(data?.createdBy).toUpperCase()}`);
        const resUser = response.data.user;
        setProducerData(resUser);
        getImageProfileProducer(resUser.imgProfileUrl)
        setAddressProducer(JSON.parse(resUser.address));
        if (resUser.zones) {
            setZones(JSON.parse(resUser.zones));
        }
    }

    async function getInspector() {
        const response = await api.get(`/user/${String(data?.acceptedBy).toUpperCase()}`);
        setInspectorData(response.data.user);
        getImageProfileInspector(response.data.user.imgProfileUrl)
    }

    async function getExpires() {
        const response = await api.get(`/web3/blocks-to-expire/${data?.id}`);
        setBlocksExpire(Number(response.data.expiresIn))

        let blocks = 0
        blocks = Number(response.data.expiresIn)

        setInterval(() => {
            blocks -= 1
            setBlocksExpire(blocks)
        }, 15000);
    }

    async function getImageProfileProducer(hash) {
        const response = await getImage(hash);
        setImageProfileProducer(response);
    }

    async function getImageProfileInspector(hash) {
        const response = await getImage(hash);
        setImageProfileInspector(response);
    }

    if (type === 'history') {
        return (
            <div className="w-full flex flex-col bg-[#03364B] rounded-md p-2">
                <div className="flex flex-col lg:items-center justify-between lg:flex-row">
                    <div className="flex flex-col lg:items-center lg:flex-row">
                        <div>
                            <p className="font-bold text-white">ID</p>
                            <p className="text-white">{data.id}</p>
                        </div>

                        <div className="lg:ml-8">
                            <p className="font-bold text-white">{t('endereco')}</p>
                            <p className="text-white">{addressProducer?.street}, {addressProducer?.city}/{addressProducer?.state}</p>
                        </div>
                    </div>

                    <div className="flex flex-col w-full lg:w-fit">
                        {data.status === 2 && (
                            <div className="flex flex-col lg:items-end">
                                <p className="font-bold text-white">{t('inspecionadoEm')}</p>
                                <p className="text-white">{format(new Date((data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy')}</p>
                            </div>    
                        )}

                        {data.status === 4 && (
                            <div className="flex flex-col p-1 bg-red-600 lg:items-end rounded">
                                <p className="font-bold text-white">{t('invalidada')}</p>
                                <p className="text-white">{t('noBloco')}: {data?.invalidatedAt}</p>
                            </div>    
                        )}

                        {data.status === 3 && (
                            <div className="flex flex-col p-1 bg-orange-500 lg:items-end rounded">
                                <p className="font-bold text-white">{t('expirada')}</p>
                            </div>    
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:items-center justify-between mt-2 lg:flex-row">
                    <div className="flex flex-col items-center gap-3 lg:flex-row">
                        <div className="flex flex-col w-full lg:w-fit">
                            <p className="text-xs text-gray-400">{t('produtor')}:</p>
                            <button 
                                className="p-2 gap-3 flex items-center bg-green-950 rounded-md"
                                onClick={() => navigate(`/user-details/${data.createdBy}`)}
                            >   
                                <div className="w-8 h-8 rounded-full bg-gray-500">
                                    {imageProfileProducer && (
                                        <img
                                            src={imageProfileProducer}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="text-sm font-bold text-white">{producerData?.name}</p>
                            </button>
                        </div>

                        <div className="flex flex-col w-full lg:w-fit">
                            <p className="text-xs text-gray-400">{t('inspetor')}:</p>
                            <button 
                                className="p-2 gap-3 flex items-center bg-green-950 rounded-md"
                                onClick={() => navigate(`/user-details/${data.acceptedBy}`)}
                            >   
                                <div className="w-8 h-8 rounded-full bg-gray-500">
                                    {imageProfileInspector && (
                                        <img
                                            src={imageProfileInspector}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="text-sm font-bold text-white">{inspectorData?.name}</p>
                            </button>
                        </div>
                    </div>
                    
                    {data.status === 2 && (
                        <div className="flex flex-col items-center justify-center p-1 bg-green-950 border-2 border-white rounded-md mt-3 lg:mt-0">
                            <p className="font-bold text-white">{data?.isaScore}</p>
                            <p className="text-white text-xs">{t('ptsRegen')}</p>
                        </div>
                    )}
                </div>
                
                {data.status !== 3 && (
                    <div className="flex items-center justify-end mt-2">
                        <button 
                            className="p-1 rounded-md font-bold text-white text-sm bg-blue-500"
                            onClick={() => navigate(`/result-inspection/${data.id}`)}
                        >
                            {t('verResultado')}
                        </button>
                    </div>
                )}
            </div>
        )
    }

    if (type === 'manage') {
        return (
            <div className="w-full flex flex-col bg-[#03364B] rounded-md p-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <p className="font-bold text-white">ID</p>
                            <p className="text-white">{data.id}</p>
                        </div>

                        <div className="ml-8">
                            <p className="font-bold text-white">{t('endereco')}</p>
                            <p className="text-white">{addressProducer?.street}, {addressProducer?.city}/{addressProducer?.state}</p>
                        </div>
                    </div>

                    <div>
                        {data.status === 0 && (
                            <div className="flex flex-col items-end">
                                <p className="font-bold text-white">{t('solicitada')}</p>
                                <p className="text-white">{t('noBloco')}: {data.createdAt}</p>
                            </div>    
                        )}

                        {data.status === 1 && (
                            <div className="flex flex-col items-end">
                                <p className="font-bold text-white">{t('aceita')}</p>
                                <p className="text-white">{t('noBloco')}: {data.acceptedAt}</p>
                            </div>   
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <p className="text-xs text-gray-400">{t('produtor')}:</p>
                            <button 
                                className="p-2 gap-3 flex items-center bg-green-950 rounded-md"
                                onClick={() => navigate(`/user-details/${data.createdBy}`)}
                            >   
                                <div className="w-8 h-8 rounded-full bg-gray-500">
                                    {imageProfileProducer && (
                                        <img
                                            src={imageProfileProducer}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="text-sm font-bold text-white">{producerData?.name}</p>
                            </button>
                        </div>
                        
                        {data.status === 1 && (
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-400">{t('inspetor')}:</p>
                                <button 
                                    className="p-2 gap-3 flex items-center bg-green-950 rounded-md"
                                    onClick={() => navigate(`/user-details/${data.acceptedBy}`)}
                                >   
                                    <div className="w-8 h-8 rounded-full bg-gray-500">
                                        {imageProfileInspector && (
                                            <img
                                                src={imageProfileInspector}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm font-bold text-white">{inspectorData?.name}</p>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
        
            </div>
        )
    }
}