import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { api } from "../../services/api";
import { ActivityIndicator } from "../ActivityIndicator/ActivityIndicator";
import {BsTreeFill} from 'react-icons/bs';
import {MdScore, MdTerrain} from 'react-icons/md';
import {FaCloud, FaWater} from 'react-icons/fa';

export function ProducerGraphics({ inspections }) {
    const [loading, setLoading] = useState(true);
    const [treesData, setTreesData] = useState([]);
    const [carbonData, setCarbonData] = useState([]);
    const [isaScore, setIsaScore] = useState([]);
    const [waterData, setWaterData] = useState([]);
    const [soilData, setSoilData] = useState([]);
    const [bioData, setBioData] = useState([]);
    const [statisticType, setStatisticType] = useState('isa');
    const [seriesGraphic, setSeriesGraphic] = useState(null);
    const [configData, setConfigData] = useState(null);

    useEffect(() => {
        if (inspections) {
            if (inspections.length > 0) {
                getDetailsInspections();
            }
            if (inspections.length < 2) {
                setLoading(false);
            }
        }
    }, [inspections]);

    async function getDetailsInspections() {
        setLoading(true);

        let detailsInspections = [];

        for (var i = 0; i < inspections.length; i++) {
            const response = await api.get(`/web3/inspection/${inspections[i].id}`);
            detailsInspections.push(response.data)
        }

        setTimeout(() => {
            generateDataGraphic(detailsInspections);
        }, 500)
    }

    async function generateDataGraphic(inspectionsData) {
        let labels = [];
        let trees = [];
        let isa = [];
        let carbon = [];
        let water = [];
        let soil = [];
        let bio = [];

        for (var a = 0; a < inspectionsData.length; a++) {
            const insp = inspectionsData[a];
            const inspectionApiData = insp?.inspectionApiData;
            const resultInspection = JSON.parse(inspectionApiData?.resultInspection)

            labels.unshift(String(insp?.inspection?.id));
            trees.unshift(Number(resultInspection?.pdfData?.estimatedTreesTotal).toFixed(0));
            isa.unshift(Number(insp?.inspection?.isaScore))
            carbon.unshift(Math.abs(Number(resultInspection?.resultIndices?.carbon) / 1000).toFixed(1));
            water.unshift(Number(resultInspection?.resultIndices?.water));
            soil.unshift(Number(resultInspection?.resultIndices?.soil));
            bio.unshift(Number(resultInspection?.resultIndices?.bio))
        }

        setTreesData(trees);
        setIsaScore(isa);
        setCarbonData(carbon);
        setWaterData(water);
        setSoilData(soil);
        setBioData(bio);

        setConfigData({
            chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#77B6EA', '#77B6EA'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#062c01'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: labels,
                labels: {
                    style: {
                        colors: '#fff'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#fff'
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        });

        setSeriesGraphic([{
            name: "Pontuação",
            data: isa
        }])

        setTimeout(() => {
            setLoading(false);
        }, 500)
    }

    function changeStatisticType(type){
        if(type === 'isa'){
            setSeriesGraphic([{name: 'Pontuação', data: isaScore}])
        }
        if(type === 'trees'){
            setSeriesGraphic([{name: 'Árvores', data: treesData}])
        }
        if(type === 'carbon'){
            setSeriesGraphic([{name: 'Carbono', data: carbonData}])
        }
        if(type === 'soil'){
            setSeriesGraphic([{name: 'Solo', data: soilData}])
        }
        if(type === 'water'){
            setSeriesGraphic([{name: 'Água', data: waterData}])
        }
        if(type === 'bio'){
            setSeriesGraphic([{name: 'Biodiversidade', data: bioData}])
        }
        setStatisticType(type);
    }

    if(loading){
        return(
            <div className="w-full h-[380px] items-center justify-center flex flex-col">
                <ActivityIndicator size={50}/>
                <p className="text-white">Carregando estatísticas</p>
            </div>
        )
    }

    return (
        <div>
            {configData && (
                <div className="flex flex-col">
                    <p className="font-bold text-white text-center mb-[-20px]">
                        {statisticType === 'trees' && 'Árvores'}
                        {statisticType === 'isa' && 'Score de regeneração (pts)'}
                        {statisticType === 'carbon' && 'Sequestro de carbono (t)'}
                        {statisticType === 'water' && 'Água (m³)'}
                        {statisticType === 'soil' && 'Solo (m²)'}
                        {statisticType === 'bio' && 'Biodiversidade (uv)'}
                    </p>
                    <Chart series={seriesGraphic} options={configData} type='line' height={350} />
                    <p className="text-white text-xs text-center mt-[-30px]">ID da inspeção</p>

                    <div className="flex items-center gap-7 overflow-x-auto">
                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'isa' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('isa')}
                        >
                            <MdScore size={20} color={statisticType === 'isa' ? '#0a4' : 'white'}/>
                            Pontuação
                        </button>

                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'trees' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('trees')}
                        >
                            <BsTreeFill size={20} color={statisticType === 'trees' ? '#0a4' : 'white'}/>
                            Árvores
                        </button>

                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'carbon' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('carbon')}
                        >
                            <FaCloud size={20} color={statisticType === 'carbon' ? '#0a4' : 'white'}/>
                            Carbono
                        </button>

                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'soil' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('soil')}
                        >
                            <MdTerrain size={20} color={statisticType === 'soil' ? '#0a4' : 'white'}/>
                            Solo
                        </button>

                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'water' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('water')}
                        >
                            <FaWater size={20} color={statisticType === 'water' ? '#0a4' : 'white'}/>
                            Água
                        </button>

                        <button
                            className={`flex items-center gap-2 pb-1 border-b-4 rounded-lg font-bold ${statisticType === 'bio' ? 'border-green-500 text-green-500' : 'border-transparent text-white'}`}
                            onClick={() => changeStatisticType('bio')}
                        >
                            Biodiversidade
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}