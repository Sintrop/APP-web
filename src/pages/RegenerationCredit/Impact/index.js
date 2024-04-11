import React, { useEffect, useState } from 'react';
import { Header } from '../../../components/Header';
import { ActivityIndicator } from '../../../components/ActivityIndicator';
import { api } from '../../../services/api';
import Chart from 'react-apexcharts';
import { TopBar } from '../../../components/TopBar';

export function Impact() {
    const [loading, setLoading] = useState(true);
    const [impactGeral, setImpactGeral] = useState({});
    const [impactToken, setImpactToken] = useState({});
    const [impactToConfirm, setImpactToConfirm] = useState({});
    const [impactBurned, setImpactBurned] = useState({});
    const [modalFeedback, setModalFeedback] = useState(false);
    const [graphicCarbon, setGraphicCarbon] = useState(null);
    const [graphicSoil, setGraphicSoil] = useState(null);
    const [graphicWater, setGraphicWater] = useState(null);
    const [graphicBio, setGraphicBio] = useState(null);

    useEffect(() => {
        getImpact()
    }, []);

    async function getImpact() {
        setLoading(true);
        const response = await api.get('/network-impact');
        const impacts = response.data.impact;
        const impact = impacts.filter(item => item.id === '1');
        const confirm = impacts.filter(item => item.id === '6');
        const burned = impacts.filter(item => item.id === '7');

        setImpactGeral(impact[0]);
        setImpactToConfirm(confirm[0]);
        setImpactBurned(burned[0]);

        setGraphicCarbon([
            {
                name: 'Carbono',
                data: [
                    Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Math.abs(confirm[0]?.carbon).toFixed(0)),
                    Number(Math.abs(impact[0]?.carbon) / 1000).toFixed(0),
                    Number(Math.abs(burned[0]?.carbon) / 1000).toFixed(2)
                ]
            }
        ]);

        setGraphicSoil(
            [
                {
                    name: 'Solo',
                    data: [
                        Number(confirm[0]?.solo).toFixed(0),
                        Number(impact[0]?.solo / 10000).toFixed(2),
                        Number(burned[0]?.solo / 10000).toFixed(2)
                    ]
                }
            ]
        )

        setGraphicWater(
            [
                {
                    name: 'Água',
                    data: [
                        Number(confirm[0]?.agua).toFixed(0),
                        Number(impact[0]?.agua).toFixed(0),
                        Number(burned[0]?.agua).toFixed(0)
                    ]
                }
            ]
        )

        setGraphicBio(
            [
                {
                    name: 'Biodiversidade',
                    data: [
                        Number(confirm[0]?.bio).toFixed(0),
                        Number(impact[0]?.bio).toFixed(0),
                        Number(burned[0]?.bio).toFixed(0)
                    ]
                }
            ]
        )

        const response2 = await api.get('/impact-per-token');
        setImpactToken(response2.data.impact)
        setLoading(false);
    }

    const configChat = {
        options: {
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top',
                        fillColor: '#fff'
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#fff", '#fff']
                }
            },
            xaxis: {
                categories: ["À confirmar", "Disponível", "Compensado"],
                position: 'bottom',
                axisBorder: {
                    show: true
                },
                axisTicks: {
                    show: true
                },
                tooltip: {
                    enabled: true,
                },
                labels:{
                    style:{
                        colors: ['#fff', '#fff', '#fff']
                    }
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: true,
                },
                labels: {
                    show: true,
                    formatter: function (val) {
                        return val + "";
                    },
                    style:{
                        colors: ['#fff']
                    }
                },

            }
        }
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full pt-32 overflow-auto">
                {loading ? (
                    <div className='flex items-center justify-center h-[100vh] w-full'>
                        <ActivityIndicator size={180} />
                    </div>
                ) : (
                    <div className="flex flex-col max-w-[1024px] mt-3 mb-5">
                        <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-[320px]'>
                            <div className='flex items-center gap-2'>
                                <img
                                    src={require('../../../assets/token.png')}
                                    className='w-7 h-7 object-contain'
                                />

                                <p className='font-bold text-white'>Impacto por token</p>
                            </div>

                            <div className='flex items-center gap-20 w-full mt-3 justify-center'>
                                <div className='flex flex-col items-center gap-5'>
                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-white text-sm'>Carbono</h3>
                                        <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.carbon * 1000)} g</p>
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-white text-sm'>Água</h3>
                                        <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.water * 1000)} L</p>
                                    </div>
                                </div>

                                <div className='flex flex-col items-center gap-5'>
                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-white text-sm'>Solo</h3>
                                        <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.soil * 10000)} cm²</p>
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-white text-sm'>Biodver.</h3>
                                        <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(impactToken?.bio)} uv</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 flex items-center flex-wrap gap-3'>
                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303]'>
                                <p className='font-bold text-white'>Carbono (t CO²)</p>
                                <Chart
                                    options={configChat.options}
                                    series={graphicCarbon}
                                    type='bar'
                                    height={250}
                                    width={300}
                                />
                            </div>

                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303]'>
                                <p className='font-bold text-white'>Solo (ha)</p>
                                <Chart
                                    options={configChat.options}
                                    series={graphicSoil}
                                    type='bar'
                                    height={250}
                                    width={300}
                                />
                            </div>

                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303]'>
                                <p className='font-bold text-white'>Água (m³)</p>
                                <Chart
                                    options={configChat.options}
                                    series={graphicWater}
                                    type='bar'
                                    height={250}
                                    width={300}
                                />
                            </div>

                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303]'>
                                <p className='font-bold text-white'>Biodiversidade (uv)</p>
                                <Chart
                                    options={configChat.options}
                                    series={graphicBio}
                                    type='bar'
                                    height={250}
                                    width={300}
                                />
                            </div>
                        </div>

                        <div className='mt-4 flex items-center flex-wrap gap-3'>
                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-[320px]'>
                                <p className='font-bold text-white'>Impacto à confirmar</p>

                                <div className='flex items-center gap-20 w-full mt-3 justify-center'>
                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Carbono</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactToConfirm?.carbon / 1000)} t</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Água</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactToConfirm?.agua)} m³</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Solo</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactToConfirm?.solo / 10000)} ha</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Biodver.</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactToConfirm?.bio)} uv</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-[320px]'>
                                <p className='font-bold text-white'>Impacto disponível</p>

                                <div className='flex items-center gap-20 w-full mt-3 justify-center'>
                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Carbono</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactGeral?.carbon / 1000)} t</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Água</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(impactGeral?.agua)} m³</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Solo</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactGeral?.solo / 10000)} ha</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Biodver.</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(impactGeral?.bio)} uv</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-[320px]'>
                                <p className='font-bold text-white'>Impacto compensado</p>

                                <div className='flex items-center gap-20 w-full mt-3 justify-center'>
                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Carbono</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactBurned?.carbon / 1000)} t</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Água</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(impactBurned?.agua)} m³</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-center gap-5'>
                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Solo</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impactBurned?.solo / 10000)} ha</p>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className='text-white text-sm'>Biodver.</h3>
                                            <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(impactBurned?.bio)} uv</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}