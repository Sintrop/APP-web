import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { api } from "../../../../../services/api";
import { useTranslation } from "react-i18next";
import { Info } from '../../../../../components/Info';
import { PoolDataProps } from "../../../../../models/Pool/types";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { toast } from "react-toastify";

export function WithdrawTokens() {
    const { t } = useTranslation();
    //@ts-ignore
    const { userData, userBlockchain, getUserBlockchainData } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [poolData, setPoolData] = useState({} as PoolDataProps);
    const [canWithdraw, setCanWithdraw] = useState(true);
    const [nextApprove, setNextApprove] = useState(0);

    useEffect(() => {
        getPoolData();
    }, []);

    async function getPoolData() {
        setLoading(true);
        if (userData?.userType === 1) {
            const response = await api.get('/web3/pool-producers-data');
            setPoolData(response.data);

            const response2 = await api.get(`/web3/next-aprove-producer/${String(userData?.wallet).toLowerCase()}`)
            setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
            setNextApprove(response2.data.nextAprove);

        }

        if (userData?.userType === 2) {
            const response = await api.get('/web3/pool-inspectors-data');
            setPoolData(response.data);

            const response2 = await api.get(`/web3/next-aprove-inspector/${String(userData?.wallet).toLowerCase()}`)
            setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
            setNextApprove(response2.data.nextAprove);
        }

        if (userData?.userType === 3) {
            const response = await api.get('/web3/pool-researchers-data');
            setPoolData(response.data);

            const response2 = await api.get(`/web3/next-aprove-researcher/${String(userData?.wallet).toLowerCase()}`)
            setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
            setNextApprove(response2.data.nextAprove);
        }

        if (userData?.userType === 4) {
            const response = await api.get('/web3/pool-developers-data');
            setPoolData(response.data);

            const response2 = await api.get(`/web3/next-aprove-developer/${String(userData?.wallet).toLowerCase()}`)
            setCanWithdraw(response2.data.nextAprove < 0 ? true : false);
            setNextApprove(response2.data.nextAprove);
        }

        if (userData?.userType === 8) {
            const response = await api.get('/web3/pool-validators-data');
            setPoolData(response.data);


            const response2 = await api.get(`/web3/next-aprove-validators/${String(userData?.wallet).toLowerCase()}`)
            setCanWithdraw(response2.data.canWithdraw);
            setNextApprove(response2.data.nextAprove);
        }
        // validadores fazer a pool
        // ativistas fazer a pool
        setLoading(false);
    }

    function handleWithdraw(){
        setShowModalWhereExecuteTransaction(true);
    }

    function successWithdraw(type: string){
        setShowModalWhereExecuteTransaction(false);
        if(type === 'blockchain'){
            getPoolData();
            getUserBlockchainData(userData?.wallet, userData?.userType)
        }
        if(type === 'checkout'){
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return (
        <div>
            <h3 className='font-bold text-white text-center text-lg mb-3'>Sacar tokens</h3>

            {loading ? (
                <ActivityIndicator size={70}/>
            ) : (
                <>
                    <div className="flex flex-col w-full mb-3">
                        <div className="flex flex-col h-full w-full gap-1 border-b pb-3">
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
        
                        <div className="flex justify-between h-full w-full mt-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-white">{t('proximoSaque')}</p>
                                <p className="text-lg text-blue-500 font-bold">{nextApprove < 0 ? t('vocePodeSacar') : `${Intl.NumberFormat('pt-BR').format(Number(nextApprove))} ${t('blocos')}`}</p>
                            </div>
        
                            {canWithdraw && (
                                <button className="font-bold text-white px-3 h-12 rounded-md bg-blue-500" onClick={handleWithdraw}>
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

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData=""
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successWithdraw}
                    transactionType="withdraw-tokens"
                />
            )}
        </div>
    )
}