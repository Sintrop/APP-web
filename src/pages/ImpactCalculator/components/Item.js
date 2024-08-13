import React, { useEffect, useState } from "react";
import { ModalAddItem } from "./ModalAddItem";
import { ModalProofReduce } from "./ModalProofReduce";
import { useMainContext } from "../../../hooks/useMainContext";
import { ToastContainer, toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";
import { api } from "../../../services/api";
import Chart from 'react-apexcharts';
import { useTranslation } from "react-i18next";

export function Item({ data, addItem, hiddenButton, type, deleteItem, userId, invoices }) {
    const {t} = useTranslation();
    const { walletConnected } = useMainContext();
    const [modalAddItem, setModalAddItem] = useState(false);
    const [proofReduce, setProofReduce] = useState(false);
    const [contributions, setContributions] = useState([]);
    const [quant, setQuant] = useState(0);
    const [seriesGraphic, setSeriesGraphic] = useState(null);
    const [configData, setConfigData] = useState(null);
    const width = window.screen.width;

    useEffect(() => {
        if (type === 'demonstration') getContributionDetails();
        if (invoices) {
            createGraphic(invoices);
        }
    }, [invoices]);

    async function getContributionDetails() {
        const response = await api.get(`/contributions/${userId}/${data?.id}`);
        const array = response.data.contributions
        setContributions(array);

        let count = 0;
        for (var i = 0; i < array.length; i++) {
            count += Number(array[i].quant);
        }

        setQuant(count)
    }

    function createGraphic(invoices) {
        const colors = ['red', 'yellow', '#1eb76f', 'blue', 'purple', 'orange']
        const idItem = data?.id;

        const janInvoice = invoices.filter(item => item.month === 1);
        const fevInvoice = invoices.filter(item => item.month === 2);
        const marInvoice = invoices.filter(item => item.month === 3);
        const abrInvoice = invoices.filter(item => item.month === 4);
        const maiInvoice = invoices.filter(item => item.month === 5);
        const junInvoice = invoices.filter(item => item.month === 6);
        const julInvoice = invoices.filter(item => item.month === 7);
        const agoInvoice = invoices.filter(item => item.month === 8);
        const setInvoice = invoices.filter(item => item.month === 9);
        const outInvoice = invoices.filter(item => item.month === 10);
        const novInvoice = invoices.filter(item => item.month === 11);
        const dezInvoice = invoices.filter(item => item.month === 12);

        const valuesItem = [];

        if (janInvoice.length > 0) {
            const filterJan = janInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterJan.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemJan = 0;
                for (var jan = 0; jan < filterJan.length; jan++) {
                    quantItemJan += Number(filterJan[jan].quant).toFixed(1);
                }
                valuesItem.push(quantItemJan);
            }
        } else {
            valuesItem.push(0);
        }

        if (fevInvoice.length > 0) {
            const filterFev = fevInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterFev.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemFev = 0;
                for (var fev = 0; fev < filterFev.length; fev++) {
                    quantItemFev += Number(filterFev[fev].quant).toFixed(1);
                }
                valuesItem.push(quantItemFev);
            }
        } else {
            valuesItem.push(0);
        }

        if (marInvoice.length > 0) {
            const filterMar = marInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterMar.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemMar = 0;
                for (var mar = 0; mar < filterMar.length; mar++) {
                    quantItemMar += Number(filterMar[mar].quant).toFixed(1);
                }
                valuesItem.push(quantItemMar);
            }
        } else {
            valuesItem.push(0);
        }

        if (abrInvoice.length > 0) {
            const filterAbr = abrInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterAbr.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemAbr = 0;
                for (var abr = 0; abr < filterAbr.length; abr++) {
                    quantItemAbr += Number(filterAbr[abr].quant).toFixed(1);
                }
                valuesItem.push(quantItemAbr);
            }
        } else {
            valuesItem.push(0);
        }

        if (maiInvoice.length > 0) {
            const filterMai = maiInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterMai.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemMai = 0;
                for (var mai = 0; mai < filterMai.length; mai++) {
                    quantItemMai += Number(filterMai[mai].quant).toFixed(1);
                }
                valuesItem.push(quantItemMai);
            }
        } else {
            valuesItem.push(0);
        }

        if (junInvoice.length > 0) {
            const filterJun = junInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterJun.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemJun = 0;
                for (var jun = 0; jun < filterJun.length; jun++) {
                    quantItemJun += Number(filterJun[jun].quant).toFixed(1);
                }
                valuesItem.push(quantItemJun);
            }
        } else {
            valuesItem.push(0);
        }

        if (julInvoice.length > 0) {
            const filterJul = julInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterJul.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemJul = 0;
                for (var jul = 0; jul < filterJul.length; jul++) {
                    quantItemJul += Number(filterJul[jul].quant).toFixed(1);
                }
                valuesItem.push(quantItemJul);
            }
        } else {
            valuesItem.push(0);
        }

        if (agoInvoice.length > 0) {
            const filterAgo = agoInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterAgo.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemAgo = 0;
                for (var ago = 0; ago < filterAgo.length; ago++) {
                    quantItemAgo += Number(filterAgo[ago].quant).toFixed(1);
                }
                valuesItem.push(quantItemAgo);
            }
        } else {
            valuesItem.push(0);
        }

        if (setInvoice.length > 0) {
            const filterSet = setInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterSet.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemSet = 0;
                for (var set = 0; set < filterSet.length; set++) {
                    quantItemSet += Number(filterSet[set].quant).toFixed(1);
                }
                valuesItem.push(quantItemSet);
            }
        } else {
            valuesItem.push(0);
        }

        if (outInvoice.length > 0) {
            const filterOut = outInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterOut.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemOut = 0;
                for (var set = 0; set < filterOut.length; set++) {
                    quantItemOut += Number(filterOut[set].quant).toFixed(1);
                }
                valuesItem.push(quantItemOut);
            }
        } else {
            valuesItem.push(0);
        }

        if (novInvoice.length > 0) {
            const filterNov = novInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterNov.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemNov = 0;
                for (var nov = 0; nov < filterNov.length; nov++) {
                    quantItemNov += Number(filterNov[nov].quant).toFixed(1);
                }
                valuesItem.push(quantItemNov);
            }
        } else {
            valuesItem.push(0);
        }

        if (dezInvoice.length > 0) {
            const filterDez = dezInvoice[0].records.filter(item => item.CalculatorItem.id === idItem);
            if (filterDez.length === 0) {
                valuesItem.push(0);
            } else {
                let quantItemDez = 0;
                for (var nov = 0; nov < filterDez.length; nov++) {
                    quantItemDez += Number(filterDez[nov].quant).toFixed(1);
                }
                valuesItem.push(quantItemDez);
            }
        } else {
            valuesItem.push(0);
        }

        setConfigData({
            chart: {
                height: 300,
                width: '100%',
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
            colors: [colors[parseInt(Math.random() * 6)]],
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
                categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
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
            name: "Consumo",
            data: valuesItem
        }]);
    }

    if (type === 'consumption-graph') {
        return (
            <div className="flex flex-col rounded-md px-2 pt-1 bg-[#0a4303]">
                <p className="font-bold text-white">{data?.name} ( {data?.unit} )</p>
                {configData && (
                    <Chart
                        series={seriesGraphic}
                        options={configData}
                        type='line'
                        height={280}
                        width={width >= 1024 ? 478 : width - 50}

                    />
                )}
            </div>
        )
    }

    if (type === 'demonstration') {
        return (
            <div className="flex flex-col items-center p-2 rounded-md border-2 border-white w-[200px]">
                <div className="flex flex-col w-full lg:w-fit">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-lg">{data?.name}</p>
                    </div>


                </div>

                <div className="flex flex-col mt-3 items-center">
                    <p className="font-bold text-3xl text-white">{contributions.length}</p>
                    <p className="text-sm text-white">Compesações feitas</p>

                    <p className="font-bold text-3xl text-white mt-3">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(quant)} {data?.unit}</p>
                    <p className="text-sm text-white">Quantidade</p>
                </div>

                {data?.source && (
                    <div className="flex w-full mt-4">
                        <p className="text-white text-xs">Fonte: <a target="_blank" href={data?.source} className="text-blue-400 underline">{data?.source}</a></p>
                    </div>
                )}

                {modalAddItem && (
                    <ModalAddItem
                        data={data}
                        close={() => setModalAddItem(false)}
                        addItem={(itemAdded) => addItem(itemAdded)}
                    />
                )}

                {proofReduce && (
                    <ModalProofReduce
                        close={() => setProofReduce(false)}
                        nameItem={data?.name}
                    />
                )}
            </div>
        );
    }

    if (type === 'list-items-to-reduce') {
        return (
            <div className="flex flex-col items-center p-2 rounded-md bg-[#0a4303] w-fit">
                <div className="flex flex-col w-full lg:w-fit">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-lg">{data?.name}</p>

                        {!hiddenButton && (
                            <button onClick={() => deleteItem(data)}>
                                <FaRegTrashAlt size={17} color='red' />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-3 border rounded-md p-1">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col items-center w-20">
                                <p className="font-semibold text-white">{data?.carbon} kg</p>
                                <p className="text-sm text-white">{t('carbono')}</p>
                            </div>
                            <div className="flex flex-col items-center w-20">
                                <p className="font-semibold text-white">{data?.soil} m²</p>
                                <p className="text-sm text-white">{t('solo')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col items-center w-20">
                                <p className="font-semibold text-white">{data?.water} m³</p>
                                <p className="text-sm text-white">{t('agua')}</p>
                            </div>
                            <div className="flex flex-col items-center w-20">
                                <p className="font-semibold text-white">{data?.bio} uv</p>
                                <p className="text-sm text-white">{t('bio')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {!hiddenButton && (
                    <div className="flex flex-col items-center mt-3">
                        <button
                            className="px-3 py-2 rounded-md text-white font-semibold bg-blue-600 text-sm"
                            onClick={() => setModalAddItem(true)}
                        >
                            Compensar item
                        </button>

                        <button
                            className="font-semibold text-white flex items-center gap-2 text-sm mt-2"
                            onClick={() => {
                                if (walletConnected === '') {
                                    toast.error('Você não está conectado!')
                                    return;
                                }
                                setProofReduce(true)
                            }}
                        >
                            Provar redução
                        </button>
                        <ToastContainer />
                    </div>
                )}

                {data?.source && (
                    <div className="flex w-full mt-4">
                        <p className="text-white text-xs">Fonte: <a target="_blank" href={data?.source} className="text-blue-400 underline">{data?.source}</a></p>
                    </div>
                )}

                {modalAddItem && (
                    <ModalAddItem
                        data={data}
                        close={() => setModalAddItem(false)}
                        addItem={(itemAdded) => addItem(itemAdded)}
                    />
                )}

                {proofReduce && (
                    <ModalProofReduce
                        close={() => setProofReduce(false)}
                        nameItem={data?.name}
                    />
                )}
            </div>
        );
    }

    if (type === 'list-items-calculator') {
        return (
            <div className="flex flex-col w-full p-2 rounded-md bg-[#0a4303]">

                <p className="font-bold text-white">{data?.name}</p>

                <div className="flex items-center justify-between gap-1 mt-1 rounded-md p-1 w-full">
                    <div className="flex items-center justify-between w-[20%]">
                        <p className="text-sm text-white">{t('carbono')}</p>
                        <p className="font-semibold text-green-500">{data?.carbon} kg</p>
                    </div>

                    <div className="w-[1px] h-5 bg-white"/>

                    <div className="flex items-center justify-between w-[20%]">
                        <p className="text-sm text-white">{t('solo')}</p>
                        <p className="font-semibold text-green-500">{data?.soil} m²</p>
                    </div>

                    <div className="w-[1px] h-5 bg-white"/>

                    <div className="flex items-center justify-between w-[20%]">
                        <p className="text-sm text-white">{t('agua')}</p>
                        <p className="font-semibold text-green-500">{data?.water} m³</p>
                    </div>

                    <div className="w-[1px] h-5 bg-white"/>

                    <div className="flex items-center justify-between w-[20%]">
                        <p className="text-sm text-white">{t('bio')}</p>
                        <p className="font-semibold text-green-500">{data?.bio} uv</p>
                    </div>
                </div>

                {data?.source && (
                    <p className="text-white text-xs">Fonte: <a target="_blank" href={data?.source} className="text-blue-400 underline">{data?.source}</a></p>
                )}

            </div>
        );
    }
}