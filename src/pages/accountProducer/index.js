import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './accountProducer.css';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { FaChevronRight } from 'react-icons/fa';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Polyline } from '../../components/Mapbox/Polyline';

//components
import { getImage } from '../../services/getImage';
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { ProducerGraphics } from '../../components/ProducerGraphics';
import { Helmet } from "react-helmet";
import {Inspection} from '../ResultInspection/components/Inspection';

export default function AccountProducer() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { walletSelected } = useParams();
    const [producerData, setProducerData] = useState([]);
    const [producerAddress, setProducerAddress] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [imageProfile, setImageProfile] = useState(null);
    const [userData, setUserData] = useState({});
    const [initialRegion, setInitialRegion] = useState(null);
    const [loadingInspections, setLoadingInspections] = useState(false);
    const [pathProperty, setPathProperty] = useState([]);

    useEffect(() => {
        getProducer();
        getProducerApi();
    }, []);

    async function getProducer() {
        const response = await api.get(`/web3/producer-data/${String(walletSelected).toLowerCase()}`);
        setProducerData(response.data.producer);
        getInspections();
    }

    async function getInspections() {
        setLoadingInspections(true);

        let array = [];
        const response = await api.get('/web3/history-inspections');
        array = response.data.inspections

        const filter = array.filter(item => String(item.createdBy).toUpperCase() === String(walletSelected).toUpperCase());
        setInspections(filter);

        setLoadingInspections(false);
    }

    async function getProducerApi() {
        try {
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            const address = JSON.parse(response.data.user?.address)
            const path = JSON.parse(response.data.user.propertyGeolocation);

            setProducerAddress(address);
            setUserData(response.data.user);
            getImageProfile(response.data.user.imgProfileUrl);
            fixCoordinatesProperty(JSON.parse(response.data.user.propertyGeolocation))
            if (response.data.user.geoLocation) {
                setInitialRegion(JSON.parse(response.data.user.geoLocation));
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    function fixCoordinatesProperty(coords) {
        let array = [];
        for (var i = 0; i < coords.length; i++) {
            array.push([coords[i].longitude, coords[i].latitude]);
        }
        array.push([coords[0].longitude, coords[0].latitude]);
        setPathProperty(array);
    }

    return (
        <div className="w-full flex flex-col items-center bg-green-950 h-[100vh] pt-5 overflow-y-auto overflow-x-hidden px-2">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Produtor - Sintrop</title>
                <link rel="canonical" href={`https://app.sintrop.com/producer/${String(walletSelected).toLowerCase()}`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <img
                src={require('../../assets/logo-branco.png')}
                className='w-[140px] lg:w-[170px] object-contain'
            />

            <div className='flex flex-col items-center lg:w-[1000px] lg:flex-row w-full gap-5 mt-5 lg:gap-5 lg:px-30 lg:mt-10 bg-[#0a4303] rounded-md p-3'>
                <img
                    src={imageProfile ? imageProfile : require('../../assets/token.png')}
                    className='h-[150px] w-[150px] lg:h-[200px] lg:w-[200px] object-cover border-4  rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col items-center lg:items-start'>
                    <h1 className='font-bold text-center lg:text-left lg:text-2xl text-white'>{userData?.name}</h1>
                    <h3 className='text-center text-xs lg:text-left lg:text-lg text-white lg:max-w-full'>{walletSelected}</h3>
                    <p className='text-center text-sm lg:text-left text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>

                    <button
                        className='font-semibold text-white px-3 py-1 rounded-md bg-blue-500 mt-2'
                        onClick={() => navigate(`/user-details/${walletSelected}`)}
                    >
                        Ver perfil
                    </button>
                </div>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Estatísticas do(a) produtor(a)</h3>

                <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{producerData?.totalInspections} </p>
                        <p className='text-white text-xs lg:text-base'>Inspeções recebidas</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{producerData?.isa?.isaScore}</p>
                        <p className='text-white text-xs lg:text-base'>Pontuação</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(producerData?.isa?.isaScore / producerData?.totalInspections)}</p>
                        <p className='text-white text-xs lg:text-base'>Média</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>0</p>
                        <p className='text-red-500 text-xs lg:text-base'>Denúncias recebidas</p>
                    </div>
                </div>

                <ProducerGraphics inspections={inspections} />
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Mapa da propriedade</h3>
                {initialRegion && (
                    <ReactMapGL
                        style={{ width: '100%', height: 300 }}
                        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                        latitude={initialRegion?.latitude}
                        longitude={initialRegion?.longitude}
                        onDrag={(e) => {
                            setInitialRegion({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                        }}
                        minZoom={16}
                    >
                        <Polyline
                            coordinates={pathProperty}
                            lineColor='yellow'
                            lineWidth={4}
                        />
                    </ReactMapGL>
                )}
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 rounded-md p-1 lg:p-0 mb-10'>
                <h3 className='font-bold text-white text-center lg:text-lg'>Inspeções recebidas</h3>

                {inspections.map(item => (
                    <button
                        key={item.id}
                        className="w-full p-3 rounded-md flex items-center justify-between bg-[#0a4303]"
                        onClick={() => navigate(`/result-inspection/${item.id}`)}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="font-bold text-white text-sm">Inspeção #{item.id}</p>
                        </div>

                        <FaChevronRight color='white' size={20} />
                    </button>
                ))}
            </div>
        </div>
    )
}