import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { InsumoItem } from "./InsumoItem";
import { PolylineItemZone } from "./PolylineItemZone";
import { ZoneItem } from "./ZoneItem";
import { ImageItem } from "./ImageItem";
import { useNavigate } from "react-router";
import { FaDotCircle } from "react-icons/fa";
import format from "date-fns/format";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerMapStyle = {
    width: '100%',
    height: '300px',
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

    useEffect(() => {
        getInspectionData();
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

        if(responseApi?.data?.inspectionApiData?.propertyPhotos){
            await getImagesProperty(JSON.parse(responseApi?.data?.inspectionApiData?.propertyPhotos));
        }
        await getImagesBiodiversitySoil(JSON.parse(responseApi.data?.inspectionApiData?.soilBiodiversity));
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
        let newArray = [];
        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo);
            newArray.push(response);
        }

        setBiodiversity(newArray);
        setLoadingBiodiversityImages(false)
    }

    async function getImagesBiodiversitySoil(array) {
        setLoadingBiodiversitySoil(true);

        let newArray = [];
        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo);
            newArray.push({
                ...array[i],
                photo: response,
            });
        }

        setBiodiversitySoil(newArray);
        setLoadingBiodiversitySoil(false)
    }

    async function getImagesProperty(array) {
        setLoadingImagesProperty(true);

        let newArray = [];
        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo);
            newArray.push({
                ...array[i],
                photo: response,
            });
        }

        setImagesProperty(newArray);
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

                    {inspectionDataApi?.urlVideo && inspectionDataApi?.propertyPhotos && (
                        <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                            <p className="text-white font-bold text-lg">Imagens da propriedade</p>

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

                            {inspectionDataApi?.propertyPhotos && (
                                <>
                                    {loadingImagesProperty ? (
                                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                            <ActivityIndicator size={50} />
                                            <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 overflow-auto mt-3">
                                            {imagesProperty.map(item => (
                                                <div key={item} className="w-[250px] h-[300px]">
                                                    <ImageItem
                                                        src={item}
                                                        type='photos-zone'
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-1 p-2 rounded-md bg-[#0a4303] w-full mt-3">
                        <p className="text-white font-bold text-lg">Biodiversidade registrada</p>
                        <p className="text-white">Imagens</p>

                        {loadingBiodiversityImages ? (
                            <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                <ActivityIndicator size={50} />
                                <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-auto">
                                {biodiversity.map(item => (
                                    <div key={item} className="w-[250px] h-[300px]">
                                        <ImageItem
                                            src={item}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-white mt-3">Solo</p>

                        {loadingBiodiversitySoil ? (
                            <div className="flex flex-col items-center justify-center w-full h-[315px]">
                                <ActivityIndicator size={50} />
                                <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-auto">
                                {biodiversitySoil.map(item => (
                                    <div key={item} className="w-[250px] h-[300px]">
                                        <ImageItem
                                            src={item}
                                            type='biodiversity-soil'
                                        />
                                    </div>
                                ))}
                            </div>
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
                                                zoom={15}
                                                mapTypeId="hybrid"
                                            >
                                                {zones.map((item, index) => (
                                                    <PolylineItemZone
                                                        data={item.path}
                                                        index={index}
                                                    />
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
            )}
        </div>
    )
}