import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { InsumoItem } from "./InsumoItem";
import { PolylineItemZone } from "./PolylineItemZone";
import { ZoneItem } from "./ZoneItem";
import { ImageItem } from "./ImageItem";
import { useNavigate } from "react-router";
import { FaDotCircle, FaMapMarker } from "react-icons/fa";
import format from "date-fns/format";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { ViewImage } from "../../../components/ViewImage";

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

const markerSolo = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 1,
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    strokeColor: '#fff'
};

const markerTree = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "green",
    fillOpacity: 1,
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    strokeColor: '#fff'
};

const markerBioSoil = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "yellow",
    fillOpacity: 1,
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    strokeColor: '#fff'
};

export function Inspection({ id }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inspectionData, setInspectionData] = useState({});
    const [inspectionDataApi, setInspectionDataApi] = useState({});
    const [producerData, setProducerData] = useState({});
    const [imageProfile, setImageProfile] = useState('');
    const [address, setAddress] = useState({});
    const [isaData, setIsaData] = useState({});
    const [biodiversity, setBiodiversity] = useState([]);
    const [biodiversitySoil, setBiodiversitySoil] = useState([]);
    const [zones, setZones] = useState([]);
    const [result, setResult] = useState({});
    const [insumos, setInsumos] = useState([]);
    const [inspectorData, setInspectorData] = useState(null);
    const [inspectorImageProfile, setInspectorImageProfile] = useState(null);
    const [proofPhoto, setProofPhoto] = useState(null);
    const [loadingBiodiversityImages, setLoadingBiodiversityImages] = useState(true);
    const [loadingBiodiversitySoil, setLoadingBiodiversitySoil] = useState(true);
    const [loadingImagesProperty, setLoadingImagesProperty] = useState(true);
    const [imagesProperty, setImagesProperty] = useState([]);
    const [imagesPropertyAerial, setImagesPropertyAerial] = useState([]);
    const [viewImage, setViewImage] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [biodiversityFauna, setBiodiversityFauna] = useState([]);
    const [biodiversityFlora, setBiodiversityFlora] = useState([]);
    const [oldMetodologie, setOldMetodologie] = useState(false);

    useEffect(() => {
        getInspectionData();
        if (id === '34' || id === '33' || id === '31' || id === '32' || id === '24' || id === '26' || id === '12' || id === '23' || id === '15' || id === '21' || id === '20') {
            setOldMetodologie(true);
        } else {
            setOldMetodologie(false);
        }
    }, []);

    async function getInspectionData() {
        setLoading(true);

        const responseApi = await api.get(`/web3/inspection/${String(id)}`);
        setInspectionData(responseApi.data?.inspection);
        setProducerData(responseApi.data?.userData);
        setInspectorData(responseApi.data?.inspectorData);
        setAddress(JSON.parse(responseApi.data?.userData?.address));
        setInspectionDataApi(responseApi.data?.inspectionApiData);
        setIsaData(responseApi.data?.isaData);
        getImages(responseApi.data?.userData?.imgProfileUrl, responseApi.data?.inspectorData?.imgProfileUrl, responseApi.data?.inspectionApiData?.proofPhoto);
        setZones(JSON.parse(responseApi.data?.inspectionApiData?.zones));
        setResult(JSON.parse(responseApi.data?.inspectionApiData?.resultInspection).pdfData);
        setInsumos(JSON.parse(responseApi.data?.inspectionApiData.resultCategories));
        setLoading(false);

        if (responseApi?.data?.inspectionApiData?.propertyPhotos) {
            await getImagesProperty(JSON.parse(responseApi?.data?.inspectionApiData?.propertyPhotos));
        }
        await getImagesBiodiversity(JSON.parse(responseApi.data?.inspectionApiData?.biodversityIndice));
    }

    async function getImages(producer, inspector, proofPhoto) {
        const responseProducer = await getImage(producer);
        setImageProfile(responseProducer);

        const responseInspector = await getImage(inspector);
        setInspectorImageProfile(responseInspector);

        const responseProofPhoto = await getImage(proofPhoto);
        setProofPhoto(responseProofPhoto);
    }

    async function getImagesBiodiversity(array) {
        setLoadingBiodiversityImages(true);

        let newArrayFauna = [];
        let newArrayFlora = [];
        let bioAnyType = [];

        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo);
            if (array[i].type === 'fauna') {
                newArrayFauna.push(response);
            }

            if (array[i].type === 'flora') {
                newArrayFlora.push(response);
            }

            if (id === '34' || id === '33' || id === '31' || id === '32' || id === '24' || id === '26' || id === '12' || id === '23' || id === '15' || id === '21' || id === '20') {
                bioAnyType.push(response);
            }
        }

        setBiodiversityFlora(newArrayFlora);
        setBiodiversityFauna(newArrayFauna);
        setBiodiversity(bioAnyType);
        setLoadingBiodiversityImages(false)
    }

    async function getImagesProperty(array) {
        setLoadingImagesProperty(true);

        let newArray = [];
        let newArrayAerial = [];

        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo);
            if (array[i].type === 'normal') {
                newArray.push({
                    ...array[i],
                    photo: response,
                });
            }

            if (array[i].type === 'aerial') {
                newArrayAerial.push({
                    ...array[i],
                    photo: response,
                });
            }

            if (id === '34' || id === '33' || id === '31' || id === '32' || id === '24' || id === '26' || id === '12' || id === '23' || id === '15' || id === '21' || id === '20') {
                newArray.push({
                    ...array[i],
                    photo: response,
                });
            }
        }

        setImagesProperty(newArray);
        setImagesPropertyAerial(newArrayAerial);
        setLoadingImagesProperty(false)
    }

    return (
        <div className="flex flex-col">
            {loading ? (
                <div className="flex justify-center">
                    <ActivityIndicator size={50} />
                </div>
            ) : (
                <>
                    <h1 className="font-bold text-white mb-1">Resultado da inspeção #{id}</h1>
                    <div className="flex flex-wrap justify-center p-3 gap-3 rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col lg:w-[49%]">
                            <p className="text-gray-400 text-xs">Produtor(a)</p>
                            <button className="rounded-md flex gap-3 p-2 bg-green-950 w-full" onClick={() => navigate(`/user-details/${producerData?.wallet}`)}>
                                <div className="h-14 w-14 rounded-full bg-gray-400">
                                    <img
                                        src={imageProfile}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-1 items-start">
                                    <p className="font-bold text-white text-sm">{producerData?.name}</p>
                                    <p className="text-white text-sm text-ellipsis overflow-hidden max-w-[25ch] lg:max-w-[100ch]">{String(producerData?.wallet).toLowerCase()}</p>
                                </div>
                            </button>
                        </div>

                        <div className="flex flex-col lg:w-[49%]">
                            <p className="text-gray-400 text-xs">Inspetor(a)</p>
                            <button className="rounded-md flex gap-3 p-2 bg-green-950 w-full" onClick={() => navigate(`/user-details/${inspectorData?.wallet}`)}>
                                <div className="h-14 w-14 rounded-full bg-gray-400">
                                    <img
                                        src={inspectorImageProfile}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-1 items-start">
                                    <p className="font-bold text-white text-sm">{inspectorData?.name}</p>
                                    <p className="text-white text-sm text-ellipsis overflow-hidden max-w-[25ch] lg:max-w-[100ch]">{String(inspectorData?.wallet).toLowerCase()}</p>
                                </div>
                            </button>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-gray-400 text-xs">Foto de prova</p>
                            <img
                                src={proofPhoto}
                                className="h-[300px] w-[200px] rounded-md object-cover"
                            />

                        </div>
                    </div>

                    <div className="flex flex-wrap items-center p-3 gap-3 rounded-md bg-[#0a4303] w-full mt-3">
                        <div className="flex flex-col w-full lg:w-[49%] items-start gap-4">
                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    Criada em: {inspectionData?.createdAtTimestamp && format(new Date(Number(inspectionData?.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    Aceita em: {inspectionData?.acceptedAtTimestamp && format(new Date(Number(inspectionData?.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    Realizada em: {inspectionData?.inspectedAtTimestamp && format(new Date(Number(inspectionData?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center p-2 bg-green-950 border-2 border-white rounded-md">
                                <p className="font-bold text-white">{inspectionData?.isaScore}</p>
                                <p className="text-white text-xs">Pontos de regeneração</p>
                            </div>

                            <a
                                className="font-semibold text-white px-3 py-1 mt-1 bg-blue-500 rounded-md"
                                target="_blank"
                                href={`https://app.sintrop.com/view-pdf/${inspectionData?.report}`}
                            >
                                Ver relatório
                            </a>
                        </div>

                        <div className="flex flex-col w-full lg:w-[49%] gap-1">
                            <div className="flex flex-col bg-green-950 p-2 rounded-md">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/co2.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">Carbono</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number((isaData?.carbon?.indicator) / 1000).toFixed(1))} t</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.carbon?.isaIndex === 0 && 'Regenerativo 3 = +25 pts'}
                                    {isaData?.carbon?.isaIndex === 1 && 'Regenerativo 2 = +10 pts'}
                                    {isaData?.carbon?.isaIndex === 2 && 'Regenerativo 1 = +1 pts'}
                                    {isaData?.carbon?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.carbon?.isaIndex === 4 && 'Não Regenerativo 1 = -1 pts'}
                                    {isaData?.carbon?.isaIndex === 5 && 'Não Regenerativo 2 = -10 pts'}
                                    {isaData?.carbon?.isaIndex === 6 && 'Não Regenerativo 3 = -25 pts'}
                                </p>
                            </div>

                            <div className="flex flex-col bg-green-950 p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/solo.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">Solo</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.soil?.indicator).toFixed(0))} m²</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.soil?.isaIndex === 0 && 'Regenerativo 3 = +25 pts'}
                                    {isaData?.soil?.isaIndex === 1 && 'Regenerativo 2 = +10 pts'}
                                    {isaData?.soil?.isaIndex === 2 && 'Regenerativo 1 = +1 pts'}
                                    {isaData?.soil?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.soil?.isaIndex === 4 && 'Não Regenerativo 1 = -1 pts'}
                                    {isaData?.soil?.isaIndex === 5 && 'Não Regenerativo 2 = -10 pts'}
                                    {isaData?.soil?.isaIndex === 6 && 'Não Regenerativo 3 = -25 pts'}
                                </p>
                            </div>

                            <div className="flex flex-col bg-green-950 p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/agua.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">Água</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.water?.indicator).toFixed(0))} m³</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.water?.isaIndex === 0 && 'Regenerativo 3 = +25 pts'}
                                    {isaData?.water?.isaIndex === 1 && 'Regenerativo 2 = +10 pts'}
                                    {isaData?.water?.isaIndex === 2 && 'Regenerativo 1 = +1 pts'}
                                    {isaData?.water?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.water?.isaIndex === 4 && 'Não Regenerativo 1 = -1 pts'}
                                    {isaData?.water?.isaIndex === 5 && 'Não Regenerativo 2 = -10 pts'}
                                    {isaData?.water?.isaIndex === 6 && 'Não Regenerativo 3 = -25 pts'}
                                </p>
                            </div>

                            <div className="flex flex-col bg-green-950 p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/bio.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">Biodiversidade</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.bio?.indicator).toFixed(0))} uv</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.bio?.isaIndex === 0 && 'Regenerativo 3 = +25 pts'}
                                    {isaData?.bio?.isaIndex === 1 && 'Regenerativo 2 = +10 pts'}
                                    {isaData?.bio?.isaIndex === 2 && 'Regenerativo 1 = +1 pts'}
                                    {isaData?.bio?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.bio?.isaIndex === 4 && 'Não Regenerativo 1 = -1 pts'}
                                    {isaData?.bio?.isaIndex === 5 && 'Não Regenerativo 2 = -10 pts'}
                                    {isaData?.bio?.isaIndex === 6 && 'Não Regenerativo 3 = -25 pts'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-[#0a4303] mt-3 p-2 rounded-md">
                        <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                            {zones.length > 0 && (
                                <LoadScript
                                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                                    libraries={['drawing']}
                                >
                                    <GoogleMap
                                        mapContainerStyle={containerMapStyle}
                                        center={{ lat: zones[0]?.path[0]?.lat, lng: zones[0]?.path[0]?.lng }}
                                        zoom={16}
                                        mapTypeId="hybrid"
                                    >
                                        {zones.map((item, index) => (
                                            <>
                                                <PolylineItemZone
                                                    data={item.path}
                                                    index={index}
                                                />

                                                {item.analiseSolo.map((analise, index) => (
                                                    <Marker
                                                        position={{ lat: analise?.coord?.lat, lng: analise?.coord?.lng }}
                                                        icon={markerSolo}
                                                    />
                                                ))}

                                                {item.arvores.sampling1.trees.map(tree => (
                                                    <Marker
                                                        position={{ lat: tree.lat, lng: tree.lng }}
                                                        icon={markerTree}
                                                    />
                                                ))}

                                                {biodiversitySoil.map(bioSoil => (
                                                    <Marker
                                                        position={{ lat: bioSoil?.coord?.lat, lng: bioSoil?.coord?.lng }}
                                                        icon={markerBioSoil}
                                                    />
                                                ))}
                                            </>
                                        ))}
                                    </GoogleMap>
                                </LoadScript>
                            )}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='blue' size={20} />
                            <p className="text-white text-xs">Análises de solo</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='green' size={20} />
                            <p className="text-white text-xs">Plantas registradas</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='yellow' size={20} />
                            <p className="text-white text-xs">Biodiversidade no solo</p>
                        </div>
                    </div>

                    {inspectionDataApi?.propertyPhotos && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                            <p className="text-white font-bold text-lg">Imagens da propriedade</p>
                            {inspectionDataApi?.propertyPhotos && (
                                <>
                                    {loadingImagesProperty ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 overflow-auto mt-3">
                                            {imagesProperty.length === 0 ? (
                                                <>
                                                    <p className="text-white my-5">Nenhuma imagem registrada</p>
                                                </>
                                            ) : (
                                                <>
                                                    {imagesProperty.map(item => (
                                                        <button
                                                            key={item}
                                                            className="w-[250px] h-[300px]"
                                                            onClick={() => {
                                                                setImageSelected(item.photo);
                                                                setViewImage(true);
                                                            }}
                                                        >
                                                            <ImageItem
                                                                src={item}
                                                                type='photos-zone'
                                                            />
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <p className="text-white mt-3">Imagens aéreas</p>
                            {loadingImagesProperty ? (
                                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                    <ActivityIndicator size={50} />
                                    <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                </div>
                            ) : (
                                <div className="flex gap-3 overflow-auto mt-1">
                                    {imagesPropertyAerial.length === 0 ? (
                                        <>
                                            <p className="text-white my-5">Nenhuma imagem registrada</p>
                                        </>
                                    ) : (
                                        <>
                                            {imagesPropertyAerial.map(item => (
                                                <button
                                                    key={item}
                                                    className="w-[250px] h-[300px]"
                                                    onClick={() => {
                                                        setImageSelected(item.photo);
                                                        setViewImage(true);
                                                    }}
                                                >
                                                    <ImageItem
                                                        src={item}
                                                        type='photos-zone'
                                                    />
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}

                            {inspectionDataApi?.urlVideo && (
                                <div className="flex justify-center">
                                    <iframe
                                        width="560"
                                        height="315"
                                        src={inspectionDataApi?.urlVideo}
                                        title="YouTube video player"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                        <p className="text-white font-bold text-lg">Biodiversidade registrada</p>

                        {/* Depois das inspeções id 35 tivemos alteração na estrtura da biodiversidade */}
                        {!oldMetodologie ? (
                            <>
                                <p className="text-white">Fauna</p>
                                {loadingBiodiversityImages ? (
                                    <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                        <ActivityIndicator size={50} />
                                        <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 overflow-auto">
                                        {biodiversityFauna.map(item => (
                                            <button
                                                key={item}
                                                className="w-[250px] h-[300px]"
                                                onClick={() => {
                                                    setImageSelected(item);
                                                    setViewImage(true);
                                                }}
                                            >
                                                <ImageItem
                                                    src={item}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <p className="text-white mt-3">Flora</p>
                                {loadingBiodiversityImages ? (
                                    <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                        <ActivityIndicator size={50} />
                                        <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 overflow-auto">
                                        {biodiversityFlora.map(item => (
                                            <button
                                                key={item}
                                                className="w-[250px] h-[300px]"
                                                onClick={() => {
                                                    setImageSelected(item);
                                                    setViewImage(true);
                                                }}
                                            >
                                                <ImageItem
                                                    src={item}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-white mt-3">Imagens</p>
                                {loadingBiodiversityImages ? (
                                    <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                        <ActivityIndicator size={50} />
                                        <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 overflow-auto">
                                        {biodiversity.map(item => (
                                            <button
                                                key={item}
                                                className="w-[250px] h-[300px]"
                                                onClick={() => {
                                                    setImageSelected(item);
                                                    setViewImage(true);
                                                }}
                                            >
                                                <ImageItem
                                                    src={item}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {zones.length > 0 && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                            <div className="p-2 rounded-md bg-[#0a4303] gap-2 w-full flex flex-col">
                                <p className="text-white font-bold text-lg">Zonas de regeneração</p>

                                <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                                    {zones.length > 0 && (
                                        <LoadScript
                                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                                            libraries={['drawing']}
                                        >
                                            <GoogleMap
                                                mapContainerStyle={containerMapStyle}
                                                center={{ lat: zones[0]?.path[0]?.lat, lng: zones[0]?.path[0]?.lng }}
                                                zoom={16}
                                                mapTypeId="hybrid"
                                            >
                                                {zones.map((item, index) => (
                                                    <>
                                                        <PolylineItemZone
                                                            data={item.path}
                                                            index={index}
                                                        />
                                                    </>
                                                ))}


                                            </GoogleMap>

                                        </LoadScript>
                                    )}
                                </div>
                            </div>

                            <p className="text-white mt-3">Detalhes das zonas</p>
                            {zones.map((item, index) => (
                                <ZoneItem data={item} index={index} />
                            ))}

                            <p className="text-white font-bold text-lg">Resultado das zonas</p>

                            <div className="flex gap-2 flex-wrap items-center flex-col lg:flex-row">
                                <div className="flex items-center justify-between p-2 rounded-md border w-full lg:w-[49%]">
                                    <div className="flex flex-col gap-1 h-[110px]">
                                        <p className="text-white font-bold">Árvores</p>
                                        <p className="text-white">Total estimado: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.estimatedTreesTotal))}</span></p>
                                        <p className="text-white">CO² estocado: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.totalCarbonEstocadoZones).toFixed(1))}</span> t</p>
                                        <p className="text-white">Água estocada: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.totalAguaEstocadaZones).toFixed(2))}</span> m³</p>
                                    </div>

                                    <img
                                        src={require('../../../assets/arvore.png')}
                                        className="w-14 h-16 object-contain"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-md border w-full lg:w-[49%]">
                                    <div className="flex flex-col gap-1 h-[110px]">
                                        <p className="text-white font-bold">Biomassa</p>
                                        <p className="text-white">Biomassa no solo: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Math.abs(result?.saldoCarbonAnaliseSoloZones))}</span> kg</p>

                                    </div>

                                    <img
                                        src={require('../../../assets/fertilizante-orgânico.png')}
                                        className="w-14 h-16 object-contain"
                                    />
                                </div>
                            </div>


                        </div>
                    )}

                    {insumos.length > 0 && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                            <div className="mt-2 flex flex-col">
                                <p className="text-white font-bold text-lg">Insumos registrados</p>

                                <div className="flex flex-col mt-2">
                                    {insumos.map(item => (
                                        <InsumoItem
                                            key={item?.id}
                                            data={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }

            {
                viewImage && (
                    <ViewImage
                        close={() => {
                            setViewImage(false);
                            setImageSelected('');
                        }}
                        uri={imageSelected}
                    />
                )
            }
        </div >
    )
}