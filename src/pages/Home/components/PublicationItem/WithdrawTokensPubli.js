import React, {useEffect, useState} from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { web3 } from "../../../../services/web3/Contracts";

export function WithdrawTokensPubli({data, changeVisible}){
    const {t} = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);
    const userData = data.user;
    const [tokensWithdraw, setTokensWithdraw] = useState(0);

    useEffect(() => {
        getTokensWithdraw(additionalData?.transactionHash, String(userData.wallet).toLowerCase())
    }, [userData, additionalData]);

    async function getTokensWithdraw(hash, wallet) {
        const response = await axios.get(`${process.env.REACT_APP_CHAIN_API}/api/v2/transactions/${hash}/token-transfers?type=ERC-20`);
        const valueTransfer = response.data?.items[0]?.total?.value;
        const valueFromWei = web3.utils.fromWei(valueTransfer);
        setTokensWithdraw(valueFromWei);
    }

    if(tokensWithdraw === 0){
        return(
            <div className="flex flex-col text-white">
                <p>
                    {t('avancouEraPool')}
                </p>
            </div>
        )
    }

    return(
        <div className="flex flex-col rounded-md bg-green-950 gap-3 pt-3">
            <img
                src={require('../../../../assets/token.png')}
                className="h-10 w-10 rounded-full object-contain ml-3"            
                alt='icone do crédito de regeneração'
            />

            <p className="text-white mx-3">
                {t('sacou')} <span className="font-bold text-green-700">{Intl.NumberFormat('pt-BR').format(tokensWithdraw)}</span> {t('textWithdraw')}
            </p>

            <div className="w-full h-7 flex bg-green-500 items-center justify-center rounded-b-md">
                <p className="text-white font-bold">{t('recompensaServicos')}</p>
            </div>
        </div>
    )
}