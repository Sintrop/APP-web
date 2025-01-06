import React from "react";
import { useTranslation } from "react-i18next";
import { TokensTransferProps } from "../../../../../../../../types/transaction";
import { web3 } from "../../../../../../../../services/web3/Contracts";

interface Props {
    tokensTransfer?: TokensTransferProps[];
}
export function WithdrawDescription({ tokensTransfer }: Props) {
    const { t } = useTranslation();
    console.log(tokensTransfer)

    if(!tokensTransfer){
        return <div/>
    }

    const transfer0 = tokensTransfer[0];
    const value = parseInt(web3.utils.fromWei(transfer0.total.value, 'ether'));
    
    return (
        <div className="flex flex-col rounded-md bg-green-950 gap-3 pt-3">
            <img
                src={require('../../../../../../../../assets/token.png')}
                className="h-10 w-10 rounded-full object-contain ml-3"            
                alt='icone do crédito de regeneração'
            />

            <p className="text-white mx-3">
                {t('sacou')} <span className="font-bold text-green-700">{Intl.NumberFormat('pt-BR').format(value)}</span> {t('textWithdraw')}
            </p>

            <div className="w-full h-7 flex bg-green-500 items-center justify-center rounded-b-md">
                <p className="text-white font-bold">{t('recompensaServicos')}</p>
            </div>
        </div>
    )
}