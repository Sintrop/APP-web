import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { Item } from "./components/Item";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router-dom';
import { TopBar } from "../../components/TopBar";
import { Info } from "../../components/Info";
import { BurnTokens as BurnRCSupporter } from "../../services/supporterService";
import { BurnTokens } from "../../services/sacTokenService";
import { ModalTransactionCreated } from "../../components/ModalTransactionCreated";
import { LoadingTransaction } from "../../components/LoadingTransaction";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import * as Dialog from '@radix-ui/react-dialog';
import { Feedback } from "../../components/Feedback";
import { RecordItem } from "./components/RecordItem";
import { ModalAddRecord } from "./components/ModalAddRecord";
import { ModalPaymentInvoice } from "./components/ModalPaymentInvoice";

const atualMonth = new Date().getMonth();
const atualYear = new Date().getFullYear();

export function ImpactCalculator() {
    const navigate = useNavigate();
    const { setItemsCalculator, setTokensToContribute, userData, getUserDataApi, walletConnected, connectionType } = useMainContext();
    const [items, setItems] = useState([]);
    const [myList, setMyList] = useState([]);
    const [impact, setImpact] = useState({});
    const [impactToken, setImpactToken] = useState({});
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [balanceData, setBalanceData] = useState({});
    const [maxAmmount, setMaxAmmount] = useState(false);
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loading, setLoading] = useState(false);

    //nova calculadora
    const [monthSelected, setMonthSelected] = useState(String(atualMonth + 1));
    const [openInvoice, setOpenInvoice] = useState(false);
    const [modalRecord, setModalRecord] = useState(false);
    const [modalPayment, setModalPayment] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [records, setRecords] = useState([]);
    const [typePayment, setTypePayment] = useState('total');
    const [firstLoading, setFirstLoading] = useState(false);
    const [loadingStatistics, setLoadingStatistics] = useState(false);
    const [dataGraphic, setDataGraphic] = useState([]);
    const [invoicesThisYear, setInvoicesThisYear] = useState([]);
    const [itemSelect, setItemSelect] = useState('');

    const totalPaymentRC = ((impact?.carbon * 1000) / (impactToken?.carbon * 1000).toFixed(1)).toFixed(0) * -1;
    const totalPaymentFixed = ((impact?.carbon * 1000) / (invoiceData?.impactTokenCarbon * 1000).toFixed(1)).toFixed(0) * -1

    const razaoTokenCompensar = ((impact?.carbon * 1000) / (Number(impactToken.carbon) * 1000).toFixed(1)).toFixed(0) * -1

    useEffect(() => {
        getItems();
        getImpactToken();
        if (walletConnected !== '') getBalance();
    }, [walletConnected]);

    useEffect(() => {
        if (userData?.accountStatus === 'blockchain') {
            getInvoice();
        }
    }, [userData, monthSelected]);

    useEffect(() => {
        if (Number(razaoTokenCompensar) > Number(balanceData?.balance)) {
            setMaxAmmount(true);
        } else {
            setMaxAmmount(false);
        }
    }, [razaoTokenCompensar]);

    useEffect(() => {
        if (records.length > 0) {
            calculateImpact(records);
        } else {
            setImpact({ carbon: 0, soil: 0, water: 0, bio: 0 })
        }
    }, [records]);

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

    async function getImpactToken() {
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact)
    }

    async function getItems() {
        const response = await api.get('/calculator/items');
        setItems(response.data.items);
    }

    function addItemToList(item) {
        setMyList([...myList, item]);
        calculateImpact([...myList, item]);
        toast.success('Item adicionado a sua lista!');
    }

    // function calculateImpact(array) {
    //     let carbon = 0;
    //     let soil = 0;
    //     let water = 0;
    //     let bio = 0;

    //     for (var i = 0; i < array.length; i++) {
    //         carbon += array[i].quant * array[i].carbon;
    //         soil += array[i].quant * array[i].soil;
    //         water += array[i].quant * array[i].water;
    //         bio += array[i].quant * array[i].bio;
    //     }

    //     setImpact({ carbon, soil, water, bio })
    // }

    async function addItemToListToReduce(item) {
        const existsItem = itemsToReduce.filter(data => data.id === item.id);
        if (existsItem.length > 0) {
            toast.error('Você já tem esse item na sua lista de redução!');
            return;
        }

        let array = [];
        array = itemsToReduce;
        array.push(item)
        setItemsToReduce(array);
        toast.success('Item adicionado a sua lista de redução!')

        await api.put('/user/items-to-reduce', {
            userId: userData?.id,
            items: JSON.stringify(array)
        });

        getUserDataApi(userData?.wallet);
    }

    async function deleteItem(item) {
        const filter = itemsToReduce.filter(data => data?.id !== item.id);
        setItemsToReduce(filter);
        toast.success('Item removido da sua lista!');

        await api.put('/user/items-to-reduce', {
            userId: userData?.id,
            items: JSON.stringify(filter)
        });

        getUserDataApi(userData?.wallet);
    }

    async function handleContribute() {
        if (myList.length === 0) {
            toast.error('Compense algum item!')
            return;
        }
        if (walletConnected === '') {
            toast.error('Você não está conectado!')
            return
        }

        if (razaoTokenCompensar === '') {
            toast.error('Digite um valor para contribuir!')
            return
        }

        if (maxAmmount) {
            toast.error('Saldo insuficiente!')
            return
        }

        if (connectionType === 'provider') {
            contributeBlockchain();
        } else {
            createTransaction();
        }
    }

    async function contributeBlockchain() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        if (userData.userType === 7) {
            BurnRCSupporter(walletConnected, String(razaoTokenCompensar) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(razaoTokenCompensar, res.hashTransaction)
                    }

                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        } else {
            BurnTokens(walletConnected, String(razaoTokenCompensar) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        registerTokensApi(razaoTokenCompensar, res.hashTransaction)
                    }

                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }
    }

    async function registerTokensApi(tokens, hash) {
        const addData = {
            userData,
            tokens: Number(tokens),
            transactionHash: hash,
            reason: '',
            itens: myList,
            hash
        }

        try {
            await api.post('/tokens-burned', {
                wallet: walletConnected.toUpperCase(),
                tokens: Number(tokens),
                transactionHash: hash,
                carbon: Number(impactToken?.carbon),
                water: Number(impactToken?.water),
                bio: Number(impactToken?.bio),
                soil: Number(impactToken?.soil)
            });

            await api.post('/publication/new', {
                userId: userData?.id,
                type: 'contribute-tokens',
                origin: 'platform',
                additionalData: JSON.stringify(addData),
            })

            if (myList.length > 0) {
                await api.post('/calculator/items/contribution', {
                    userId: userData?.id,
                    items: JSON.stringify(myList)
                })
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingTransaction(false);
        }
    }

    async function createTransaction() {
        try {
            setLoading(true);
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'burn-tokens',
                additionalData: JSON.stringify({
                    value: Number(razaoTokenCompensar),
                    reason: '',
                    itens: myList ? myList : []
                }),
            })
            setCreatedTransaction(true);
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                toast.error('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

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

                    <div className="flex border border-green rounded-md items-center justify-center w-full h-[300px] mt-1">
                        <p className="text-white">Gráfico demonstrativo</p>
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

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 px-2 lg:px-0">
                    <p className="font-bold text-white">Calculadora de impacto</p>

                    <Info
                        text1='Reduzir é obrigação. Regenerar é a solução.'
                        text2='Precisamos deixar de produzir e consumir produtos que destroem o planeta.'
                        text3='Na calculadora, compense os itens que você consumiu/produziu para financiar o impacto equivalente através do Crédito de Regeneração. Caminhe na direção de deixar de usá-los.'
                    />

                    <div className="flex flex-col w-full p-2 rounded-t-md bg-[#0a4303] mt-3 overflow-x-auto">
                        <p className="text-white font-semibold">Itens para compensar</p>

                        <div className="flex w-fit lg:w-full justify-between h-8 bg-blue-700 rounded-t-md py-1 px-3">
                            <div className="flex items-center justify-start w-[150px] lg:w-[40%]">
                                <p className="text-sm font-semibold text-white">Item</p>
                            </div>

                            <div className="flex">
                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Quant.</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Carbono</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Solo</p>
                                </div>

                                <div className="flex items-center justify-center w-20 border-r">
                                    <p className="text-sm font-semibold text-white">Água</p>
                                </div>

                                <div className="flex items-center justify-center w-20">
                                    <p className="text-sm font-semibold text-white">Biod.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col min-h-28 border-b border-green-700 pb-3">
                            {myList.map(item => (
                                <div className="flex w-fit lg:w-full justify-between h-8 py-1 px-3" key={item.id}>
                                    <div className="flex items-center justify-start w-[150px] lg:w-[40%]">
                                        <p className="text-sm font-semibold text-white">{item?.name}</p>
                                    </div>

                                    <div className="flex">
                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">{item?.quant}</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">{Number(item?.quant) * Number(item?.carbon)} kg</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.soil)} m²</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20 border-r">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.water)} m³</p>
                                        </div>

                                        <div className="flex items-center justify-center w-20">
                                            <p className="text-sm font-semibold text-white">-{Number(item?.quant) * Number(item?.bio)} uv</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {myList.length === 0 && (
                                <div className="flex justify-center items-center h-20">
                                    <p className="text-white">Nenhum item adicionado</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full p-2 rounded-b-md bg-[#0a4303]">
                        <div className="flex flex-col gap-3 mt-2 lg:flex-row">
                            <div className="flex flex-col p-2 rounded-md border w-full lg:w-fit">
                                <p className="text-white font-semibold">Cálculo do seu impacto</p>

                                <div className="flex">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white">Carbono: <span className="font-bold">
                                            {myList.length === 0 ? '0 kg' : `${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.carbon)} kg`}
                                        </span>
                                        </p>
                                        <p className="text-white">Solo: <span className="font-bold">
                                            {myList.length === 0 ? '0 m²' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.soil)} m²`}
                                        </span>
                                        </p>
                                        <p className="text-white">Água: <span className="font-bold">
                                            {myList.length === 0 ? '0 m³' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.water)} m³`}
                                        </span>
                                        </p>
                                        <p className="text-white">Biodiversidade: <span className="font-bold">
                                            {myList.length === 0 ? '0 uv' : `-${Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impact?.bio)} uv`}
                                        </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-2 rounded-md border w-full lg:w-fit">
                                <p className="text-white font-semibold">Compense seu impacto</p>

                                <p className="text-white mt-3">Você deve contribuir com</p>
                                <div className="flex items-center p-2 rounded-md bg-green-950 gap-3">
                                    <img
                                        src={require('../../assets/token.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                    <p className="text-white font-semibold">
                                        {myList.length === 0 ? '0 RC' : `${Intl.NumberFormat('pt-BR').format(razaoTokenCompensar)} RC`}
                                    </p>
                                </div>

                                <p className="text-white mt-3">Seu saldo</p>
                                <div className="flex items-center p-2 rounded-md bg-green-950 gap-3">
                                    <img
                                        src={require('../../assets/token.png')}
                                        className="w-8 h-8 object-contain"
                                    />
                                    <p className="text-white font-semibold">
                                        {Intl.NumberFormat('pt-BR').format(balanceData?.balance)} RC
                                    </p>
                                </div>

                                <button
                                    className="text-white font-semibold py-1 mt-2 bg-blue-500 rounded-md"
                                    onClick={handleContribute}
                                >
                                    {loading ? (
                                        <ActivityIndicator size={20} />
                                    ) : (
                                        'Contribuir'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="font-semibold text-white mt-3">Itens que você quer reduzir</p>
                    {itemsToReduce.length === 0 && (
                        <p className="text-white text-center mt-4 mb-8">Você não tem nenhum item para reduzir na sua lista, adicione-os abaixo</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                        {itemsToReduce.map(item => (
                            <Item
                                key={item?.id}
                                data={item}
                                addItem={(itemAdded) => addItemToList(itemAdded)}
                                type='list-items-to-reduce'
                                deleteItem={(item) => deleteItem(item)}
                            />
                        ))}
                    </div>

                    <p className="font-semibold text-white mt-5">Adicione itens a sua lista</p>
                    <div className="flex flex-col gap-3">
                        {items.map(item => (
                            <Item
                                key={item?.id}
                                data={item}
                                addItem={(itemAdded) => addItemToListToReduce(itemAdded)}
                                type='list-items-calculator'
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        toast.success('Contribuição feita com sucesso!');
                        setMyList([]);
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => setCreatedTransaction(false)}
                />
            )}

            <ToastContainer />

            <div className="hidden lg:flex">
                <Feedback />
            </div>
        </div>
    )
}