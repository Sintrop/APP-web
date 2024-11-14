import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ItemReceipt } from './components/ItemReceipts';
import { api } from '../../services/api';
import { ActivityIndicator } from '../../components/ActivityIndicator/ActivityIndicator';
import { Item } from '../ImpactCalculator/components/Item';
import { Helmet } from "react-helmet";
import Chart from 'react-apexcharts';

//services
import { getImage } from '../../services/getImage';
import { ContributeCertificate } from '../../components/Certificates/ContributeCertificate';
import { ProofReduce } from '../Home/components/PublicationItem/ProofReduce';
import { ProofItem } from './components/ProofItem';

export default function AccountInvestor() {
    const width = window.screen.width;
    const { t } = useTranslation();
    const { walletSelected } = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [userData, setUserData] = useState({});
    const [tokens, setTokens] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [impactInvestor, setImpactInvestor] = useState({});
    const [imageProfile, setImageProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [proofsReduce, setProofsReduce] = useState([]);
    const [invoicesThisYear, setInvoicesThisYear] = useState([]);
    const [seriesGraphic, setSeriesGraphic] = useState(null);
    const [configData, setConfigData] = useState(null);

    useEffect(() => {
        getSupporter();
        getReceipts();
        getImpact();
    }, []);

    async function getImpact() {
        let carbon = 0;
        let water = 0;
        let bio = 0;
        let soil = 0;

        const response = await api.get(`/tokens-burned/by-wallet/${walletSelected}`);
        const arrayTokens = response.data.tokensBurned;
        for (var i = 0; i < arrayTokens.length; i++) {
            const tokens = arrayTokens[i].tokens;
            carbon += tokens * arrayTokens[i].carbon;
            water += tokens * arrayTokens[i].water;
            bio += tokens * arrayTokens[i].bio;
            soil += tokens * arrayTokens[i].soil;
        }

        setImpactInvestor({ carbon, water, bio, soil })
    }

    async function getSupporter() {
        setLoading(true);

        const response = await api.get(`/user/${walletSelected}`);
        setUserData(response.data.user);
        getProofs(response.data.user.id);
        getInvoices(response.data.user.id);
        if (response.data.user.imgProfileUrl) {
            getImageProfile(response.data.user.imgProfileUrl);
        }
        if (response.data.user.itemsToReduce) {
            setItemsToReduce(JSON.parse(response.data.user.itemsToReduce));
        }

        const contributions = await api.get(`/web3/contributions/${String(walletSelected).toLowerCase()}`);
        setTokens(contributions.data.tokensBurned);

        setLoading(false);
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    async function getReceipts() {
        //add try catch in future
        let receiptsArray = [];
        const receipts = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS}&address=${walletSelected}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=ACCKTAAXZP7GYX6993CMR7BHQYKI7TJA8Q`);
        if (receipts.data.status === '1') {
            const array = receipts.data.result;
            for (var i = 0; i < array.length; i++) {
                if (array[i].to === '0x0000000000000000000000000000000000000000') {
                    receiptsArray.push(array[i]);
                }
            }
        }
        setReceipts(receiptsArray.reverse())
    }

    async function getProofs(userId) {
        const response = await api.get(`/publications/proof-reduce/${userId}`);
        setProofsReduce(response.data.publications);
    }

    async function getInvoices(userId) {
        const atualYear = new Date().getFullYear();
        const response = await api.get(`/invoices/${userId}/${atualYear}`);
        createGraphic(response.data.invoices)
        setInvoicesThisYear(response.data.invoices);
        formaterItemsToReduce(response.data?.itemsToReduce);
    }

    function formaterItemsToReduce(items) {
        if (items) {
            const array = JSON.parse(items);
            let newArray = [];
            for (var i = 0; i < array.length; i++) {
                newArray.push({ value: array[i].id, label: `${array[i].name} ( ${array[i].unit} )` })
            }
            //setItemsToReduce(newArray);
            //setItemSelect(array[0].id);
        }
    }

    function createGraphic(invoices) {
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
            valuesItem.push(janInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (fevInvoice.length > 0) {
            valuesItem.push(fevInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (marInvoice.length > 0) {
            valuesItem.push(marInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (abrInvoice.length > 0) {
            valuesItem.push(abrInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (maiInvoice.length > 0) {
            valuesItem.push(maiInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (junInvoice.length > 0) {
            valuesItem.push(junInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (julInvoice.length > 0) {
            valuesItem.push(julInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (agoInvoice.length > 0) {
            valuesItem.push(agoInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (setInvoice.length > 0) {
            valuesItem.push(setInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (outInvoice.length > 0) {
            valuesItem.push(outInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (novInvoice.length > 0) {
            valuesItem.push(novInvoice[0].ammountReceived);
        } else {
            valuesItem.push(0);
        }

        if (dezInvoice.length > 0) {
            valuesItem.push(dezInvoice[0].ammountReceived);
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
            name: "Créditos de regeneração",
            data: valuesItem
        }]);
    }

    return (
        <div className="w-full flex flex-col  items-center bg-gradient-to-b from-[#043832] to-[#1F5D38] pt-5 px-2 overflow-x-hidden">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Apoiador - Sintrop</title>
                <link rel="canonical" href={`https://app.sintrop.com/supporter/${String(walletSelected).toLowerCase()}`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>

            <img
                src={require('../../assets/logo-branco.png')}
                className='w-[140px] lg:w-[170px] object-contain'
            />

            {loading ? (
                <div className='flex flex-col items-center h-[100vh] pt-32'>
                    <ActivityIndicator size={180} />
                </div>
            ) : (
                <>
                    <div className='flex flex-col items-center lg:w-[1000px] mt-5 w-full gap-1 lg:px-30 lg:mt-10 bg-[#03364B] rounded-md p-3 lg:items-start'>
                        <div className='flex flex-col items-center gap-2 lg:flex-row'>
                            <img
                                src={imageProfile ? imageProfile : require('../../assets/token.png')}
                                className='h-[150px] w-[150px] lg:h-[200px] lg:w-[200px] object-cover border-4  rounded-full mt-5 lg:mt-0'
                            />

                            <div className='flex flex-col items-center lg:items-start'>
                                <h1 className='font-bold text-center lg:text-2xl text-white'>{userData?.name}</h1>
                                <p className='text-center lg:text-lg text-white max-w-[78%] text-ellipsis overflow-hidden lg:max-w-full'>{walletSelected}</p>
                            </div>
                        </div>

                        <div className='flex flex-col w-full'>
                            <p className='text-white'>{t('contribuiuCom')}</p>
                            <div className='flex gap-3 p-3 bg-[#012939] rounded-md mt-1 w-full'>
                                <img
                                    src={require('../../assets/token.png')}
                                    className='w-14 h-14 object-contain'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-bold text-white text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(tokens)}</p>
                                    <p className='text-sm text-white'>{t('creditosRegen')}</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <h3 className='text-white text-center lg:text-left lg:text-lg mt-10'>{t('impactoContribuicoes')}</h3>
                    <div className='flex flex-col lg:w-[1000px] w-full bg-[#03364B] rounded-md'>
                        <div className='flex items-center justify-center flex-wrap'>
                            <div className='flex flex-col w-[50%]'>
                                <div className='flex flex-col p-5 w-full h-[120px] border-r border-green-700/20'>
                                    <div className='flex flex-col items-start justify-center h-full'>
                                        <p className='font-bold text-green-500 text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactInvestor?.carbon)} kg</p>
                                        <p className='text-white text-xs lg:text-base'>{t('carbono')}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col p-5 w-full h-[120px] border-t border-r border-green-700/20'>
                                    <div className='flex flex-col items-start justify-center h-full'>
                                        <p className='font-bold text-green-500 text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactInvestor?.water)} m³</p>
                                        <p className='text-white text-xs lg:text-base'>{t('agua')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-[50%] borde'>
                                <div className='flex flex-col p-5 w-full h-[120px] border-green-700/20'>
                                    <div className='flex flex-col items-start justify-center h-full'>
                                        <p className='font-bold text-green-500 text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactInvestor?.soil)} m²</p>
                                        <p className='text-white text-xs lg:text-base'>{t('solo')}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col p-5 w-full h-[120px] border-t border-green-700/20'>
                                    <div className='flex flex-col items-start justify-center h-full'>
                                        <p className='font-bold text-green-500 text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(impactInvestor?.bio)} uv</p>
                                        <p className='text-white text-xs lg:text-base'>{t('bio')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className='text-white text-center lg:text-left lg:text-lg mt-10'>{t('evolucaoContribuicoes')}</h3>
                    <div className='flex flex-col lg:w-[1000px] w-full bg-[#03364B] rounded-md overflow-x-auto'>
                        {configData && (
                            <Chart
                                series={seriesGraphic}
                                options={configData}
                                type='line'
                                height={300}
                                width={width >= 1024 ? 1000 : width}
                            />
                        )}
                    </div>

                    <h3 className='text-white text-center lg:text-left lg:text-lg mt-10'>{t('consumoPorItens')}</h3>
                    <div className='flex flex-col lg:w-[1000px] w-full gap-5'>
                        {itemsToReduce.length === 0 && (
                            <p className="text-white text-center my-4">{t('esseUsuarioNaoTemItens')}</p>
                        )}
                        <div className="flex flex-wrap justify-center gap-3 lg:justify-normal">
                            {itemsToReduce.map(item => (
                                <Item
                                    key={item?.id}
                                    data={item}
                                    type='consumption-graph'
                                    hiddenButton
                                    userId={userData?.id}
                                    invoices={invoicesThisYear}
                                />
                            ))}
                        </div>
                    </div>

                    <h3 className=' text-white text-center lg:text-left lg:text-lg mt-10'>{t('provasReducao')}</h3>
                    <div className='flex flex-col lg:w-[1000px] w-full gap-5 lg:gap-5 lg:px-30 bg-[#03364B] rounded-md p-3'>
                        {proofsReduce.length === 0 && (
                            <p className="text-white text-center my-4">{t('nenhumaProvaReducao')}</p>
                        )}

                        <div className='flex items-center gap-5 overflow-x-auto'>
                            {proofsReduce.map(item => (
                                <ProofItem
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </div>
                    </div>

                    <h3 className=' text-white text-center lg:text-left lg:text-lg mt-10'>{t('recibosContribuicao')}</h3>
                    <div className='flex flex-col lg:w-[1000px] w-full gap-3 mb-10'>
                        {receipts.length > 0 && (
                            <>
                                {receipts.map((item, index) => (
                                    <ItemReceipt
                                        key={item.hash}
                                        data={item}
                                        index={index + 1}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}