import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router-dom';
import { TopBar } from "../../components/TopBar";
import { ModalTransactionCreated } from "../../components/ModalTransactionCreated";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { RecordItem } from "./components/RecordItem";
import { ModalAddRecord } from "./components/ModalAddRecord";
import { ModalPaymentInvoice } from "./components/ModalPaymentInvoice";
import Chart from 'react-apexcharts';

const atualMonth = new Date().getMonth();
const atualYear = new Date().getFullYear();

export function ImpactCalculator() {
    const navigate = useNavigate();
    const { userData, walletConnected, } = useMainContext();
    const [items, setItems] = useState([]);
    const [impact, setImpact] = useState({});
    const [impactToken, setImpactToken] = useState({});
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [balanceData, setBalanceData] = useState({});
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [loading, setLoading] = useState(false);
    const [monthSelected, setMonthSelected] = useState(String(atualMonth + 1));
    const [openInvoice, setOpenInvoice] = useState(false);
    const [modalRecord, setModalRecord] = useState(false);
    const [modalPayment, setModalPayment] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [records, setRecords] = useState([]);
    const [typePayment, setTypePayment] = useState('total');
    const [firstLoading, setFirstLoading] = useState(false);
    const [loadingStatistics, setLoadingStatistics] = useState(true);
    const [invoicesThisYear, setInvoicesThisYear] = useState([]);
    const [itemSelect, setItemSelect] = useState('');
    const [seriesGraphic, setSeriesGraphic] = useState(null);
    const [configData, setConfigData] = useState(null);
 
    const totalPaymentRC = ((impact?.carbon * 1000) / (impactToken?.carbon * 1000).toFixed(1)).toFixed(0) * -1;
    const totalPaymentFixed = ((impact?.carbon * 1000) / (invoiceData?.impactTokenCarbon * 1000).toFixed(1)).toFixed(0) * -1

    useEffect(() => {
        getItems();
        if (walletConnected !== ''){
            getBalance();
        }
    }, [walletConnected]);

    useEffect(() => {
        if (userData?.accountStatus === 'blockchain') {
            getInvoice();
            getData();
        }
    }, [userData, monthSelected]);


    useEffect(() => {
        if (records.length > 0) {
            calculateImpact(records);
        } else {
            setImpact({ carbon: 0, soil: 0, water: 0, bio: 0 })
        }
    }, [records]);

    useEffect(() => {
        if(itemSelect !== '' && invoicesThisYear.length > 0){
            createGraphic(invoicesThisYear)
        }
    }, [itemSelect, invoicesThisYear]);

    async function getInvoice() {
        try {
            setLoading(true);
            const response = await api.get(`/invoice/${userData?.id}/${monthSelected}/2024`);
            const invoice = response.data.invoice;
            setInvoiceData(invoice);
            setRecords(invoice.records);
            checkInvoiceClosed(invoice);
        } catch (err) {
            console.log(err);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }

    async function checkInvoiceClosed(data) {
        const month = data?.month;
        const year = data?.year;

        if (year === atualYear) {
            if (month < atualMonth + 1) {
                setOpenInvoice(false);
            } else {
                setOpenInvoice(true);
            }
        }
    }

    function calculateImpact(array) {
        console.log(array)
        let carbon = 0;
        let soil = 0;
        let water = 0;
        let bio = 0;

        for (var i = 0; i < array.length; i++) {
            carbon += array[i].quant * Number(array[i]?.CalculatorItem.carbon);
            soil += array[i].quant * array[i]?.CalculatorItem.soil;
            water += array[i].quant * array[i]?.CalculatorItem.water;
            bio += array[i].quant * array[i]?.CalculatorItem.bio;
        }

        setImpact({ carbon, soil, water, bio })
    }

    async function getBalance() {
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
    }

    async function getData() {
        setFirstLoading(true);
        const response = await api.get(`/invoices/${userData?.id}/${atualYear}`);
        setInvoicesThisYear(response.data.invoices);
        formaterItemsToReduce(response.data?.itemsToReduce);

        const response2 = await api.get('/impact-per-token');
        setImpactToken(response2.data.impact);
        setFirstLoading(false);
    }

    async function getItems() {
        const response = await api.get('/calculator/items');
        setItems(response.data.items);
    }

    function createGraphic(invoices){
        const idItem = itemSelect;
        setLoadingStatistics(true);
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
        setLoadingStatistics(false);
    }

    function formaterItemsToReduce(items){
        if(items){
            const array = JSON.parse(items);
            let newArray = [];
            for(var i = 0; i < array.length; i++){
                newArray.push({value: array[i].id, label: `${array[i].name} ( ${array[i].unit} )`})
            }
            setItemsToReduce(newArray);
            setItemSelect(array[0].id);
        }
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            {firstLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <ActivityIndicator size={170}/>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                        <div className="flex flex-col w-full lg:w-[1024px] mt-3 px-2 lg:px-0">
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-white">Calculadora de impacto</p>

                                <button
                                    className="w-[200px] bg-blue-500 rounded-md font-semibold text-white h-10 mt-3"
                                    onClick={() => setModalRecord(true)}
                                >
                                    Registrar consumo
                                </button>
                            </div>

                            <div className="flex flex-col border border-green rounded-md w-full h-[390px] mt-1">
                                {invoicesThisYear.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <p className="text-white">Nenhuma informação para ser exibida</p>
                                    </div>
                                ) : (
                                    <>
                                        {loadingStatistics ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <ActivityIndicator size={50}/>
                                                <p className="font-bold text-white">Montando gráfico</p>
                                            </div>
                                        ) : (
                                            <>
                                                {configData && (
                                                    <Chart series={seriesGraphic} options={configData} type='line' height={300} width={1024}/>
                                                )}

                                                <select
                                                    value={itemSelect}
                                                    onChange={(e) => setItemSelect(e.target.value)}
                                                    className="w-[230px] h-10 rounded-md px-2 text-white bg-[#0a4303] ml-3"
                                                >
                                                    {itemsToReduce.map(item => (
                                                        <option
                                                            value={item?.value}
                                                            key={item?.value}
                                                        >
                                                            {item?.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <p className="text-center text-xs text-gray-400">Evolução mensal</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between w-full mt-3">
                                <select
                                    className="w-[150px] bg-[#0a4303] rounded-md text-white h-10 px-3"
                                    value={monthSelected}
                                    onChange={(e) => setMonthSelected(e.target.value)}
                                >
                                    <option value='1'>Janeiro</option>
                                    <option value='2'>Fevereiro</option>
                                    <option value='3'>Março</option>
                                    <option value='4'>Abril</option>
                                    <option value='5'>Maio</option>
                                    <option value='6'>Junho</option>
                                    <option value='7'>Julho</option>
                                    <option value='8'>Agosto</option>
                                    <option value='9'>Setembro</option>
                                    <option value='10'>Outubro</option>
                                    <option value='11'>Novembro</option>
                                    <option value='12'>Dezembro</option>
                                </select>

                                <p className="text-white">Histórico</p>
                            </div>

                            <div className="mt-5">
                                {records.length === 0 ? (
                                    <>
                                        <p className="text-white my-10 text-center">Nenhum registro encontrado</p>
                                    </>
                                ) : (
                                    <>
                                        {records.map(item => (
                                            <RecordItem
                                                key={item.id}
                                                data={item}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-5">
                                <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-full lg:w-[320px]'>
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/token.png')}
                                            className='w-7 h-7 object-contain'
                                        />

                                        <p className='font-bold text-white'>Impacto da fatura</p>
                                    </div>

                                    <div className='flex items-center gap-20 w-full mt-3 justify-center'>
                                        <div className='flex flex-col items-center gap-5'>
                                            <div className='flex flex-col items-center'>
                                                <h3 className='text-white text-sm'>Carbono</h3>
                                                <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impact?.carbon)} kg</p>
                                            </div>

                                            <div className='flex flex-col items-center'>
                                                <h3 className='text-white text-sm'>Água</h3>
                                                <p className='font-bold text-white'>- {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impact?.water)} m³</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-center gap-5'>
                                            <div className='flex flex-col items-center'>
                                                <h3 className='text-white text-sm'>Solo</h3>
                                                <p className='font-bold text-white'>- {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impact?.soil)} m²</p>
                                            </div>

                                            <div className='flex flex-col items-center'>
                                                <h3 className='text-white text-sm'>Biodver.</h3>
                                                <p className='font-bold text-white'>- {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(impact?.bio)} uv</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col p-3 rounded-md bg-[#0a4303] w-full lg:w-[320px]'>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-bold text-white'>Resumo da fatura</p>

                                        {openInvoice ? (
                                            <p className="text-green-500">Em aberto</p>
                                        ) : (
                                            <p className="text-red-500">Fatura fechada</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-white">Total da fatura</p>

                                        <p className="text-white font-bold">{records.length > 0 ? `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(totalPaymentRC)} RC` : '0 RC'}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-white">Já compensado</p>

                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(invoiceData?.ammountReceived)} RC</p>
                                    </div>

                                    <p className="text-white mt-2">Resta compensar</p>
                                    <h3 className="font-bold text-white text-3xl">
                                        {records.length > 0 ? `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(totalPaymentRC - invoiceData?.ammountReceived)} RC` : '0 RC'}
                                    </h3>

                                    <button
                                        className={`w-full h-10 rounded-md font-semibold text-white ${openInvoice ? 'bg-gray-500' : 'bg-green-500'}`}
                                        onClick={() => {
                                            if (openInvoice) {
                                                setTypePayment('partial');
                                            } else {
                                                setTypePayment('total');
                                            }
                                            setModalPayment(true);
                                        }}
                                    >
                                        {openInvoice ? 'Antecipar' : 'Compensar fatura'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {modalRecord && (
                <ModalAddRecord
                    close={() => setModalRecord(false)}
                    registered={() => {
                        getInvoice();
                        toast.success('Registro salvo com sucesso!');
                    }}
                />
            )}

            {modalPayment && (
                <ModalPaymentInvoice
                    close={() => setModalPayment(false)}
                    type={typePayment}
                    invoiceData={invoiceData}
                    invoiceValue={totalPaymentRC - invoiceData?.ammountReceived}
                    transactionCreated={() => setCreatedTransaction(true)}
                    impactToken={impactToken}
                />
            )}

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => setCreatedTransaction(false)}
                />
            )}

            <ToastContainer />
        </div>
    );
}