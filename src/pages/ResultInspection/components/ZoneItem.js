import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { ImageItem } from "./ImageItem";
import { ViewImage } from "../../../components/ViewImage";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarker } from "react-icons/fa";

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
    fillColor: "yellow",
    fillOpacity: 1,
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    strokeColor: '#fff'
};

export function ZoneItem({ data, index }) {
    const treesS1 = Number(data?.arvores?.sampling1?.trees?.length);
    const areaSampling1 = Number(data?.arvores?.sampling1?.area);
    const treesS2 = data?.arvores?.sampling2?.trees?.length;
    const areaSampling2 = Number(data?.arvores?.sampling2?.area);
    const areaZone = Number(data?.areaZone);
    const analiseSolo = data?.analiseSolo;
    const photosZone = data?.photosZone;

    const [color, setColor] = useState('red');
    const [modalCoords, setModalCoords] = useState(false);
    const [imagesZones, setImagesZones] = useState([]);
    const [imagesAnaliseSoil, setImagesAnaliseSoil] = useState([]);
    const [imagesTreesS1, setImagesTressS1] = useState([]);
    const [loadingImagesZones, setLoadingImageZones] = useState(true);
    const [loadingImagesAnalise, setLoadingImageAnalise] = useState(true);
    const [loadingImagesTreesS1, setLoadingImagesTreesS1] = useState(true);
    const [viewImage, setViewImage] = useState(false);
    const [imageSelected, setImageSelected] = useState('');

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
            newArray.push({
                ...analiseSolo[i],
                photo: response
            })
        }

        setImagesAnaliseSoil(newArray);
        setLoadingImageAnalise(false);
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

            <p className="text-white mt-2">Análise de solo</p>
            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                    libraries={['drawing']}
                >
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
                </LoadScript>
            </div>
            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='red' size={20}/>
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
                                setImageSelected(item.photo);
                                setViewImage(true);
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
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                    libraries={['drawing']}
                >
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
                </LoadScript>
            </div>
            <div className="flex items-center gap-1 mt-1 mb-4">
                <FaMapMarker color='red' size={20}/>
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
        </div>
    )
}