import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {GetBalanceDeveloper} from '../../../../services/developersPoolService';

export default function DeveloperItem({data, setTab}){
    const navigate = useNavigate();
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');
    const {walletAddress} = useParams();
    console.log(data.developerWallet)
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
                <a
                    onClick={() => navigate(`/dashboard/${walletAddress}/developer-page/${data.developerWallet}`)}
                    style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
                >
                    <p className="p-wallet" title={data.developerWallet}>
                        {data.developerWallet}
                    </p>
                </a>
            </td>
            <td>{data.name}</td>
            <td>{parseFloat(balanceDeveloper) / 10**18}</td>
            <td>{data.pool.level}</td>
        </tr>
    )
}