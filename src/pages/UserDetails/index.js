import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useParams, useNavigate } from "react-router";
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { api } from "../../services/api";
import { getImage } from "../../services/getImage";
import { FaUser, FaListAlt, FaList, FaChevronRight, FaQrcode } from "react-icons/fa";
import format from "date-fns/format";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ProducerCertificate } from "../../components/Certificates/ProducerCertificate";
import { ContributeCertificate } from "../../components/Certificates/ContributeCertificate";
import { TopBar } from '../../components/TopBar';
import { PublicationItem } from '../Home/components/PublicationItem';
import { Item } from "../ImpactCalculator/components/Item";

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

export function UserDetails() {
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

    useEffect(() => {
        getUserDetails();
    }, []);

    useEffect(() => {
        if (userData) {
            if (userData?.userType === 1 || userData?.userType === 2) {
                getInspections();
            }
            getPublications()
        }
    }, [userData]);

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

        setLoading(false);
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
            array.push(coords[i]);
        }
        array.push(coords[0]);
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
                                                        className="rounded-full object-cover"
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
                                                {userData?.userType === 1 && 'Produtor(a)'}
                                                {userData?.userType === 2 && 'Inspetor(a)'}
                                                {userData?.userType === 3 && 'Pesquisador(a)'}
                                                {userData?.userType === 4 && 'Desenvolvedor(a)'}
                                                {userData?.userType === 5 && 'Contribuidor(a)'}
                                                {userData?.userType === 6 && 'Ativista'}
                                                {userData?.userType === 7 && 'Apoiador(a)'}
                                                {userData?.userType === 8 && 'Validador(a)'}
                                            </p>

                                            {userData?.bio && (
                                                <p className="text-sm text-white">{userData?.bio}</p>
                                            )}
                                            
                                            <div className="p-1 bg-[#0a4303] border-2 border-green-500 rounded-md w-fit mt-1">
                                                <p className="text-white text-xs lg:text-base">Wallet: {wallet}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-2 w-full overflow-x-scroll">
                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('certificates')}
                                        >
                                            <FaQrcode size={18} color={tabSelected === 'certificates' ? 'green' : 'white'} />
                                            Certificados
                                        </button>

                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('data')}
                                        >
                                            <FaUser size={18} color={tabSelected === 'data' ? 'green' : 'white'} />
                                            Dados
                                        </button>

                                        <button
                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                            onClick={() => setTabSelected('publis')}
                                        >
                                            <FaListAlt size={18} color={tabSelected === 'publis' ? 'green' : 'white'} />
                                            Publicações
                                        </button>

                                        {userData?.userType === 1 && (
                                            <button
                                                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}

                                        {userData?.userType === 2 && (
                                            <button
                                                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}
                                    </div>

                                    {tabSelected === 'data' && (
                                        <>
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
                                                        <p className="text-xs text-center text-gray-400 mb-1">Foto de prova</p>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-white font-bold text-xs lg:text-sm">Entrou na comunidade em: <span className="font-normal">{format(new Date(userData?.createdAt), 'dd/MM/yyyy')}</span></p>

                                                        {userData?.userType === 1 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Área da propriedade:
                                                                    <span className="font-normal"> {Intl.NumberFormat('pt-BR').format(Number(blockchainData?.producer?.certifiedArea).toFixed(0))} m²</span>
                                                                </p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Total de inspeções: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Score de regeneração: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.producer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.producer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.producer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 2 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Total de inspeções: <span className="font-normal">{blockchainData?.inspector?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Desistências: <span className="font-normal">{blockchainData?.inspector?.giveUps}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.inspector?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.inspector?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.inspector?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 3 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Pesquisas publicadas: <span className="font-normal">{blockchainData?.researcher?.publishedWorks}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.researcher?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.researcher?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.researcher?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 4 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Nível: <span className="font-normal">{blockchainData?.developer?.pool?.level}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.developer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.developer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.developer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 6 && (
                                                            <>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.activist?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.activist?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.activist?.userType}</span></p>
                                                            </>
                                                        )}
                                                    </div>

                                                </div>

                                                {userData?.userType === 1 && (
                                                    <>
                                                        <div className="p-2 rounded-md bg-[#0a4303] gap-2 w-full flex flex-col">
                                                            <p className="text-xs text-center text-gray-400 mb-1">Mapa da propriedade</p>

                                                            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                                                                {initialRegion ? (
                                                                    <LoadScript
                                                                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                                                                        libraries={['drawing']}
                                                                    >
                                                                        <GoogleMap
                                                                            mapContainerStyle={containerMapStyle}
                                                                            center={{ lat: initialRegion?.latitude, lng: initialRegion?.longitude }}
                                                                            zoom={15}
                                                                            mapTypeId="hybrid"
                                                                        >

                                                                            <Marker
                                                                                position={{ lat: initialRegion?.latitude, lng: initialRegion?.longitude }}
                                                                            />

                                                                        </GoogleMap>

                                                                    </LoadScript>
                                                                ) : (
                                                                    <ActivityIndicator size={60} />
                                                                )}
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
                                                {inspections.map(item => (
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
                                                ))}
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
                                                <h3 className="font-bold text-white">Certificado de contribuição</h3>
                                                <ContributeCertificate wallet={wallet} user={userData} />
                                            </div>

                                            <div className="w-full flex flex-col bg-[#0a4303] rounded-md p-3">
                                                <h3 className="font-bold text-white mb-1">Compromisso de redução</h3>
                                                {itemsToReduce.length === 0 && (
                                                    <p className="text-white text-center mt-4 mb-8">Este usuário não tem nenhum item na sua lista</p>
                                                )}
                                                <div className="flex flex-wrap gap-3">
                                                    {itemsToReduce.map(item => (
                                                        <Item
                                                            key={item?.id}
                                                            data={item}
                                                            type='demonstration'
                                                            userId={userData?.id}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {tabSelected === 'publis' && (
                                        <div className="mt-5 gap-5 flex flex-col items-center w-full">
                                            {publications.map(item => (
                                                <PublicationItem
                                                    data={item}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}