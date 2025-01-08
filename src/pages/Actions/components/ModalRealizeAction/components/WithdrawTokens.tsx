import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";
import { Info } from '../../../../../components/Info';
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { toast } from "react-toastify";
import { getNextWithdrawValidator, getValidatorsPoolData } from "../../../../../services/pools/validators";
import { BasicDataPoolProps } from "../../../../../types/pools";
import { getNextWithdrawProducer, getProducersPoolData } from "../../../../../services/pools/producers";
import { getInspectorsPoolData, getNextWithdrawInspector } from "../../../../../services/pools/inspectors";
import { getNextWithdrawResearcher, getResearchersPoolData } from "../../../../../services/pools/researchers";
import { getDevelopersPoolData, getNextWithdrawDeveloper } from "../../../../../services/pools/developers";
import { getContributorsPoolData, getNextWithdrawContributor } from "../../../../../services/pools/contributors";
import { getActivitsPoolData, getNextWithdrawActivist } from "../../../../../services/pools/activists";

export function WithdrawTokens() {
    const { t } = useTranslation();
    //@ts-ignore
    const { userData, userBlockchain, getUserBlockchainData, userTypeConnected, walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [poolData, setPoolData] = useState({} as BasicDataPoolProps);
    const [canWithdraw, setCanWithdraw] = useState(true);
    const [nextApprove, setNextApprove] = useState(0);

    useEffect(() => {
        getPoolData();
    }, []);

    async function getPoolData() {
        setLoading(true);
        if (userTypeConnected === 1) {
            const response = await getProducersPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawProducer(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 2) {
            const response = await getInspectorsPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawInspector(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 3) {
            const response = await getResearchersPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawResearcher(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 4) {
            const response = await getDevelopersPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawDeveloper(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 5) {
            const response = await getContributorsPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawContributor(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 6) {
            const response = await getActivitsPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawActivist(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }

        if (userTypeConnected === 8) {
            const response = await getValidatorsPoolData();            
            if(!response.success || !response.poolData){
                setLoading(false);
                return
            }
            setPoolData(response.poolData);

            const response2 = await getNextWithdrawValidator(walletConnected);
            if (response2.success) {
                setCanWithdraw(response2.nextWithdraw < 0 ? true : false);
                setNextApprove(response2.nextWithdraw);
            }
        }
        setLoading(false);
    }

    function handleWithdraw() {
        setShowModalWhereExecuteTransaction(true);
    }

    function successWithdraw(type: string) {
        setShowModalWhereExecuteTransaction(false);
        if (type === 'blockchain') {
            getPoolData();
            getUserBlockchainData(userData?.wallet, userData?.userType)
        }
        if (type === 'checkout') {
            toast.success(t('transacaoEnviadaCheckout'));
        }
    }

    return (
        <div>
            <h3 className='font-bold text-white text-center text-lg mb-3'>Sacar tokens</h3>

            {loading ? (
                <ActivityIndicator size={70} />
            ) : (
                <>
                    <div className="flex flex-col w-full mb-3">
                        <div className="flex flex-col h-full w-full gap-1 border-b pb-3">
                            <p className="text-xs text-gray-300">{t('seusDadosNaPool')}</p>
                            <p className="text-white text-sm mt-1">
                                {t('suaEraNaPool')}: <span className="font-bold text-blue-primary">{userBlockchain?.pool?.currentEra}</span>
                            </p>
                            <p className="text-white text-sm">
                                {t('eraAtualDaPool')}: <span className="font-bold text-blue-primary">{poolData?.currentEra}</span>
                            </p>
                            <p className="text-white text-sm">
                                {t('saquesDisponiveis')}: <span className="font-bold text-blue-primary">{poolData?.currentEra - userBlockchain?.pool?.currentEra}</span>
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