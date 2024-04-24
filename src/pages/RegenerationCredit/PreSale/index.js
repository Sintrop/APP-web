import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaEyeSlash, FaRegEye, FaChevronRight, FaMobile } from "react-icons/fa";
import { SiGooglesheets, SiReadthedocs } from "react-icons/si";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";
import Chart from 'react-apexcharts';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalReserve } from "./components/ModalReserve";
import {useCountdown} from '../../../hooks/useCountdown';
import { TopBar } from "../../../components/TopBar";

export function PreSale() {
    const [day, hour, minute, second] = useCountdown('2024-06-25 23:59:59');
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
            <TopBar/>
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
                                    <h3 className="font-bold text-center lg:text-left lg:text-4xl text-white">PRÉ-VENDA</h3>
                                    <h3 className="font-bold text-center lg:text-left lg:text-3xl text-white">Crédito de Regeneração</h3>
                                    <p className="text-center text-sm text-white mt-5">Essa oferta encerra em (25/06/2024)</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="flex flex-col p-2 rounded-md bg-orange-500 w-16 items-center">
                                            <p className="font-bold text-white text-xl">{day}</p>
                                            <p className="text-center text-xs text-white">Dias</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-orange-500 w-16 items-center">
                                            <p className="font-bold text-white text-xl">{hour}</p>
                                            <p className="text-center text-xs text-white">Horas</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-orange-500 w-16 items-center">
                                            <p className="font-bold text-white text-xl">{minute}</p>
                                            <p className="text-center text-xs text-white">Minutos</p>
                                        </div>
                                        <div className="flex flex-col p-2 rounded-md bg-orange-500 w-16 items-center">
                                            <p className="font-bold text-white text-xl">{second}</p>
                                            <p className="text-center text-xs text-white">Segundos</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col border border-green-500 bg-[rgba(0,0,0,0.6)] rounded-md p-2 gap-1 mt-3">
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">Tokens ofertados</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">39.000.000</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">% da oferta privada</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">9,12 %</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">Valor unitário</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">R$ 0,0282</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">Alvo de capitalização</h3>
                                            <p className="font-bold text-green-500 text-sm lg:text-base">R$ 1.100.000,00</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <h3 className="text-gray-200 text-xs lg:text-sm">Capitalização de mercado</h3>
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
                                            QUERO INVESTIR
                                        </Dialog.Trigger>

                                        <ModalReserve
                                            reserved={(data) => {
                                                bookings.push(data);
                                                setTimeout(() => {
                                                    setModalReserve(false);
                                                    alert('Reserva feita com sucesso! Em breve nossa equipe entrará em contato para alinhar os próximos passos.')
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
                            <p className="text-xs text-white">Convidamos pessoas que se importam com a regeneração do Planeta para ter acesso a uma oportunidade de investimento em um criptoativo verde, com a ambição de ajudar o Planeta e trazer ganhos econômicos ao mesmo tempo. </p>
                            <p className="text-xs text-white mt-2">O problema que almejamos é resolver é a falta de incentivo econômico para a regeneração de ecossistemas. O crédito de carbono é um sistema que não oferece a solução que a humanidade necessita para enfrentar os gigantes desafios que tem pela frente, com o advento do aquecimento global e esgotamento dos recursos naturais. Nossa solução é o Crédito de Regeneração, criptoativo descentralizado de recompensa por serviços ambientais. Uma solução baseada na Natureza, totalmente inovadora, com uma metodologia de certificação descentralizada inédita e com a utilização da tecnologia da blockchain, trazendo transparência sobre os dados e confiança em contratos inteligentes.</p>
                        </div>

                        <div className="flex flex-col bg-[#0a4303] p-3 rounded-md lg:w-[900px] mt-3">
                            <p className="text-xs text-gray-400">Links</p>
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                                <a 
                                    href='https://docs.sintrop.com/suporte/acoes/apoiador/pre-venda-dos-tokens'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiReadthedocs size={25} color='white'/>
                                    <p className="font-bold text-white text-sm">Tutorial</p>
                                </a>

                                <a 
                                    href='https://www.sintrop.com/assets/qr-code/whitepaper.pdf'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiGooglesheets size={25} color='white'/>
                                    <p className="font-bold text-white text-sm">Whitepaper (pt-BR)</p>
                                </a>

                                <a 
                                    href='https://www.sintrop.com/assets/qr-code/whitepaper-EN.pdf'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <SiGooglesheets size={25} color='white'/>
                                    <p className="font-bold text-white text-sm">Whitepaper (en-US)</p>
                                </a>

                                <a 
                                    href='https://www.sintrop.com/app'
                                    target="_blank"
                                    className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                >
                                    <FaMobile size={25} color='white'/>
                                    <p className="font-bold text-white text-sm">App mobile</p>
                                </a>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mt-5">Reservas feitas</p>
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