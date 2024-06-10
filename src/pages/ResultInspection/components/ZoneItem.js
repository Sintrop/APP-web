import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { ImageItem } from "./ImageItem";
import { ViewImage } from "../../../components/ViewImage";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarker } from "react-icons/fa";
import { ModalCollectDetails } from "./ModalCollectDetails";
import { APIProvider, Map, Marker as NewMarker, AdvancedMarker, Pin, AdvancedMarkerContext } from '@vis.gl/react-google-maps';

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

export function ZoneItem({ data, index }) {
    const treesS1 = Number(data?.arvores?.sampling1?.trees?.length);
    const areaSampling1 = Number(data?.arvores?.sampling1?.area);
    const treesS2 = data?.arvores?.sampling2?.trees?.length;
    const areaSampling2 = Number(data?.arvores?.sampling2?.area);
    const areaZone = Number(data?.areaZone);
    const analiseSolo = data?.analiseSolo;
    const bioSoil = data?.bioSoil;
    const photosZone = data?.photosZone;

    const [color, setColor] = useState('red');
    const [modalCoords, setModalCoords] = useState(false);
    const [imagesZones, setImagesZones] = useState([]);
    const [imagesAnaliseSoil, setImagesAnaliseSoil] = useState([]);
    const [imagesBioSoil, setImagesBioSoil] = useState([]);
    const [imagesTreesS1, setImagesTressS1] = useState([]);
    const [loadingImagesZones, setLoadingImageZones] = useState(true);
    const [loadingImagesAnalise, setLoadingImageAnalise] = useState(true);
    const [loadingImagesBioSoil, setLoadingImageBioSoil] = useState(true);
    const [loadingImagesTreesS1, setLoadingImagesTreesS1] = useState(true);
    const [viewImage, setViewImage] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [collectDetails, setCollectDetails] = useState(false);
    const [collectSelected, setCollectSelected] = useState(null);
    const [defaultLocationTrees, setDefaultLocationTrees] = useState(null);

    useEffect(() => {
        if (index === 0) {
            setColor('red');
        }

        if (index === 1) {
            setColor('blue');
        }


        if (index === 2) {
            setColor('green');
        }


        if (index === 3) {
            setColor('yellow');
        }


        if (index === 4) {
            setColor('purple');
        }

        getImages();
    }, []);

    async function getImages() {
        await getImagesZone();
        await getImagesAnaliseSoil();
        await getImagesTreesS1();
        if(bioSoil.length > 0){
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
            const response2 = await getImage(analiseSolo[i]?.addPhoto1)
            const response3 = await getImage(analiseSolo[i]?.addPhoto2)
            newArray.push({
                ...analiseSolo[i],
                photo: response,
                addPhoto1: response2,
                addPhoto2: response3,
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

    return (
        <div className="flex flex-col bg-green-950 p-2 rounded-md">
            <p className="text-white font-bold">{data?.title} - {Intl.NumberFormat('pt-BR').format(Number(data?.areaZone).toFixed(2))} m²</p>
            <p className="text-white text-sm">
                Cor no mapa:
                {color === 'red' && ' Vermelho'}
                {color === 'green' && ' Verde'}
                {color === 'blue' && ' Azul'}
                {color === 'yellow' && ' Amarelo'}
                {color === 'purple' && ' Roxo'}
            </p>
            <p className="text-white">Fotos da zona</p>

            {loadingImagesZones ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} />
                    <p className="text-white mt-1">Carregando imagens, aguarde...</p>
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

            <p className="text-white mt-5 text-center font-bold">Análise de biomassa do solo</p>
            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                <GoogleMap
                    mapContainerStyle={containerMapStyle}
                    center={{ lat: data.analiseSolo[0].coord?.lat, lng: data.analiseSolo[0].coord?.lng }}
                    zoom={18}
                    mapTypeId="hybrid"
                >
                    {data.analiseSolo.map((analise, index) => (
                        <Marker
                            position={{ lat: analise?.coord?.lat, lng: analise?.coord?.lng }}
                        />
                    ))}
                </GoogleMap>
            </div>
            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='red' size={20} />
                <p className="text-white text-xs">Localização das coletas</p>
            </div>

            {loadingImagesAnalise ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} />
                    <p className="text-white mt-1">Carregando dados, aguarde...</p>
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

            {bioSoil?.length > 0 && (
                <>
                    <p className="text-white mt-5 font-bold text-center">Análise de biodiversidade no solo</p>
                    <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                        <GoogleMap
                            mapContainerStyle={containerMapStyle}
                            center={{ lat: bioSoil[0]?.coord?.lat, lng: bioSoil[0]?.coord?.lng }}
                            zoom={18}
                            mapTypeId="hybrid"
                        >
                            {bioSoil.map((analise, index) => (
                                <Marker
                                    position={{ lat: analise?.coord?.lat, lng: analise?.coord?.lng }}
                                />
                            ))}
                        </GoogleMap>
                    </div>
                    <div className="flex items-center gap-1 mt-1 mb-4">
                        <FaMapMarker color='red' size={20} />
                        <p className="text-white text-xs">Localização das coletas</p>
                    </div>

                    {loadingImagesBioSoil ? (
                        <div className="flex flex-col items-center justify-center w-full h-[315px]">
                            <ActivityIndicator size={50} />
                            <p className="text-white mt-1">Carregando dados, aguarde...</p>
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

            <p className="text-white mt-3">Análise de árvores</p>
            <p className="text-white font-bold">Amostragem 1 - {Intl.NumberFormat('pt-BR').format(Number(areaSampling1).toFixed(2))} m²</p>

            <div className="flex flex-col p-2 rounded-md bg-[#0a4303]">
                <p className="text-white font-bold mt-1">Análise de plantas da amostragem</p>
                <p className="text-white">Árvores registradas: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number(treesS1).toFixed(0))}</span></p>

                <p className="text-white font-bold mt-1">Estimativa de plantas para a zona - {Intl.NumberFormat('pt-BR').format(Number(data?.areaZone).toFixed(2))} m²</p>
                <p className="text-white">Total estimado: <span className="font-bold text-[#3E9EF5]">{Intl.NumberFormat('pt-BR').format(Number((treesS1 / areaSampling1) * areaZone).toFixed(0))}</span></p>
            </div>

            <p className="text-white mt-2">Plantas registradas (Amostragem 1)</p>
            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                <GoogleMap
                    mapContainerStyle={containerMapStyle}
                    center={{ lat: data.arvores.sampling1.trees[0].lat, lng: data.arvores.sampling1.trees[0].lng }}
                    zoom={18}
                    mapTypeId="hybrid"
                >
                    {data.arvores.sampling1.trees.map(tree => (
                        <Marker
                            position={{ lat: tree.lat, lng: tree.lng }}
                        />
                    ))}
                </GoogleMap>
            </div>
            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='red' size={20} />
                <p className="text-white text-xs">Localização da planta</p>
            </div>

            {loadingImagesTreesS1 ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50} />
                    <p className="text-white mt-1">Carregando fotos, aguarde...</p>
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