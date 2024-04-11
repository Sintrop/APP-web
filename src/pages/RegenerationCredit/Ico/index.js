import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FaEyeSlash, FaRegEye, FaChevronRight } from "react-icons/fa";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";
import Chart from 'react-apexcharts';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalBuyRc } from "./components/ModalBuyRc";
import { ModalTransactionCreated } from "../../../components/ModalTransactionCreated";
import { TopBar } from "../../../components/TopBar";

export function Ico() {
    const [icoData, setIcoData] = useState({});
    const [loading, setLoading] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState(0);
    const [totalAvaliable, setTotalAvaliable] = useState(0);
    const [series, setSeries] = useState([]);
    const [modalBuy, setModalBuy] = useState(false);
    const [createdTransaction, setCreatedTransaction] = useState(false);


    useEffect(() => {
        getIcoData();
    }, []);

    async function getIcoData() {
        setLoading(true);
        const response = await api.get('/ico-data');
        setIcoData(response.data);

        const supply = 124500000;
        const withdraw = supply - Number(response.data.balance);
        
        setTotalAvaliable(Number(response.data.balance))
        setTotalSupply(supply);
        setTotalWithdraw(withdraw);
        setSeries([Number(response.data.balance), Number(withdraw)])
        setLoading(false);
    }

    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: [`Saldo disponível (${Intl.NumberFormat('pt-BR').format(totalAvaliable)})`, `Vendido (${Intl.NumberFormat('pt-BR').format(totalWithdraw)})`],
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

            <div className="flex flex-col items-center w-full pt-32 overflow-auto">
                {loading ? (
                    <ActivityIndicator size={60} />
                ) : (
                    <div className="flex flex-col max-w-[1024px] mt-3">
                        <h3 className="font-bold text-xl text-white">ICO - Initial Coin Offer</h3>
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
                                <h3 className="font-bold text-white text-xl mt-1">1 RC = 0,0000125 ETH</h3>

                                <Dialog.Root open={modalBuy} onOpenChange={(open) => setModalBuy(open)}>
                                    <Dialog.Trigger
                                        className="flex items-center justify-center w-full gap-2 bg-blue-500 font-bold text-white mt-3 rounded-md py-2"
                                    >
                                        <img
                                            src={require('../../../assets/token.png')}
                                            className="w-5 h-5 object-contain"
                                        />
                                        Comprar RC
                                    </Dialog.Trigger>

                                    <ModalBuyRc
                                        close={(success) => {
                                            setModalBuy(false);
                                            if(success){
                                                setCreatedTransaction(true);
                                            }
                                        }}
                                    />
                                </Dialog.Root>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {createdTransaction && (
                <ModalTransactionCreated
                    close={() => setCreatedTransaction(false)}
                />
            )}
        </div>
    )
}