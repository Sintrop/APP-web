import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { web3 } from "../../../../../../../../services/web3/Contracts";
import { TransactionWeb3Props } from "../../../../../../../../types/transaction";
import { getTxData } from "../../../../../../../../services/chainApi/transactions";
import { ActivityIndicator } from "../../../../../../../../components/ActivityIndicator/ActivityIndicator";

interface Props {
    transactionHash?: string;
}
export function WithdrawDescription({ transactionHash }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [withdrawTokens, setWithdrawTokens] = useState(0);

    useEffect(() => {
        handleGetTxData();
    }, []);

    async function handleGetTxData(){
        if(!transactionHash){
            setLoading(false);
            setError(true);
            return
        }
        setLoading(true);
        
        const response = await getTxData(transactionHash);
        if(response.success){
            if(response.txData)getTokensWithdraw(response.txData);
        }else{
            setError(true);
        }

        setLoading(false);
    }

    function getTokensWithdraw(tx: TransactionWeb3Props){
        if(tx.token_transfers.length === 0){
            setWithdrawTokens(0);
            return;
        }

        const transfer0 = tx.token_transfers[0];
        const valueFromWei = parseInt(web3.utils.fromWei(transfer0.total.value))
        setWithdrawTokens(valueFromWei)
    }

    if(!transactionHash){
        return <div/>
    }

    if(error){
        return <div/>
    }

    if(loading){
        return(
            <div>
                <ActivityIndicator size={50}/>
            </div>
        )
    }

    if(withdrawTokens === 0){
        return(
            <div>
                <p className="text-white">
                    {t('avancouEraPool')}
                </p>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col rounded-md bg-green-950 gap-3 pt-3">
            <img
                src={require('../../../../../../../../assets/token.png')}
                className="h-10 w-10 rounded-full object-contain ml-3"            
                alt='icone do crédito de regeneração'
            />

            <p className="text-white mx-3">
                {t('sacou')} <span className="font-bold text-green-700">{Intl.NumberFormat('pt-BR').format(withdrawTokens)}</span> {t('textWithdraw')}
            </p>

            <div className="w-full h-7 flex bg-green-500 items-center justify-center rounded-b-md">
                <p className="text-white font-bold">{t('recompensaServicos')}</p>
            </div>
        </div>
    )
}