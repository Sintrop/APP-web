import React, {useEffect, useState} from "react";
import axios from "axios";

export function WithdrawTokensPubli({data, changeVisible}){
    const additionalData = JSON.parse(data?.additionalData);
    const userData = additionalData?.userData;
    const [tokensWithdraw, setTokensWithdraw] = useState(0);

    useEffect(() => {
        getTokensWithdraw(additionalData?.transactionHash, String(userData.wallet).toLowerCase())
    }, []);

    async function getTokensWithdraw(hash, wallet) {
        const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS}&address=${wallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)
        const transactions = response.data.result;
        
        for (var i = 0; i < transactions.length; i++) {
            if (transactions[i].hash === hash) {
                const tokens = String((Number(transactions[i].value) / 10 ** 18).toFixed(0))
                setTokensWithdraw(tokens)
                if(tokens === '0'){
                    changeVisible();
                }
            }
        }
    }

    if(tokensWithdraw === 0){
        return(
            <div/>
        )
    }

    return(
        <div className="flex flex-col rounded-md bg-green-950 gap-3 pt-3">
            <img
                src={require('../../../assets/token.png')}
                className="h-10 w-10 rounded-full object-contain ml-3"            
            />

            <p className="text-white mx-3">
                Sacou <span className="font-bold text-green-700">{Intl.NumberFormat('pt-BR').format(tokensWithdraw)}</span> créditos de regeneração pelos serviços prestados na ERA anterior
            </p>

            <div className="w-full h-7 flex bg-green-500 items-center justify-center rounded-b-md">
                <p className="text-white font-bold">Recompensa por serviços ambientais</p>
            </div>
        </div>
    )
}