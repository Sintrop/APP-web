import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator/ActivityIndicator";
import { InsumoItem } from "./InsumoItem";
import { ZoneItem } from "./ZoneItem";
import { ImageItem } from "./ImageItem";
import { useNavigate } from "react-router";
import { FaDotCircle, FaMapMarker } from "react-icons/fa";
import format from "date-fns/format";
import { ViewImage } from "../../../components/ViewImage";
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import { compareAsc } from "date-fns";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from "react-i18next";

export function Inspection({ id }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inspectionData, setInspectionData] = useState({});
    const [inspectionDataApi, setInspectionDataApi] = useState({});
    const [producerData, setProducerData] = useState({});
    const [imageProfile, setImageProfile] = useState('');
    const [address, setAddress] = useState({});
    const [isaData, setIsaData] = useState({});
    const [biodiversity, setBiodiversity] = useState([]);
    const [zones, setZones] = useState([]);
    const [result, setResult] = useState({});
    const [insumos, setInsumos] = useState([]);
    const [inspectorData, setInspectorData] = useState(null);
    const [inspectorImageProfile, setInspectorImageProfile] = useState(null);
    const [proofPhoto, setProofPhoto] = useState(null);
    const [loadingBiodiversityImages, setLoadingBiodiversityImages] = useState(true);
    const [loadingImagesProperty, setLoadingImagesProperty] = useState(true);
    const [imagesProperty, setImagesProperty] = useState([]);
    const [imagesPropertyAerial, setImagesPropertyAerial] = useState([]);
    const [viewImage, setViewImage] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [biodiversityFauna, setBiodiversityFauna] = useState([]);
    const [biodiversityFlora, setBiodiversityFlora] = useState([]);
    const [oldMetodologie, setOldMetodologie] = useState(false);
    const [embedUrl, setEmbedUrl] = useState(null);
    const [mapZones, setMapZones] = useState(null);
    const [methodVersion, setMethodVersion] = useState(1.0);

    useEffect(() => {
        getInspectionData();
        if (id === '34' || id === '33' || id === '31' || id === '32' || id === '24' || id === '26' || id === '12' || id === '23' || id === '15' || id === '21' || id === '20') {
            setOldMetodologie(true);
        } else {
            setOldMetodologie(false);
        }
    }, []);

    async function getInspectionData() {
        let version = 1.0
        setLoading(true);

        const responseApi = await api.get(`/web3/inspection/${String(id)}`);

        if (compareAsc(new Date(responseApi?.data?.inspection?.inspectedAtTimestamp * 1000), new Date('2024-07-24 00:00:00')) === 1) {
            version = 1.2;
        } else {
            version = 1.0;
        }
        setMethodVersion(version);

        setInspectionData(responseApi.data?.inspection);
        setProducerData(responseApi.data?.userData);
        setInspectorData(responseApi.data?.inspectorData);
        setAddress(JSON.parse(responseApi.data?.userData?.address));
        setInspectionDataApi(responseApi.data?.inspectionApiData);
        setIsaData(responseApi.data?.isaData);
        getImages(responseApi.data?.userData?.imgProfileUrl, responseApi.data?.inspectorData?.imgProfileUrl, responseApi.data?.inspectionApiData?.proofPhoto);
        setResult(JSON.parse(responseApi.data?.inspectionApiData?.resultInspection).pdfData);
        setInsumos(JSON.parse(responseApi.data?.inspectionApiData.resultCategories));
        setLoading(false);

        const resZones = JSON.parse(responseApi.data?.inspectionApiData?.zones)
        setZones(resZones);
        setMapZones({ latitude: resZones[0].path[0].lat, longitude: resZones[0].path[0].lng });

        fixUrlEmbedYoutube(responseApi.data?.inspectionApiData?.urlVideo);

        if (responseApi?.data?.inspectionApiData?.propertyPhotos) {
            await getImagesProperty(JSON.parse(responseApi?.data?.inspectionApiData?.propertyPhotos));
        }

        if (version < 1.2) {
            await getImagesBiodiversity(JSON.parse(responseApi.data?.inspectionApiData?.biodversityIndice));
        }
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

    function fixUrlEmbedYoutube(url) {
        if (!url) {
            return;
        }

        const split = url.split('/');
        const idVideo = split[split.length - 1];
        const newUrl = `https://www.youtube.com/embed/${idVideo}`;
        setEmbedUrl(newUrl);
    }

    return (
        <div className="flex flex-col">
            {loading ? (
                <div className="flex justify-center">
                    <ActivityIndicator size={50} />
                </div>
            ) : (
                <>
                    {inspectionData?.status === 4 && (
                        <div className="flex items-center justify-center w-full h-20 bg-red-600 rounded-md">
                            <p className="font-bold text-white text-xl">{t('ispInvalidada')}</p>
                        </div>
                    )}
                    <h1 className="font-bold text-white mb-1">{t('resultadoIsp')} #{id}</h1>
                    <div className="flex flex-wrap justify-center p-3 gap-3 rounded-md bg-[#03364D] w-full">
                        <div className="flex flex-col lg:w-[49%]">
                            <p className="text-gray-400 text-xs">{t('produtor')}</p>
                            <button className="rounded-md flex gap-3 p-2 bg-[#012939] w-full" onClick={() => navigate(`/user-details/${producerData?.wallet}`)}>
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
                            <p className="text-gray-400 text-xs">{t('inspetor')}</p>
                            <button className="rounded-md flex gap-3 p-2 bg-[#012939] w-full" onClick={() => navigate(`/user-details/${inspectorData?.wallet}`)}>
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
                            <p className="text-gray-400 text-xs">{t('fotoProva')}</p>
                            <img
                                src={proofPhoto}
                                className="h-[300px] w-[200px] rounded-md object-cover"
                            />

                        </div>
                    </div>

                    <div className="flex flex-wrap items-center p-3 gap-3 rounded-md bg-[#03364D] w-full mt-3">
                        <div className="flex flex-col w-full lg:w-[49%] items-start gap-4">
                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    {t('criadaEm')}: {inspectionData?.createdAtTimestamp && format(new Date(Number(inspectionData?.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    {t('aceitaEm')}: {inspectionData?.acceptedAtTimestamp && format(new Date(Number(inspectionData?.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaDotCircle size={20} color='green' />

                                <p className="text-white">
                                    {t('realizadaEm')}: {inspectionData?.inspectedAtTimestamp && format(new Date(Number(inspectionData?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center p-2 bg-[#012939] border-2 border-white rounded-md">
                                <p className="font-bold text-white">{inspectionData?.isaScore}</p>
                                <p className="text-white text-xs">Pontos de regeneração</p>
                            </div>

                            <a
                                className="font-semibold text-white px-3 py-1 mt-1 bg-blue-500 rounded-md"
                                target="_blank"
                                href={`https://app.sintrop.com/view-pdf/${inspectionData?.report}`}
                            >
                                {t('verRelatorio')}
                            </a>
                        </div>

                        <div className="flex flex-col w-full lg:w-[49%] gap-1">
                            <div className="flex flex-col bg-[#012939] p-2 rounded-md">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/co2.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">{t('carbono')}</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number((isaData?.carbon?.indicator) / 1000).toFixed(1))} t</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.carbon?.isaIndex === 0 && t('regenerativo3')}
                                    {isaData?.carbon?.isaIndex === 1 && t('regenerativo2')}
                                    {isaData?.carbon?.isaIndex === 2 && t('regenerativo1')}
                                    {isaData?.carbon?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.carbon?.isaIndex === 4 && t('naoRegenerativo1')}
                                    {isaData?.carbon?.isaIndex === 5 && t('naoRegenerativo2')}
                                    {isaData?.carbon?.isaIndex === 6 && t('naoRegenerativo3')}
                                </p>
                            </div>

                            <div className="flex flex-col bg-[#012939] p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/solo.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">{t('solo')}</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.soil?.indicator).toFixed(0))} m²</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.soil?.isaIndex === 0 && t('regenerativo3')}
                                    {isaData?.soil?.isaIndex === 1 && t('regenerativo2')}
                                    {isaData?.soil?.isaIndex === 2 && t('regenerativo1')}
                                    {isaData?.soil?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.soil?.isaIndex === 4 && t('naoRegenerativo1')}
                                    {isaData?.soil?.isaIndex === 5 && t('naoRegenerativo2')}
                                    {isaData?.soil?.isaIndex === 6 && t('naoRegenerativo3')}
                                </p>
                            </div>

                            <div className="flex flex-col bg-[#012939] p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/agua.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">{t('agua')}</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.water?.indicator).toFixed(0))} m³</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.water?.isaIndex === 0 && t('regenerativo3')}
                                    {isaData?.water?.isaIndex === 1 && t('regenerativo2')}
                                    {isaData?.water?.isaIndex === 2 && t('regenerativo1')}
                                    {isaData?.water?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.water?.isaIndex === 4 && t('naoRegenerativo1')}
                                    {isaData?.water?.isaIndex === 5 && t('naoRegenerativo2')}
                                    {isaData?.water?.isaIndex === 6 && t('naoRegenerativo3')}
                                </p>
                            </div>

                            <div className="flex flex-col bg-[#012939] p-2 rounded-md mt-2">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={require('../../../assets/bio.png')}
                                            className="h-5 w-5 object-contain"
                                        />

                                        <p className="font-bold text-white text-sm">{t('bio')}</p>
                                    </div>

                                    <p className="font-bold text-white">{Intl.NumberFormat('pt-BR').format(Number(isaData?.bio?.indicator).toFixed(0))} uv</p>
                                </div>

                                <p className="text-xs text-white text-center">
                                    {isaData?.bio?.isaIndex === 0 && t('regenerativo3')}
                                    {isaData?.bio?.isaIndex === 1 && t('regenerativo2')}
                                    {isaData?.bio?.isaIndex === 2 && t('regenerativo1')}
                                    {isaData?.bio?.isaIndex === 3 && 'Neutro = 0 pts'}
                                    {isaData?.bio?.isaIndex === 4 && t('naoRegenerativo1')}
                                    {isaData?.bio?.isaIndex === 5 && t('naoRegenerativo2')}
                                    {isaData?.bio?.isaIndex === 6 && t('naoRegenerativo3')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-[#03364D] mt-3 p-2 rounded-md">
                        <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                            {mapZones && (
                                <>
                                    <ReactMapGL
                                        style={{ width: '100%', height: '100%' }}
                                        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                                        latitude={mapZones?.latitude}
                                        longitude={mapZones?.longitude}
                                        onDrag={(e) => {
                                            setMapZones({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                                        }}
                                        minZoom={14}
                                        maxZoom={20}
                                    >
                                        {zones.map((item, index) => (
                                            <>

                                                {item.analiseSolo.map((analise, index) => (
                                                    <Marker
                                                        key={analise?.coord?.lng}
                                                        latitude={analise?.coord?.lat}
                                                        longitude={analise?.coord?.lng}
                                                        color="#ff4af9"
                                                    />
                                                ))}

                                                {item.arvores.sampling1.trees.map(tree => (
                                                    <Marker
                                                        key={tree.lat}
                                                        latitude={tree.lat}
                                                        longitude={tree.lng}
                                                        color="green"
                                                    />
                                                ))}
                                            </>
                                        ))}
                                    </ReactMapGL>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='#ff4af9' size={20} />
                            <p className="text-white text-xs">{t('analiseBiomassa')}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='green' size={20} />
                            <p className="text-white text-xs">{t('plantasRegistradas')}</p>
                        </div>
                    </div>

                    {inspectionDataApi?.propertyPhotos && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#03364D] w-full mt-3">
                            <p className="text-white font-bold text-lg">{t('imgsPropriedade')}</p>
                            {inspectionDataApi?.propertyPhotos && (
                                <>
                                    {loadingImagesProperty ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">{t('carregandoImgs')}</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 overflow-auto mt-3">
                                            {imagesProperty.length === 0 ? (
                                                <>
                                                    <p className="text-white my-5">{t('nenhumaImg')}</p>
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

                            <p className="text-white mt-3">{t('imgsAereas')}</p>
                            {loadingImagesProperty ? (
                                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                    <ActivityIndicator size={50} />
                                    <p className="text-white mt-1">{t('carregandoImgs')}</p>
                                </div>
                            ) : (
                                <div className="flex gap-3 overflow-auto mt-1">
                                    {imagesPropertyAerial.length === 0 ? (
                                        <>
                                            <p className="text-white my-5">{t('nenhumaImg')}</p>
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

                            {embedUrl && (
                                <div className="flex justify-center">
                                    <iframe
                                        width="560"
                                        height="315"
                                        src={embedUrl}
                                        title="YouTube video player"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    )}

                    {methodVersion < 1.2 && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#03364D] w-full mt-3">
                            <p className="text-white font-bold text-lg">{t('bioRegistrada')}</p>

                            {/* Depois das inspeções id 35 tivemos alteração na estrtura da biodiversidade */}
                            {!oldMetodologie ? (
                                <>
                                    <p className="text-white">{t('fauna')}</p>
                                    {loadingBiodiversityImages ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">{t('carregandoImgs')}</p>
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

                                    <p className="text-white mt-3">{t('flora')}</p>
                                    {loadingBiodiversityImages ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">{t('carregandoImgs')}</p>
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
                                    <p className="text-white mt-3">{t('imgs')}</p>
                                    {loadingBiodiversityImages ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">{t('carregandoImgs')}</p>
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
                    )}

                    {zones.length > 0 && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#03364D] w-full mt-3">
                            <p className="text-white font-bold text-lg">{t('zonasDeRegeneracao')}</p>
                            {zones.map((item, index) => (
                                <ZoneItem data={item} index={index} />
                            ))}

                            <p className="text-white font-bold text-lg">{t('resultadoZonas')}</p>

                            <div className="flex gap-2 flex-wrap items-center flex-col lg:flex-row">
                                <div className="flex items-center justify-between p-2 rounded-md border w-full lg:w-[49%]">
                                    <div className="flex flex-col gap-1 h-[110px]">
                                        <p className="text-white font-bold">{t('arvores')}</p>
                                        <p className="text-white">{t('totalEstimado')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.estimatedTreesTotal))}</span></p>
                                        <p className="text-white">{t('co2estocado')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.totalCarbonEstocadoZones).toFixed(1))}</span> t</p>
                                        <p className="text-white">{t('aguaEstocada')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(result?.totalAguaEstocadaZones).toFixed(2))}</span> m³</p>
                                    </div>

                                    <img
                                        src={require('../../../assets/arvore.png')}
                                        className="w-14 h-16 object-contain"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-md border w-full lg:w-[49%]">
                                    <div className="flex flex-col gap-1 h-[110px]">
                                        <p className="text-white font-bold">{t('biomassa')}</p>
                                        <p className="text-white">{t('biomassaSolo')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Math.abs(result?.saldoCarbonAnaliseSoloZones))}</span> kg</p>

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
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#03364D] w-full mt-3">
                            <div className="mt-2 flex flex-col">
                                <p className="text-white font-bold text-lg">{t('insumosRegistrados')}</p>

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