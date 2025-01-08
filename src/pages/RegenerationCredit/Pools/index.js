import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header/header";
import { useParams } from "react-router";
import { api } from "../../../services/api";
import { useMainContext } from "../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../components/ActivityIndicator/ActivityIndicator";
import Chart from "react-apexcharts";
import { UserRankingItem } from "../../Community/Ranking/components/UserRankingItem";
import { ToastContainer, toast } from "react-toastify";
import { ModalWhereExecuteTransaction } from "../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";

import { TopBar } from "../../../components/TopBar";
import { Info } from "../../../components/Info";
import { useTranslation } from "react-i18next";
import { getProducersPoolData } from "../../../services/pools/producers";
import { getInspectorsPoolData } from "../../../services/pools/inspectors";
import { getResearchersPoolData } from "../../../services/pools/researchers";
import { getDevelopersPoolData } from "../../../services/pools/developers";

export function Pools() {
    const {t} = useTranslation();
    const { userData, userBlockchain, getUserBlockchainData} = useMainContext();
    const { poolType } = useParams();
    const [loading, setLoading] = useState(true);
    const [poolData, setPoolData] = useState({});
    const [visibleWithdraw, setVisibleWithdraw] = useState(true);
    const [canWithdraw, setCanWithdraw] = useState(true);
    const [nextApprove, setNextApprove] = useState(0);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState([]);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState(0);
    const [series, setSeries] = useState([44, 55]);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);

    useEffect(() => {
        getPoolData();
        getUsersPool();
    }, []);

    async function getPoolData() {
        setLoading(true);
        if (poolType === 'producers') {
            const response = await getProducersPoolData();            
            if(!response.success || !response.poolData){
                return
            }

            setPoolData(response.poolData);

            const supply = Number(750000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.poolData.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.poolData.balanceContract), Number(withdraw)])

            if (userData?.userType !== 1) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-producer/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }
        }
        if (poolType === 'developers') {
            const response = await getDevelopersPoolData();            
            if(!response.success || !response.poolData){
                return
            }

            setPoolData(response.poolData);

            const supply = Number(30000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.poolData.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.poolData.balanceContract), Number(withdraw)])

            if (userData?.userType !== 4) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-developer/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }

        }
        if (poolType === 'inspectors') {
            const response = await getInspectorsPoolData();            
            if(!response.success || !response.poolData){
                return
            }

            setPoolData(response.poolData);

            const supply = Number(180000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.poolData.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.poolData.balanceContract), Number(withdraw)])

            if (userData?.userType !== 2) {
                setVisibleWithdraw(false);
            } else {
                const response2 = await api.get(`/web3/next-aprove-inspector/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
                setNextApprove(response2.data.nextAprove);
            }
        }
        if (poolType === 'researchers') {
            const response = await getResearchersPoolData();            
            if(!response.success || !response.poolData){
                return
            }

            setPoolData(response.poolData);

            const supply = Number(30000000000000000000000000 / 10 ** 18).toFixed(0);
            const withdraw = supply - Number(response.poolData.balanceContract);

            setTotalSupply(supply);
            setTotalWithdraw(withdraw);
            setSeries([Number(response.poolData.balanceContract), Number(withdraw)])

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
                const response2 = await api.get(`/web3/next-aprove-validator/${String(userData?.wallet).toLowerCase()}`)
                setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
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
        setShowModalWhereExecuteTransaction(true);
    }

    function successWithdraw(successType){
        setShowModalWhereExecuteTransaction(false);
        if(successType === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }

        if(successType === 'blockchain'){
            toast.success('Saque realizado com sucesso!');
            getUserBlockchainData(userData?.wallet, userData?.userType);
            getPoolData();
            getUsersPool();
            
        }
    }

    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: [t('saldoDisponivel'), t('jaSacado')],
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
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full lg:pt-32 pt-10 lg:pb-5 pb-20 overflow-y-auto">
                <div className="flex flex-col w-full lg:w-[1024px] px-2 lg:px-0">
                    {loading ? (
                        <div className="flex justify-center items-center mt-3 h-[90vh]">
                            <ActivityIndicator size={180} />
                        </div>
                    ) : (
                        <div className="flex flex-col mt-3">
                            <h3 className="font-bold text-xl text-white mb-1">
                                {poolType === 'producers' && t('poolProdutores')}
                                {poolType === 'developers' && t('poolDesenvolvedores')}
                                {poolType === 'inspectors' && t('poolInspetores')}
                                {poolType === 'researchers' && t('poolPesquisadores')}
                                {poolType === 'validators' && t('poolValidadores')}
                            </h3>

                            {poolType === 'producers' && (
                                <Info
                                    text1='O(a) produtor(a) para ser aprovado precisa atender todos os requisitos abaixo:'
                                    text2='- Mínimo de 3 inspeções concluídas;'
                                    text3='- Score de regeneração positivo;'
                                    text4='- Ter recebido pelo menos 1 inspeção na ERA anterior.'
                                />
                            )}

                            {poolType === 'inspectors' && (
                                <Info
                                    text1='O(a) inspetor(a) para ser aprovado precisa atender todos os requisitos abaixo:'
                                    text2='- Mínimo de 3 inspeções concluídas;'
                                    text3='- Mínimo de 1 inspeções realizada na ERA anterior;'
                                    text4='- Máximo de 3 desistências;'
                                    text5='- Máximo de 3 inspeções penalizadas.'
                                />
                            )}

                            {poolType === 'researchers' && (
                                <Info
                                    text1='O(a) pesquisador(a) para ser aprovado precisa ter publicado pelo menos 1 pesquisa na era anterior.'
                                />
                            )}

                            {poolType === 'developers' && (
                                <Info
                                    text1='O(a) desenvolvedor(a) para ser aprovado precisa ter publicado o relatório de contribuição na era anterior.'
                                />
                            )}

                            <div className="p-3 rounded-md bg-[#03364B] flex flex-col w-full lg:min-w-[800px] mt-2 lg:flex-row">
                                <div className="w-full lg:w-[50%] flex flex-col">
                                    <Chart
                                        options={options}
                                        series={series}
                                        type="pie"
                                        width="400"
                                    />
                                </div>

                                <div className="w-full lg:w-[50%] flex flex-col gap-3">
                                    <div className="bg-[#012939] flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">{t('saldoDisponivel')}</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.balanceContract))}</p>
                                    </div>

                                    <div className="bg-[#012939] flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">{t('tokenPorEra')}</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.tokensPerEra))}</p>
                                    </div>

                                    <div className="bg-[#012939] flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">{t('eraContrato')}</p>
                                        <p className="text-white font-bold">{Intl.NumberFormat('pt-BR').format(Number(poolData?.currentEra))}</p>
                                    </div>

                                    <div className="bg-[#012939] flex flex-col p-2 rounded-md w-full border-2 border-white">
                                        <p className="text-white text-sm">{t('epocaAtual')}</p>
                                        <p className="text-white font-bold">{poolData?.epoch}</p>
                                    </div>
                                </div>
                            </div>

                            {visibleWithdraw && (
                                <>
                                    <div className="flex flex-wrap items-center justify-between w-full bg-[#03364B] rounded-md p-3 mt-3 gap-3 mb-3">
                                        <div className="flex flex-col h-full w-[49%] gap-1 lg:border-r">
                                            <p className="text-xs text-gray-300">{t('seusDadosNaPool')}</p>
                                            <p className="text-white text-sm mt-1">
                                                {t('suaEraNaPool')}: <span className="font-bold text-blue-primary">{userBlockchain?.pool?.currentEra}</span>
                                            </p>
                                            <p className="text-white text-sm">
                                                {t('eraAtualDaPool')}: <span className="font-bold text-blue-primary">{poolData?.currentEraContract}</span>
                                            </p>
                                            <p className="text-white text-sm">
                                                {t('saquesDisponiveis')}: <span className="font-bold text-blue-primary">{poolData?.currentEraContract - userBlockchain?.pool?.currentEra}</span>
                                            </p>
                                        </div>

                                        <div className="flex justify-between h-full w-[49%]">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-white">{t('proximoSaque')}</p>
                                                <p className="text-lg text-blue-500 font-bold">{nextApprove < 0 ? t('vocePodeSacar') : `${Intl.NumberFormat('pt-BR').format(Number(nextApprove))} ${t('blocos')}`}</p>
                                            </div>
                                            {nextApprove < 0 && (
                                                <button className="font-bold text-white px-3 py-1 rounded-md bg-blue-500" onClick={handleWithdraw}>
                                                    {t('sacarTokens')}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <Info
                                        text1={t('textInfoSaquesDisponiveis')}
                                    />
                                </>
                            )}

                            <p className="text-sm text-gray-500 mt-5">{t('usuariosAprovados')}</p>
                            <div className={`flex gap-3 flex-wrap max-w-[1024px] mt-3 ${users.length < 4 ? 'justify-center lg:justify-start': 'justify-center'}`}>
                                {users.map(item => (
                                    <UserRankingItem data={item} />
                                ))}
                            </div>
                        </div>

                    )}
                </div>
            </div>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData=''
                    transactionType='withdraw-tokens'
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successWithdraw}
                />
            )}

            <ToastContainer/>
        </div>
    )
}