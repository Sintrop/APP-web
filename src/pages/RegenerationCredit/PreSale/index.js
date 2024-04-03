import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaEyeSlash, FaRegEye, FaChevronRight } from "react-icons/fa";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";
import Chart from 'react-apexcharts';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalReserve } from "./components/ModalReserve";

export function PreSale() {
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
        labels: [`Saldo disponível (${Intl.NumberFormat('pt-BR').format(totalAvaliable)})`, `Reservado (${Intl.NumberFormat('pt-BR').format(totalReserved)})`],
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
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                {loading ? (
                    <ActivityIndicator size={60} />
                ) : (
                    <div className="flex flex-col max-w-[1024px] mt-3">
                        <h3 className="font-bold text-xl text-white">Pré venda</h3>
                        <div className="flex bg-[#0a4303] p-3 rounded-md w-[800px]">
                            <div className="flex flex-col items-center w-[50%]">
                                <Chart
                                    options={options}
                                    series={series}
                                    type="pie"
                                    width="400"
                                />
                            </div>

                            <div className="flex flex-col justify-center w-[50%]">
                                <p className="text-white">Cotação</p>
                                <h3 className="font-bold text-white text-xl mt-1">1 RC = R$ 0,0282</h3>

                                <Dialog.Root open={modalReserve} onOpenChange={(open) => setModalReserve(open)}>
                                    <Dialog.Trigger
                                        className="flex items-center justify-center w-full gap-2 bg-blue-500 font-bold text-white mt-3 rounded-md py-2"
                                    >
                                        <img
                                            src={require('../../../assets/token.png')}
                                            className="w-5 h-5 object-contain"
                                        />
                                        Reservar RC
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
                        </div>

                        <p className="text-gray-400 text-sm mt-5">Reservas feitas</p>
                        {bookings.map(item => (
                            <div className="flex items-center justify-between w-full p-2 rounded-md mb-3 bg-[#0a4303]">
                                <p className="text-white text-sm">{item?.reservedBy}</p>

                                <div className="flex items-center gap-2">
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