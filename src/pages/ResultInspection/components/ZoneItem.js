import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { Blocks } from "react-loader-spinner";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { ImageItem } from "./ImageItem";

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
                    <ActivityIndicator size={50}/>
                    <p className="text-white mt-1">Carregando imagens, aguarde...</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesZones.map(item => (
                        <div key={item.photo} className="w-[250px] h-[300px]">
                            <ImageItem
                                src={item}
                                type='photos-zone'
                            />
                        </div>
                    ))}
                </div>
            )}

            <p className="text-white mt-2">Análise de solo</p>

            {loadingImagesAnalise ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50}/>
                    <p className="text-white mt-1">Carregando dados, aguarde...</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesAnaliseSoil.map(item => (
                        <div key={item.photo} className="w-[250px] h-[300px]">
                            <ImageItem
                                src={item}
                                type='analise-soil'
                            />
                        </div>
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

            <p className="text-white mt-2">Fotos das plantas registradas (Amostragem 1)</p>

            {loadingImagesTreesS1 ? (
                <div className="flex flex-col items-center justify-center w-full h-[315px]">
                    <ActivityIndicator size={50}/>
                    <p className="text-white mt-1">Carregando fotos, aguarde...</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-auto">
                    {imagesTreesS1.map(item => (
                        <div key={item.photo} className="w-[250px] h-[300px]">
                            <ImageItem
                                src={item}
                                type='trees'
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}