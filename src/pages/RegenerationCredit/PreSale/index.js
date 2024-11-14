import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header/header";
import { FaMobile } from "react-icons/fa";
import { MdVideoCall } from "react-icons/md";
import { SiGooglesheets, SiReadthedocs } from "react-icons/si";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";
import Chart from 'react-apexcharts';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalReserve } from "./components/ModalReserve";
import { useCountdown } from '../../../hooks/useCountdown';
import { TopBar } from "../../../components/TopBar";
import { useTranslation } from "react-i18next";

export function PreSale() {
    const {t} = useTranslation();
    const { walletConnected } = useMainContext();
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [icoData, setIcoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState(0);
    const [totalAvaliable, setTotalAvaliable] = useState(0);
    const [totalReserved, setTotalReserved] = useState(0);
    const [series, setSeries] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [modalReserve, setModalReserve] = useState(false);


    useEffect(() => {
        getPreSaleData();
    }, []);

    async function getPreSaleData() {
        setLoading(true);
        const response = await api.get('/quotes');
        const resBookings = response.data.quotes;

        setBookings(resBookings);

        let totalReserved = 0;

        for (var i = 0; i < resBookings.length; i++) {
            totalReserved += Number(resBookings[i].value);
        }

        const supply = 39000000;
        const avaliable = supply - Number(totalReserved);

        setSeries([avaliable, Number(totalReserved)])
        setTotalAvaliable(avaliable)
        setTotalSupply(supply);
        setTotalReserved(totalReserved);
        setLoading(false);
    }

    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: [`Tokens disponíveis (${Intl.NumberFormat('pt-BR').format(totalAvaliable)})`, `Reservado (${Intl.NumberFormat('pt-BR').format(totalReserved)})`],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                },
            }
        }],
        legend: {
            position: 'bottom',
            labels: {
                colors: '#fff'
            }
        },
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto px-2 lg:px-0">
                {loading ? (
                    <div className="flex items-center h-[100vh]">
                        <ActivityIndicator size={180} />
                    </div>
                ) : (
                    <div className="flex flex-col w-full lg:max-w-[1024px] lg:w-auto mt-3">
                        <div className="flex flex-col bg-[#0a4303] p-2 rounded-md lg:w-[900px] lg:h-[500px]">
                            <div className="flex flex-col items-center bg-presale bg-center bg-cover bg-no-repeat p-3 rounded-md w-full h-full lg:flex-row">
                                <div className="flex flex-col justify-center w-full mt-5 lg:mt-0 lg:w-[50%]">
                                    <h3 className="font-bold text-center lg:text-left lg:text-4xl text-white">{t('pre-venda')}</h3>
                                    <h3 className="font-bold text-center lg:text-left lg:text-3xl text-white">{t('cr')}</h3>
                                    <p className="text-center text-sm text-white mt-5">{t('essaOfertaEncerra')} (25/06/2024)</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="flex flex-col p-2 rounded-md bg-green-200/50 w-16 items-center">
                                            <p className="font-bold text-white text-xl">0</p>
                                            <p className="text-center text-xs text-white">Dias</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-green-200/50 w-16 items-center">
                                            <p className="font-bold text-white text-xl">0</p>
                                            <p className="text-center text-xs text-white">Horas</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-green-200/50 w-16 items-center">
                                            <p className="font-bold text-white text-xl">0</p>
                                            <p className="text-center text-xs text-white">Minutos</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-green-200/50 w-16 items-center">
                                            <p className="font-bold text-white text-xl">0</p>
                                            <p className="text-center text-xs text-white">Segundos</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col border border-green-500 bg-[rgba(0,0,0,0.6)] rounded-md p-2 gap-1 mt-3">
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">{t('tokensOfertados')}</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">39.000.000</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">{t('%ofertaPrivada')}</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">9,12 %</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">{t('valorUnitario')}</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">R$ 0,0282</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">{t('alvoCapitalizacao')}</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">R$ 1.100.000,00</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">{t('capitalizacaoMercado')}</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">R$ 12.057.692,31</p>
                                        </div>
                                    </div>

                                    <Dialog.Root open={modalReserve} onOpenChange={(open) => setModalReserve(open)}>
                                        <Dialog.Trigger
                                            className="flex items-center justify-center w-full gap-2 bg-orange-500 font-bold text-white mt-3 rounded-md py-2"
                                        >
                                            <img
                                                src={require('../../../assets/token.png')}
                                                className="w-5 h-5 object-contain"
                                            />
                                            {t('listaEspera')}
                                        </Dialog.Trigger>

                                        <ModalReserve
                                            reserved={(data) => {
                                                bookings.push(data);
                                                setTimeout(() => {
                                                    setModalReserve(false);
                                                    alert('voceEntrouListaEspera')
                                                }, 2000);
                                            }}
                                        />
                                    </Dialog.Root>
                                </div>
                                <div className="flex flex-col items-center w-full mt-5 lg:mt-0 lg:w-[50%]">
                                    <Chart
                                        options={options}
                                        series={series}
                                        type="pie"
                                        width="400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-[#0a4303] p-3 rounded-md lg:w-[900px] mt-3">
                            <p className="text-xs text-white">{t('preVendaDesc1')} </p>
                            <p className="text-xs text-white mt-2">{t('preVendaDesc2')}</p>
                        </div>

                        <div className="flex flex-col bg-[#0a4303] p-3 rounded-md lg:w-[900px] mt-3">
                            <p className="text-xs text-gray-400">Links</p>
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                                <a
                                    href='https://docs.google.com/presentation/d/1ioehpLRKNhgCp0QruvDINKdQl_nooPXTPCNOkwOl6t0'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <HiOutlinePresentationChartLine size={25} color='white' />
                                    <p className="font-bold text-white text-sm">{t('apresentacao')}</p>
                                </a>

                                <a
                                    href='https://calendly.com/andre-sintrop/agendar'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <MdVideoCall size={25} color='white' />
                                    <p className="font-bold text-white text-sm">{t('agendarReuniao')}</p>
                                </a>

                                <a
                                    href='https://docs.sintrop.com/suporte/acoes/apoiador/pre-venda-dos-tokens'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiReadthedocs size={25} color='white' />
                                    <p className="font-bold text-white text-sm">Tutorial</p>
                                </a>

                                <a
                                    href='https://www.sintrop.com/assets/qr-code/whitepaper.pdf'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiGooglesheets size={25} color='white' />
                                    <p className="font-bold text-white text-sm">Whitepaper (pt-BR)</p>
                                </a>

                                <a
                                    href='https://www.sintrop.com/assets/qr-code/whitepaper-EN.pdf'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiGooglesheets size={25} color='white' />
                                    <p className="font-bold text-white text-sm">Whitepaper (en-US)</p>
                                </a>

                                <a
                                    href='https://www.sintrop.com/app'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <FaMobile size={25} color='white' />
                                    <p className="font-bold text-white text-sm">App mobile</p>
                                </a>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <iframe 
                                width="900" 
                                height="400" 
                                src="https://www.youtube.com/embed/fG8SjM_U5M8?si=QDT8ZJIK_smsFx9X" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>
                            </iframe>
                        </div>

                        <div className="mt-3">
                            <iframe 
                                width="900" 
                                height="400" 
                                src="https://www.youtube.com/embed/eNGsss9mrd0?si=kSP1PbYh440bAGjT" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>
                            </iframe>
                        </div>

                        <p className="text-gray-400 text-sm mt-5">{t('reservasFeitas')}</p>
                        {bookings.map(item => (
                            <div className="flex flex-col lg:flex-row items-center lg:justify-between w-full p-2 rounded-md mb-3 bg-[#0a4303]">
                                <p className="text-white text-xs lg:text-sm">{item?.reservedBy}</p>

                                <div className="flex items-center gap-2 mt-3 lg:mt-0">
                                    <img
                                        src={require('../../../assets/token.png')}
                                        className="w-5 h-5 object-contain"
                                    />

                                    <p className="font-bol text-blue-500 text-sm font-bold">{Intl.NumberFormat('pt-BR').format(item?.value)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}