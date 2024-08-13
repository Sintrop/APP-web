import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useParams, useNavigate } from "react-router";
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { api } from "../../services/api";
import { getImage } from "../../services/getImage";
import { FaUser, FaListAlt, FaList, FaChevronRight, FaQrcode, FaHandHoldingUsd, FaUserCheck, FaMapMarkedAlt } from "react-icons/fa";
import format from "date-fns/format";
import { ProducerCertificate } from "../../components/Certificates/ProducerCertificate";
import { ContributeCertificate } from "../../components/Certificates/ContributeCertificate";
import { TopBar } from '../../components/TopBar';
import { PublicationItem } from '../Home/components/PublicationItem';
import { Item } from "../ImpactCalculator/components/Item";
import { Feedback } from "../../components/Feedback";
import { ProducerGraphics } from '../../components/ProducerGraphics';
import { Helmet } from "react-helmet";
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Polyline } from "../../components/Mapbox/Polyline";
import { RegenerationZoneProfile } from "../Profile/components/RegenerationZoneProfile";
import { Info } from "../../components/Info";
import { ShortPubli } from "../Profile/components/ShortPubli";
import { InspectionItem } from "../accountProducer/components/InspectionItem";
import { Chat } from "../../components/Chat";
import { useTranslation } from "react-i18next";

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

