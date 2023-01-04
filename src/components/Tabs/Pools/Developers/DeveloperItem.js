import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {GetBalanceDeveloper} from '../../../../services/developersPoolService';

export default function DeveloperItem({data, setTab}){
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');
    const {walletAddress} = useParams();
    useEffect(() => {
        getBalance();
    },[]);

    async function getBalance(){
        const balance = await GetBalanceDeveloper(data.developerWallet);
        setBalanceDeveloper(balance);
    }

    return(
        <tr key={data.id}>
            <td>{data.id}</td>
            <td id='createdByIsaTable'>
                <a href={`/dashboard/${walletAddress}/developer-page/${data.developerWallet}`}>
                    <p className="p-wallet" title={data.developerWallet}>
                        {data.developerWallet}
                    </p>
                </a>
            </td>
            <td>{data.name}</td>
            <td>{parseFloat(balanceDeveloper) / 10**18}</td>
            <td>{data.level[0]}</td>
        </tr>
    )
}