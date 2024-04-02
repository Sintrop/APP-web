import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { useParams } from "react-router";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import Chart from "react-apexcharts";
import { UserRankingItem } from "../../Ranking/components/UserRankingItem";
import { ModalTransactionCreated } from "../../../components/ModalTransactionCreated";
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from "../../../components/LoadingTransaction";
import { ToastContainer, toast } from "react-toastify";

import { WithdrawTokens as WithdrawDeveloper } from "../../../services/developersService";
import { WithdrawTokens as WithdrawResearcher } from "../../../services/researchersService";
import { WithdrawTokens as WithdrawProducer } from "../../../services/producerService";
import { WithdrawTokens as WithdrawInspector } from "../../../services/inspectorService";

export function Pools({ }) {
    const { userData, connectionType, walletConnected } = useMainContext();
    const { poolType } = useParams();
    const [loading, setLoading] = useState(false);
    const [poolData, setPoolData] = useState({});
    const [modalQueue, setModalQueue] = useState(false);
    const [visibleWithdraw, setVisibleWithdraw] = useState(true);
    const [canWithdraw, setCanWithdraw] = useState(true);
    const [nextApprove, setNextApprove] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState([]);
    const [modalFeedback, setModalFeedback] = useState(false);
    const [dataGraphic, setDataGraphic] = useState([]);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState(0);
    const [series, setSeries] = useState([44, 55]);
    const [createdTransaction, setCreatedTransaction] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    useEffect(() => {
        getPoolData();
        getUsersPool();
    }, []);

    async function getPoolData() {
        setLoading(true);
        if (poolType === 'producers') {
            const response = await api.get('/web3/pool-producers-data');
            setPoolData(response.data);

            const supply = Number(750000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.data.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.data.balanceContract), Number(withdraw)])

            if (userData?.userType !== 1) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-producer/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }
        }
        if (poolType === 'developers') {
            const response = await api.get('/web3/pool-developers-data');
            setPoolData(response.data);

            const supply = Number(30000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.data.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.data.balanceContract), Number(withdraw)])

            if (userData?.userType !== 4) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-developer/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }

        }
        if (poolType === 'inspectors') {
            const response = await api.get('/web3/pool-inspectors-data');
            setPoolData(response.data);

            const supply = Number(180000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.data.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.data.balanceContract), Number(withdraw)])

            if (userData?.userType !== 2) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-inspector/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }
        }
        if (poolType === 'researchers') {
            const response = await api.get('/web3/pool-researchers-data');
            setPoolData(response.data);

            const supply = Number(30000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.data.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.data.balanceContract), Number(withdraw)])

            if (userData?.userType !== 3) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-researcher/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }
        }
        if (poolType === 'validators') {
            const response = await api.get('/web3/pool-validators-data');
            setPoolData(response.data);

            const supply = Number(30000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.data.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.data.balanceContract), Number(withdraw)])

            if (userData?.userType !== 8) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-validators/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.canWithdraw);
                setNextApprove(response2.data.nextAprove);
            }
        }
        // validadores fazer a pool
        // ativistas fazer a pool
        setLoading(false);
    }

    async function getUsersPool() {
        setLoadingUsers(true);

        if (poolType === 'developers') {
            const response = await api.get(`/web3/users-pool/developers`)
            setUsers(response.data.users);
        }

        if (poolType === 'producers') {
            const response = await api.get(`/web3/users-pool/producers`)
            setUsers(response.data.users);
        }

        if (poolType === 'inspectors') {
            const response = await api.get(`/web3/users-pool/inspectors`)
            setUsers(response.data.users);
        }

        if (poolType === 'researchers') {
            const response = await api.get(`/web3/users-pool/researchers`)
            setUsers(response.data.users);
        }

        if (poolType === 'validators') {
            const response = await api.get(`/web3/users-pool/validators`)
            setUsers(response.data.users);
        }

        setLoadingUsers(false);
    }

    function handleWithdraw() {
        if (connectionType === 'provider') {
            withdrawOnBlockchain();
        } else {
            withdrawOnCheckout();
        }
    }

    async function withdrawOnCheckout() {
        try {
            setLoading(true);
            await api.post('/transactions-open/create', {
                wallet: userData?.wallet,
                type: 'withdraw-tokens'
            });
            setCreatedTransaction(true);
        } catch (err) {
            if (err.response?.data?.message === 'open transaction of the same type') {
                alert('Você já tem uma transação do mesmo tipo em aberto! Finalize ou descarte ela no checkout!')
            }
        } finally {
            setLoading(false)
        }
    }

    async function withdrawOnBlockchain() {
        if (userData?.userType === 4) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawDeveloper(walletConnected)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction
                            }),
                        });
                        toast.success('Saque realizado com sucesso!');
                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
                            hash: ''
                        })
                        return;
                    }
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }

        if (userData?.userType === 1) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawProducer(walletConnected)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction
                            }),
                        });
                        toast.success('Saque realizado com sucesso!');
                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
                            hash: ''
                        })
                        return;
                    }
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }

        if (userData?.userType === 2) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawInspector(walletConnected)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction
                            }),
                        });
                        toast.success('Saque realizado com sucesso!');
                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
                            hash: ''
                        })
                        return;
                    }
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }

        if (userData?.userType === 3) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawResearcher(walletConnected)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction
                            }),
                        });
                        toast.success('Saque realizado com sucesso!');
                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
                            hash: ''
                        })
                        return;
                    }
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }
    }

    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Saldo disponível', 'Já sacado'],
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
        }

    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20">
                <div className="flex flex-col max-w-[1024px]">
                    {loading ? (
                        <div className="flex justify-center mt-3">
                            <ActivityIndicator size={60} />
                        </div>
                    ) : (
                        <div className="flex flex-col mt-3">
                            <h3 className="font-bold text-xl text-white">
                                {poolType === 'producers' && 'Pool dos produtores'}
                                {poolType === 'developers' && 'Pool dos desenvolvedores'}
                                {poolType === 'inspectors' && 'Pool dos inspetores'}
                                {poolType === 'researchers' && 'Pool dos pesquisadores'}
                                {poolType === 'validators' && 'Pool dos validadores'}
                            </h3>
                            <div className="p-3 rounded-md bg-[#0a4303] flex min-w-[800px] w-full">
                                <div className="w-[50%] flex flex-col">
                                    <Chart
                                        options={options}
                                        series={series}
                                        type="pie"
                                        width="400"
                                    />
                                </div>

                                <div className="w-[50%] flex flex-col gap-3">
                                    <div className="bg-green-950 flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">Saldo disponível</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.balanceContract))}</p>
                                    </div>

                                    <div className="bg-green-950 flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">Tokens por ERA</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.tokensPerEra))}</p>
                                    </div>

                                    <div className="bg-green-950 flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">ERA atual do contrato</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.currentEraContract))}</p>
                                    </div>
                                </div>
                            </div>

                            {visibleWithdraw && (
                                <div className="flex items-center justify-between w-full bg-[#0a4303] rounded-md p-3 mt-3">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-white">Próximo saque em</p>
                                        <p className="text-lg text-blue-500 font-bold">{nextApprove < 0 ? 'Você pode sacar' : `${Intl.NumberFormat('pt-BR').format(Number(nextApprove))} blocos`}</p>
                                    </div>

                                    {nextApprove < 0 && (
                                        <button className="font-bold text-white px-3 py-1 rounded-md bg-blue-500" onClick={handleWithdraw}>
                                            Sacar tokens
                                        </button>
                                    )}
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mt-5">Usuários aprovados</p>
                            <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                                {users.map(item => (
                                    <UserRankingItem data={item} />
                                ))}
                            </div>
                        </div>

                    )}
                </div>
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
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

            <ToastContainer/>
        </div>
    )
}