export function UserDetails() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { wallet } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [imageProfile, setImageProfile] = useState(null);
    const [tabSelected, setTabSelected] = useState('certificates');
    const [inspections, setInspections] = useState([]);
    const [proofPhoto, setProofPhoto] = useState(null);
    const [blockchainData, setBlockchainData] = useState({});
    const [zones, setZones] = useState([]);
    const [loadingInspections, setLoadingInspections] = useState(false);
    const [initialRegion, setInitialRegion] = useState(null);
    const [pathProperty, setPathProperty] = useState([]);
    const [publications, setPublications] = useState([]);
    const [loadingPubli, setLoadingPubli] = useState(false);
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [mapProperty, setMapProperty] = useState();
    const [invoicesThisYear, setInvoicesThisYear] = useState([]);

    useEffect(() => {
        getUserDetails();
    }, []);

    // useEffect(() => {
    //     if (userData) {
    //         if (userData?.userType === 1 || userData?.userType === 2) {
    //             getInspections();
    //         }
    //     }
    // }, [userData]);

    useEffect(() => {
        if (tabSelected === 'publis') getPublications();
        if (tabSelected === 'inspections') getInspections();
    }, [tabSelected])

    async function getPublications() {
        setLoadingPubli(true);
        const response = await api.get(`/publications/${userData.id}`);
        setPublications(response.data.publications);
        setLoadingPubli(false);
    }

    async function getUserDetails() {
        setLoading(true);

        const response = await api.get(`/user/${wallet}`);
        const user = response.data.user;

        setUserData(user);
        getImageProfile(user.imgProfileUrl);

        if (user?.itemsToReduce) {
            setItemsToReduce(JSON.parse(user?.itemsToReduce));
        }

        if (user?.userType === 1) {
            const response = await api.get(`/web3/producer-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data)
            getProofPhoto(response.data.producer.proofPhoto);
            const path = JSON.parse(user.propertyGeolocation);
            fixCoordinatesProperty(path);

            if (user.geoLocation) {
                setInitialRegion(JSON.parse(user.geoLocation));
                setMapProperty(JSON.parse(user.geoLocation));
            }
            if (user.zones) {
                setZones(JSON.parse(user.zones));
            }
        }

        if (user?.userType === 2) {
            const response = await api.get(`/web3/inspector-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data)
            getProofPhoto(response.data.inspector.proofPhoto);
        }

        if (user?.userType === 4) {
            const response = await api.get(`/web3/developer-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data)
            getProofPhoto(response.data.developer.proofPhoto);
        }

        if (user?.userType === 3) {
            const response = await api.get(`/web3/researcher-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            getProofPhoto(response.data.researcher.proofPhoto);
        }

        if (user?.userType === 6) {
            const response = await api.get(`/web3/activist-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data)
            getProofPhoto(response.data.activist.proofPhoto);
        }

        if (user?.userType === 8) {
            const response = await api.get(`/web3/validator-data/${String(user?.wallet).toLowerCase()}`);
            setBlockchainData(response.data)
            getProofPhoto(response.data.validator.proofPhoto);
        }

        getInvoices(user?.id);
        setLoading(false);
    }

    async function getInvoices(userId) {
        const atualYear = new Date().getFullYear();
        const response = await api.get(`/invoices/${userId}/${atualYear}`);
        setInvoicesThisYear(response.data.invoices);
    }

    async function getInspections() {
        setLoadingInspections(true);

        let array = [];
        const response = await api.get('/web3/history-inspections');
        array = response.data.inspections

        if (userData?.userType === 1) {
            const filter = array.filter(item => String(item.createdBy).toUpperCase() === String(userData?.wallet).toUpperCase());
            setInspections(filter);
        }
        if (userData?.userType === 2) {
            const filter = array.filter(item => String(item.acceptedBy).toUpperCase() === String(userData?.wallet).toUpperCase());
            setInspections(filter);
        }

        setLoadingInspections(false);
    }

    function fixCoordinatesProperty(coords) {
        let array = [];
        for (var i = 0; i < coords.length; i++) {
            array.push([coords[i].longitude, coords[i].latitude]);
        }
        array.push([coords[0].longitude, coords[0].latitude]);
        setPathProperty(array);
    }

    async function getProofPhoto(hash) {
        const response = await getImage(hash);
        setProofPhoto(response);
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/user-details/${String(wallet).toLowerCase()}`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 px-1 lg:px-0 lg:pt-32 overflow-auto">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 mb-20">
                    {loading ? (
                        <div className="flex justify-center mt-10">
                            <ActivityIndicator size={60} />
                        </div>
                    ) : (
                        <>
                            {userData && (
                                <>
                                    {blockchainData?.userType === 9 && (
                                        <div className="flex items-center justify-center w-full h-20 bg-red-600 rounded-md">
                                            <p className="font-bold text-white text-xl">{t('usuarioInvalidado')}</p>
                                        </div>
                                    )}
                                    <div className="w-full flex flex-col bg-[#0a4303] p-3 rounded">
                                        <div className="bg-florest w-full h-[230px] bg-center bg-cover bg-no-repeat rounded-t-md">
                                            {userData?.bannerUrl && (
                                                <img
                                                    src={userData?.bannerUrl}
                                                    className="w-full h-full object-cover rounded-t-md"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col bg-green-950 p-3 rounded">
                                            <div className="w-28 h-28 rounded-full bg-gray-400 border-4 border-white mt-[-90px]">
                                                {imageProfile ? (
                                                    <img
                                                        src={imageProfile}
                                                        className="rounded-full object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <>
                                                        {userData?.userType === 7 && (
                                                            <img
                                                                src={require('../../assets/icon-validator.png')}
                                                                className="rounded-full object-cover w-full h-full"
                                                            />
                                                        )}

                                                        {userData?.userType === 8 && (
                                                            <img
                                                                src={require('../../assets/icon-validator.png')}
                                                                className="rounded-full object-cover w-full h-full"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <p className="font-bold text-white mt-3 text-sm lg:text-base">{userData?.name}</p>
                                            <p className="text-gray-300 text-sm">
                                                {userData?.userType === 1 && t('textProdutor')}
                                                {userData?.userType === 2 && t('textInspetor')}
                                                {userData?.userType === 3 && t('textPesquisador')}
                                                {userData?.userType === 4 && t('textDesenvolvedor')}
                                                {userData?.userType === 5 && t('textContribuidor')}
                                                {userData?.userType === 6 && t('textAtivista')}
                                                {userData?.userType === 7 && t('textApoiador')}
                                                {userData?.userType === 8 && t('textValidador')}
                                            </p>

                                            {userData?.bio && (
                                                <p className="text-sm text-white">{userData?.bio}</p>
                                            )}

                                            <div className="p-1 bg-[#0a4303] border-2 border-green-500 rounded-md w-fit mt-1">
                                                <p className="text-white text-xs lg:text-base">Wallet: {wallet}</p>
                                            </div>

                                            <div className="flex gap-3 mt-2 ">
                                                {userData?.userType === 1 && (
                                                    <a
                                                        className="flex items-center gap-2 text-white font-semibold text-sm py-1 px-3 border rounded-md w-fit bg-[#0a4303]"
                                                        href={`https://app.sintrop.com/producer/${String(userData?.wallet).toLowerCase()}`}
                                                        target="_blank"
                                                    >
                                                        <FaUserCheck color='white' size={20} />
                                                        {t('paginaProdutor')}
                                                    </a>
                                                )}

                                                <a
                                                    className="flex items-center gap-2 text-white font-semibold text-sm py-1 px-3 border rounded-md w-fit bg-[#0a4303]"
                                                    href={`https://app.sintrop.com/supporter/${String(userData?.wallet).toLowerCase()}`}
                                                    target="_blank"
                                                >
                                                    <FaHandHoldingUsd color='white' size={20} />
                                                    {t('paginaApoiador')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-2 w-full overflow-x-scroll">
                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('certificates')}
                                        >
                                            <FaQrcode size={18} color={tabSelected === 'certificates' ? 'green' : 'white'} />
                                            {t('certificados')}
                                        </button>

                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('data')}
                                        >
                                            <FaUser size={18} color={tabSelected === 'data' ? 'green' : 'white'} />
                                            {t('dados')}
                                        </button>

                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('publis')}
                                        >
                                            <FaListAlt size={18} color={tabSelected === 'publis' ? 'green' : 'white'} />
                                            {t('publicacoes')}
                                        </button>

                                        {userData?.userType === 1 && (
                                            <>
                                                <button
                                                    className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                    onClick={() => setTabSelected('inspections')}
                                                >
                                                    <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                    {t('isps')}
                                                </button>

                                                <button
                                                    className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'zones' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                    onClick={() => setTabSelected('zones')}
                                                >
                                                    <FaMapMarkedAlt size={18} color={tabSelected === 'zones' ? 'green' : 'white'} />
                                                    {t('zonasDeRegeneracao')}
                                                </button>
                                            </>
                                        )}

                                        {userData?.userType === 2 && (
                                            <button
                                                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                {t('isps')}
                                            </button>
                                        )}
                                    </div>

                                    {tabSelected === 'data' && (
                                        <>
                                            {userData?.userType === 1 && (
                                                <div className='flex flex-col w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                                                    <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>{t('statsProdutor')}</h3>

                                                    <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                                                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                            <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.producer?.totalInspections} </p>
                                                            <p className='text-white text-xs lg:text-base'>{t('ispsRecebidas')}</p>
                                                        </div>

                                                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                            <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.producer?.isa?.isaScore}</p>
                                                            <p className='text-white text-xs lg:text-base'>{t('pts')}</p>
                                                        </div>

                                                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                            <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(blockchainData?.producer?.isa?.isaScore / blockchainData?.producer?.totalInspections)}</p>
                                                            <p className='text-white text-xs lg:text-base'>{t('media')}</p>
                                                        </div>

                                                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                            <p className='font-bold text-white text-xl lg:text-3xl'>0</p>
                                                            <p className='text-red-500 text-xs lg:text-base'>{t('denunciasRecebidas')}</p>
                                                        </div>
                                                    </div>

                                                    <ProducerGraphics inspections={inspections} />
                                                </div>
                                            )}

                                            <div className="flex items-center flex-col gap-4 mt-2 w-full">
                                                <div className="p-2 rounded-md flex flex-col items-center bg-[#0a4303] gap-2 w-full lg:flex-row lg:items-start">
                                                    <div className="flex flex-col">
                                                        <div className="w-[200px] h-[200px] rounded-md bg-gray-400">
                                                            {proofPhoto && (
                                                                <img
                                                                    src={proofPhoto}
                                                                    className="w-[200px] h-[200px] rounded-md object-cover border-2 border-white"
                                                                />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-center text-gray-400 mb-1">{t('fotoProva')}</p>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-white font-bold text-xs lg:text-sm">{t('entrouComunidade')}: <span className="font-normal">{format(new Date(userData?.createdAt), 'dd/MM/yyyy')}</span></p>

                                                        {userData?.userType === 1 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('areaPropriedade')}:
                                                                    <span className="font-normal"> {Intl.NumberFormat('pt-BR').format(Number(blockchainData?.producer?.certifiedArea).toFixed(0))} m²</span>
                                                                </p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('ptsRegen')}: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.producer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.producer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.producer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 2 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.inspector?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('desistencias')}: <span className="font-normal">{blockchainData?.inspector?.giveUps}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.inspector?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.inspector?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.inspector?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 3 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('pesquisasPublicadas')}: <span className="font-normal">{blockchainData?.researcher?.publishedWorks}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.researcher?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.researcher?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.researcher?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 4 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('nivel')}: <span className="font-normal">{blockchainData?.developer?.pool?.level}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.developer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.developer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.developer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 6 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.activist?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.activist?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.activist?.userType}</span></p>
                                                            </>
                                                        )}
                                                    </div>

                                                </div>

                                                {userData?.userType === 1 && (
                                                    <>
                                                        <div className="p-2 rounded-md bg-[#0a4303] gap-2 w-full flex flex-col">
                                                            <p className="text-xs text-center text-gray-400 mb-1">{t('mapaPropriedade')}</p>

                                                            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                                                                <ReactMapGL
                                                                    style={{ width: '100%', height: '100%' }}
                                                                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                                                                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                                                                    latitude={mapProperty?.latitude}
                                                                    longitude={mapProperty?.longitude}
                                                                    onDrag={(e) => {
                                                                        setMapProperty({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                                                                    }}
                                                                    minZoom={12}
                                                                >
                                                                    <Marker latitude={initialRegion?.latitude} longitude={initialRegion?.longitude} color="red" />

                                                                    <Polyline
                                                                        coordinates={pathProperty}
                                                                        lineColor='yellow'
                                                                        lineWidth={4}
                                                                    />
                                                                </ReactMapGL>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {tabSelected === 'inspections' && (
                                        <>
                                            <div className="flex flex-col mt-5 gap-4">
                                                {loadingInspections ? (
                                                    <div className="flex w-full justify-center mt-5">
                                                        <ActivityIndicator size={50} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {inspections.map((item, index) => (
                                                            <InspectionItem
                                                                index={index}
                                                                inspectionId={item.id}
                                                                key={item?.id}
                                                            />
                                                        ))}
                                                    </>
                                                )}
                                                {/* {inspections.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className="w-full p-3 rounded-md flex items-center justify-between bg-[#0a4303]"
                                                        onClick={() => navigate(`/result-inspection/${item.id}`)}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <p className="font-bold text-white text-xs lg:text-sm">Inspeção #{item.id}</p>
                                                        </div>

                                                        <FaChevronRight color='white' size={20} />
                                                    </button>
                                                ))} */}
                                            </div>
                                        </>
                                    )}

                                    {tabSelected === 'certificates' && (
                                        <div className="mt-5 gap-5 flex flex-col">
                                            {userData?.userType === 1 && (
                                                <>
                                                    <ProducerCertificate
                                                        certificateType='new-long'
                                                        userData={userData}
                                                        blockchainData={blockchainData}
                                                        imageProfile={imageProfile}
                                                    />

                                                    <ProducerCertificate
                                                        certificateType='short'
                                                        userData={userData}
                                                        blockchainData={blockchainData}
                                                    />
                                                </>
                                            )}

                                            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                                                <h3 className="font-bold text-white">{t('certificadoContribuicao')}</h3>
                                                <ContributeCertificate wallet={wallet} user={userData} />
                                            </div>

                                            <div className="w-full flex flex-col rounded-md p-3">
                                                <h3 className="font-bold text-white mb-1">{t('compromissoReducao')}</h3>
                                                <Info text1='Esses são os itens que o usuário declara consumir na calculadora de impacto.' />
                                                {itemsToReduce.length === 0 && (
                                                    <p className="text-white text-center mt-4 mb-8">{t('nenhumItemNaListaDeReducao')}</p>
                                                )}
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    {itemsToReduce.map(item => (
                                                        <Item
                                                            key={item?.id}
                                                            data={item}
                                                            type='consumption-graph'
                                                            userId={userData?.id}
                                                            hiddenButton
                                                            invoices={invoicesThisYear}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {tabSelected === 'publis' && (
                                        <div className="mt-5 gap-4 flex flex-wrap justify-center w-full lg:justify-start">
                                            {loadingPubli ? (
                                                <div className="flex w-full justify-center mt-5">
                                                    <ActivityIndicator size={50} />
                                                </div>
                                            ) : (
                                                <>
                                                    {publications.map(item => (
                                                        <ShortPubli
                                                            key={item.id}
                                                            data={item}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {tabSelected === 'zones' && (
                                        <div className="mt-5 gap-5 flex flex-col items-center w-full">
                                            {zones.length === 0 ? (
                                                <p className="text-white text-center">{t('nenhumaZonaCadastrada')}</p>
                                            ) : (
                                                <>
                                                    {zones.map(item => (
                                                        <RegenerationZoneProfile
                                                            key={item?.title}
                                                            data={item}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat />
            </div>
        </div>
    )
}