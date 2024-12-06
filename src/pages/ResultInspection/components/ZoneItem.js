import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator/ActivityIndicator";
import { ImageItem } from "./ImageItem";
import { ViewImage } from "../../../components/ViewImage";
import { FaMapMarker } from "react-icons/fa";
import { ModalCollectDetails } from "./ModalCollectDetails";
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Polyline } from "../../../components/Mapbox/Polyline";
import { useTranslation } from "react-i18next";

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

export function ZoneItem({ data, index }) {
    const {t} = useTranslation();
    const treesS1 = Number(data?.arvores?.sampling1?.trees?.length);
    const areaSampling1 = Number(data?.arvores?.sampling1?.area);
    const areaZone = Number(data?.areaZone);
    const analiseSolo = data?.analiseSolo;
    const bioSoil = data?.bioSoil;
    const photosZone = data?.photosZone;
    const analiseBio = data?.analiseBio;

    const [imagesZones, setImagesZones] = useState([]);
    const [imagesAnaliseSoil, setImagesAnaliseSoil] = useState([]);
    const [imagesBioSoil, setImagesBioSoil] = useState([]);
    const [imagesBioZone, setImagesBioZone] = useState([]);
    const [imagesTreesS1, setImagesTressS1] = useState([]);
    const [loadingImagesZones, setLoadingImageZones] = useState(true);
    const [loadingImagesAnalise, setLoadingImageAnalise] = useState(true);
    const [loadingImagesBioSoil, setLoadingImageBioSoil] = useState(true);
    const [loadingImagesBioZone, setLoadingImageBioZone] = useState(true);
    const [loadingImagesTreesS1, setLoadingImagesTreesS1] = useState(true);
    const [viewImage, setViewImage] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [collectDetails, setCollectDetails] = useState(false);
    const [collectSelected, setCollectSelected] = useState(null);
    const [mapZone, setMapZone] = useState(null);
    const [mapAnaliseBio, setMapAnaliseBio] = useState(null);
    const [pathZone, setPathZone] = useState([]);

    useEffect(() => {
        getImages();
        fixCoordinatesZone(data?.path);
        setMapZone({ latitude: data?.path[0].lat, longitude: data?.path[0].lng });
        if (analiseBio) {
            setMapAnaliseBio({ latitude: analiseBio[0].coord?.lat, longitude: analiseBio[0].coord?.lng })
        }
    }, []);

    function fixCoordinatesZone(coords) {
        let array = [];
        for (var i = 0; i < coords.length; i++) {
            array.push([coords[i].lng, coords[i].lat]);
        }
        array.push([coords[0].lng, coords[0].lat]);
        setPathZone(array);
    }

    async function getImages() {
        await getImagesZone();
        await getImagesAnaliseSoil();
        await getImagesTreesS1();
        if (analiseBio) {
            await getImagesBioZone();
        }
        if (bioSoil) {
            await getImagesBioSoil();
        }
    }

    async function getImagesZone() {
        setLoadingImageZones(true);

        let newArray = [];
        for (var i = 0; i < photosZone.length; i++) {
            const response = await getImage(photosZone[i].photo)
            newArray.push({
                ...photosZone[i],
                photo: response
            })
        }

        setImagesZones(newArray);
        setLoadingImageZones(false);
    }

    async function getImagesAnaliseSoil() {
        setLoadingImageAnalise(true);

        let newArray = [];
        for (var i = 0; i < analiseSolo.length; i++) {
            const response = await getImage(analiseSolo[i].photo)
            let addPhoto1 = '';
            let addPhoto2 = '';
            if (analiseSolo[i]?.addPhoto1) {
                const response2 = await getImage(analiseSolo[i]?.addPhoto1)
                addPhoto1 = response2;
                const response3 = await getImage(analiseSolo[i]?.addPhoto2)
                addPhoto2 = response3;
            }
            newArray.push({
                ...analiseSolo[i],
                photo: response,
                addPhoto1,
                addPhoto2,
            })
        }

        setImagesAnaliseSoil(newArray);
        setLoadingImageAnalise(false);
    }

    async function getImagesBioSoil() {
        setLoadingImageBioSoil(true);

        let newArray = [];
        for (var i = 0; i < bioSoil.length; i++) {
            const response = await getImage(bioSoil[i].photo)

            newArray.push({
                ...bioSoil[i],
                photo: response,
            })
        }

        setImagesBioSoil(newArray);
        setLoadingImageBioSoil(false);
    }

    async function getImagesTreesS1() {
        setLoadingImagesTreesS1(true);
        const array = data?.arvores?.sampling1?.trees;
        let newArray = [];
        for (var i = 0; i < array.length; i++) {
            const response = await getImage(array[i].photo)
            newArray.push({
                ...array[i],
                photo: response
            })
        }

        setImagesTressS1(newArray);
        setLoadingImagesTreesS1(false);
    }

    async function getImagesBioZone() {
        setLoadingImageBioZone(true);

        let newArray = [];
        for (var i = 0; i < analiseBio.length; i++) {
            const response = await getImage(analiseBio[i].photo)

            newArray.push({
                ...analiseBio[i],
                photo: response,
            })
        }

        setImagesBioZone(newArray);
        setLoadingImageBioZone(false);
    }

    return (
        <div className="flex flex-col bg-[#012939] p-2 rounded-md">
            <p className="text-white font-bold">{data?.title} - {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Number(data?.areaZone))} m²</p>
            {mapZone && (
                <ReactMapGL
                    style={{ width: '100%', height: 300 }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                    latitude={mapZone?.latitude}
                    longitude={mapZone?.longitude}
                    onDrag={(e) => {
                        setMapZone({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                    }}
                    minZoom={14}
                    maxZoom={20}
                >
                    <Polyline
                        lineColor='red'
                        lineWidth={4}
                        coordinates={pathZone}
                    />

                    {data.arvores.sampling1.trees.map(tree => (
                        <Marker
                            key={tree.lat}
                            latitude={tree.lat}
                            longitude={tree.lng}
                            color="green"
                        />
                    ))}

                    {data.analiseSolo.map((analise, index) => (
                        <Marker
                            key={analise?.coord?.lat}
                            latitude={analise?.coord?.lat}
                            longitude={analise?.coord?.lng}
                            color="#ff4af9"
                        />
                    ))}

                    {bioSoil && (
                        <>
                            {bioSoil.map((analise, index) => (
                                <Marker
                                    key={analise?.coord?.lat}
                                    latitude={analise?.coord?.lat}
                                    longitude={analise?.coord?.lng}
                                    color="#911c0f"
                                />
                            ))}
                        </>
                    )}
                </ReactMapGL>
            )}
            <div className="flex items-center gap-1 mt-1">
                <div className="w-5 h-1 rounded-md bg-red-500" />
                <p className="text-white text-xs">{t('zona')}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
                <FaMapMarker color='#ff4af9' size={20} />
                <p className="text-white text-xs">{t('coletasBiomassa')}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
                <FaMapMarker color='#911c0f' size={20} />
                <p className="text-white text-xs">{t('coletasBioSolo')}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
                <FaMapMarker color='green' size={20} />
                <p className="text-white text-xs">{t('plantasRegistradas')}</p>
            </div>

            <p className="text-white mt-5">{t('fotosZona')}</p>

            {loadingImagesZones ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} hiddenIcon />
                    <p className="text-white mt-1">{t('carregandoImgs')}</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesZones.map(item => (
                        <button
                            key={item.photo}
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
                </div>
            )}

            <p className="text-white mt-5 text-center font-bold">{t('analiseBiomassaSolo')}</p>
            {mapZone && (
                <ReactMapGL
                    style={{ width: '100%', height: 200 }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                    latitude={mapZone?.latitude}
                    longitude={mapZone?.longitude}
                    onDrag={(e) => {
                        setMapZone({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                    }}
                    minZoom={14}
                    maxZoom={20}
                >
                    <Polyline
                        lineColor='red'
                        lineWidth={4}
                        coordinates={pathZone}
                    />

                    {data.analiseSolo.map((analise, index) => (
                        <Marker
                            key={analise?.coord?.lat}
                            latitude={analise?.coord?.lat}
                            longitude={analise?.coord?.lng}
                            color="#ff4af9"
                        />
                    ))}
                </ReactMapGL>
            )}
            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='#ff4af9' size={20} />
                <p className="text-white text-xs">{t('localizacaoColetas')}</p>
            </div>

            {loadingImagesAnalise ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} hiddenIcon />
                    <p className="text-white mt-1">{t('carregandoDados')}</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesAnaliseSoil.map(item => (
                        <button
                            key={item.photo}
                            className="w-[250px] h-[300px]"
                            onClick={() => {
                                setCollectDetails(true);
                                setCollectSelected(item)
                                // setImageSelected(item.photo);
                                // setViewImage(true);
                            }}
                        >
                            <ImageItem
                                src={item}
                                type='analise-soil'
                            />
                        </button>
                    ))}
                </div>
            )}

            {mapAnaliseBio && (
                <>
                    <p className="text-white mt-5 font-bold text-center">{t('estacaoBio')}</p>

                    <ReactMapGL
                        style={{ width: '100%', height: 200 }}
                        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                        latitude={mapAnaliseBio?.latitude}
                        longitude={mapAnaliseBio?.longitude}
                        onDrag={(e) => {
                            setMapAnaliseBio({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                        }}
                        minZoom={14}
                        maxZoom={20}
                    >
                        <Polyline
                            lineColor='red'
                            lineWidth={4}
                            coordinates={pathZone}
                        />

                        {analiseBio.map((analise, index) => (
                            <Marker
                                key={analise?.coord?.lat}
                                latitude={analise?.coord?.lat}
                                longitude={analise?.coord?.lng}
                                color="yellow"
                            />
                        ))}
                    </ReactMapGL>

                    <div className="flex items-center gap-1 mt-1 mb-4">
                        <FaMapMarker color='yellow' size={20} />
                        <p className="text-white text-xs">{t('localizacaoColetas')}</p>
                    </div>

                    {loadingImagesBioZone ? (
                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                            <ActivityIndicator size={50} hiddenIcon />
                            <p className="text-white mt-1">{t('carregandoDados')}</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-white font-bold">Fauna</p>
                            <div className="flex gap-3 overflow-auto">
                                {imagesBioZone.map(item => {
                                    if (item?.type === 'fauna') {
                                        return (
                                            <button
                                                key={item.photo}
                                                className="w-[250px] h-[300px]"
                                                onClick={() => {
                                                    //setCollectDetails(true);
                                                    //setCollectSelected(item)
                                                    setImageSelected(item.photo);
                                                    setViewImage(true);
                                                }}
                                            >
                                                <ImageItem
                                                    src={item}
                                                    type='biodiversity-zone'
                                                />
                                            </button>
                                        )
                                    }
                                })}
                            </div>
                            
                            <p className="text-white font-bold mt-3">{t('flora')}</p>
                            <div className="flex gap-3 overflow-auto">
                                {imagesBioZone.map(item => {
                                    if (item?.type === 'flora') {
                                        return (
                                            <button
                                                key={item.photo}
                                                className="w-[250px] h-[300px]"
                                                onClick={() => {
                                                    //setCollectDetails(true);
                                                    //setCollectSelected(item)
                                                    setImageSelected(item.photo);
                                                    setViewImage(true);
                                                }}
                                            >
                                                <ImageItem
                                                    src={item}
                                                    type='biodiversity-zone'
                                                />
                                            </button>
                                        )
                                    }
                                })}
                            </div>
                        </>
                    )}

                </>
            )}

            {bioSoil?.length > 0 && (
                <>
                    <p className="text-white mt-5 font-bold text-center">{t('analiseBioSolo')}</p>
                    {mapZone && (
                        <ReactMapGL
                            style={{ width: '100%', height: 200 }}
                            mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                            latitude={mapZone?.latitude}
                            longitude={mapZone?.longitude}
                            onDrag={(e) => {
                                setMapZone({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                            }}
                            minZoom={14}
                            maxZoom={20}
                        >
                            <Polyline
                                lineColor='red'
                                lineWidth={4}
                                coordinates={pathZone}
                            />

                            {bioSoil.map((analise, index) => (
                                <Marker
                                    key={analise?.coord?.lat}
                                    latitude={analise?.coord?.lat}
                                    longitude={analise?.coord?.lng}
                                    color="#911c0f"
                                />
                            ))}
                        </ReactMapGL>
                    )}

                    <div className="flex items-center gap-1 mt-1 mb-4">
                        <FaMapMarker color='#911c0f' size={20} />
                        <p className="text-white text-xs">{t('localizacaoColetas')}</p>
                    </div>

                    {loadingImagesBioSoil ? (
                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                            <ActivityIndicator size={50} hiddenIcon />
                            <p className="text-white mt-1">{t('carregandoDados')}</p>
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-auto">
                            {imagesBioSoil.map(item => (
                                <button
                                    key={item.photo}
                                    className="w-[250px] h-[300px]"
                                    onClick={() => {
                                        setCollectDetails(true);
                                        setCollectSelected(item)
                                        // setImageSelected(item.photo);
                                        // setViewImage(true);
                                    }}
                                >
                                    <ImageItem
                                        src={item}
                                        type='biodiversity-soil'
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                </>
            )}

            <p className="text-white mt-3">{t('analiseArvores')}</p>
            <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(areaSampling1).toFixed(2))} m²</p>

            <div className="flex flex-col p-2 rounded-md bg-[#03364D]">
                <p className="text-white font-bold mt-1">{t('analisePlantasamostragem')}</p>
                <p className="text-white">{t('arvoresRegistradas')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(treesS1).toFixed(0))}</span></p>

                <p className="text-white font-bold mt-1">{t('estimativaPlantasZona')} - {Intl.NumberFormat('pt-BR').format(Number(data?.areaZone).toFixed(2))} m²</p>
                <p className="text-white">{t('totalEstimado')}: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number((treesS1 / areaSampling1) * areaZone).toFixed(0))}</span></p>
            </div>

            <p className="text-white mt-2">{t('plantasRegistradas')}</p>
            {mapZone && (
                <ReactMapGL
                    style={{ width: '100%', height: 200 }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                    latitude={mapZone?.latitude}
                    longitude={mapZone?.longitude}
                    onDrag={(e) => {
                        setMapZone({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                    }}
                    minZoom={14}
                    maxZoom={20}
                >
                    <Polyline
                        lineColor='red'
                        lineWidth={4}
                        coordinates={pathZone}
                    />

                    {data.arvores.sampling1.trees.map(tree => (
                        <Marker
                            key={tree.lat}
                            latitude={tree.lat}
                            longitude={tree.lng}
                            color="green"
                        />
                    ))}
                </ReactMapGL>
            )}

            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='green' size={20} />
                <p className="text-white text-xs">{t('loacalizacaoPlanta')}</p>
            </div>

            {loadingImagesTreesS1 ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} hiddenIcon />
                    <p className="text-white mt-1">{t('carregandoImgs')}</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesTreesS1.map(item => (
                        <button
                            key={item.photo}
                            className="w-[250px] h-[300px]"
                            onClick={() => {
                                setImageSelected(item.photo);
                                setViewImage(true);
                            }}
                        >
                            <ImageItem
                                src={item}
                                type='trees'
                            />
                        </button>
                    ))}
                </div>
            )}

            {viewImage && (
                <ViewImage
                    close={() => setViewImage(false)}
                    uri={imageSelected}
                />
            )}

            {collectDetails && (
                <ModalCollectDetails
                    close={() => setCollectDetails(false)}
                    data={collectSelected}
                />
            )}
        </div>
    )
}