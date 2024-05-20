import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { useMainContext } from "../../hooks/useMainContext";
import { FaUser, FaListAlt, FaList, FaChevronRight, FaQrcode } from "react-icons/fa";
import { getImage } from "../../services/getImage";
import { TopBar } from '../../components/TopBar';
import { ProducerCertificate } from '../../components/Certificates/ProducerCertificate';
import { ContributeCertificate } from '../../components/Certificates/ContributeCertificate';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdLogout } from "react-icons/md";
import { ModalLogout } from '../Home/components/ModalLogout';
import { Item } from "../ImpactCalculator/components/Item";
import { ModalEditProfile } from "./components/ModalEditProfile";

export function Profile() {
    const navigate = useNavigate();
    const { userData, walletConnected, blockchainData } = useMainContext();
    const [imageProfile, setImageProfile] = useState(null);
    const [tabSelected, setTabSelected] = useState('certificates');
    const [loading, setLoading] = useState(false);
    const [proofPhoto, setProofPhoto] = useState('');
    const [pathProperty, setPathProperty] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [modalLogout, setModalLogout] = useState(false);
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [editProfile, setEditProfile] = useState(false);

    useEffect(() => {
        if (userData) {
            getImageProfile(userData?.imgProfileUrl);
        }

        if (userData?.itemsToReduce) {
            setItemsToReduce(JSON.parse(userData?.itemsToReduce));
        }
    }, [userData]);

    useEffect(() => {
        if (blockchainData) {
            getProofPhoto(blockchainData?.proofPhoto);
        }
    }, [blockchainData]);

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

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 px-2 lg:px-0">
                    {loading ? (
                        <div className="flex justify-center h-[90vh]">
                            <ActivityIndicator size={180} />
                        </div>
                    ) : (
                        <>
                            {userData ? (
                                <>
                                    <p className="font-bold text-white">Seu perfil</p>
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

                                            <p className="font-bold text-white mt-3">{userData?.name}</p>
                                            <p className="text-gray-300">
                                                {userData?.userType === 1 && 'Produtor(a)'}
                                                {userData?.userType === 2 && 'Inspetor(a)'}
                                                {userData?.userType === 3 && 'Pesquisador(a)'}
                                                {userData?.userType === 4 && 'Desenvolvedor(a)'}
                                                {userData?.userType === 5 && 'Contribuidor(a)'}
                                                {userData?.userType === 6 && 'Ativista'}
                                                {userData?.userType === 7 && 'Apoiador(a)'}
                                                {userData?.userType === 8 && 'Validador(a)'}
                                            </p>
                                            <div className="p-1 bg-[#0a4303] border-2 border-green-500 rounded-md w-fit mt-1">
                                                <p className="text-white text-xs lg:text-base">Wallet: {walletConnected}</p>
                                            </div>

                                            <div className="flex gap-3 mt-2 ">
                                                <button
                                                    className="flex items-center gap-2 text-white font-semibold text-sm p-1 border rounded-md w-fit"
                                                    onClick={() => setEditProfile(true)}
                                                >
                                                    <MdEdit size={20} color='white' />
                                                    Editar perfil
                                                </button>

                                                <button
                                                    className="flex items-center gap-2 text-[#ff0000] font-semibold text-sm p-1 border rounded-md w-fit"
                                                    onClick={() => setModalLogout(true)}
                                                >
                                                    <MdLogout size={20} color='#ff0000' />
                                                    Desconectar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-2 overflow-x-auto">
                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('certificates')}
                                        >
                                            <FaQrcode size={18} color={tabSelected === 'certificates' ? 'green' : 'white'} />
                                            Certificados
                                        </button>

                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('data')}
                                        >
                                            <FaUser size={18} color={tabSelected === 'data' ? 'green' : 'white'} />
                                            Dados
                                        </button>

                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('publis')}
                                        >
                                            <FaListAlt size={18} color={tabSelected === 'publis' ? 'green' : 'white'} />
                                            Publicações
                                        </button>

                                        {userData?.userType === 1 && (
                                            <button
                                                className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}

                                        {userData?.userType === 2 && (
                                            <button
                                                className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}
                                    </div>

                                    {tabSelected === 'data' && (
                                        <>
                                            <div className="flex items-center flex-col gap-4 mt-2">
                                                <div className="p-2 rounded-md flex flex-col bg-[#0a4303] gap-2 w-full lg:flex-row">
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
                                                        <p className="text-white font-bold text-sm">Entrou na comunidade em: <span className="font-normal">{format(new Date(userData?.createdAt), 'dd/MM/yyyy')}</span></p>

                                                        {userData?.userType === 1 && (
                                                            <>
                                                                <p className="text-white font-bold text-sm">Área da propriedade:
                                                                    <span className="font-normal"> {Intl.NumberFormat('pt-BR').format(Number(blockchainData?.producer?.certifiedArea).toFixed(0))} m²</span>
                                                                </p>
                                                                <p className="text-white font-bold text-sm">Total de inspeções: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-sm">Score de regeneração: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                                                                <p className="text-white font-bold text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.producer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.producer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.producer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 2 && (
                                                            <>
                                                                <p className="text-white font-bold text-sm">Total de inspeções: <span className="font-normal">{blockchainData?.inspector?.totalInspections}</span></p>
                                                                <p className="text-white font-bold text-sm">Desistências: <span className="font-normal">{blockchainData?.inspector?.giveUps}</span></p>
                                                                <p className="text-white font-bold text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.inspector?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.inspector?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.inspector?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 3 && (
                                                            <>
                                                                <p className="text-white font-bold text-sm">Pesquisas publicadas: <span className="font-normal">{blockchainData?.researcher?.publishedWorks}</span></p>
                                                                <p className="text-white font-bold text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.researcher?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.researcher?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.researcher?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 4 && (
                                                            <>
                                                                <p className="text-white font-bold text-sm">Nível: <span className="font-normal">{blockchainData?.developer?.pool?.level}</span></p>
                                                                <p className="text-white font-bold text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.developer?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.developer?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.developer?.userType}</span></p>
                                                            </>
                                                        )}

                                                        {userData?.userType === 6 && (
                                                            <>
                                                                <p className="text-white font-bold text-sm">Convidado por: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                <p className="text-white font-bold text-sm">ERA atual na pool: <span className="font-normal">{blockchainData?.activist?.pool?.currentEra}</span></p>
                                                                <p className="text-white font-bold text-sm">Hash da foto de prova: <span className="font-normal">{blockchainData?.activist?.proofPhoto}</span></p>
                                                                <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.activist?.userType}</span></p>
                                                            </>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* {userData?.userType === 1 && (
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
                                                )} */}
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
                                                            <p className="font-bold text-white text-sm">Inspeção #{item.id}</p>
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
                                                        certificateType='long'
                                                        userData={userData}
                                                        blockchainData={blockchainData}
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
                                                <ContributeCertificate wallet={walletConnected} user={userData} />
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
                                </>
                            ) : (
                                <>
                                    <p className="font-bold text-white text-center">Você não está conectado</p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {modalLogout && (
                <ModalLogout
                    close={() => setModalLogout(false)}
                />
            )}

            {editProfile && (
                <ModalEditProfile
                    close={() => setEditProfile(false)}
                    imageProfile={imageProfile}
                />
            )}
        </div>
    );
}