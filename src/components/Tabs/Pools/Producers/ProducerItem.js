import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from 'react-router-dom';
import {GetBalanceProducer} from '../../../../services/producerPoolService';

export default function ProducerItem({data, setTab}){
    const navigate = useNavigate();
    const [balanceProducer, setBalanceProducer] = useState('0');
    const {walletAddress} = useParams();

    useEffect(() => {
        getBalance();
        console.log(data)
    },[]);

    async function getBalance(){
        const balance = await GetBalanceProducer(data.producerWallet);
        setBalanceProducer(balance);
    }

    return(
        <tr key={data.id}>
            <td>{data.id}</td>
            <td id='createdByIsaTable'>
                <a
                    onClick={() => navigate(`/dashboard/${walletAddress}/producer-page/${data.producerWallet}`)}
                    style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
                >
                    <p className="p-wallet" title={data.producerWallet}>
                        {data.producerWallet}
                    </p>
                </a>
            </td>
            <td>{data.name}</td>
            <td>{parseFloat(balanceProducer) / 10**18}</td>
            <td>{data.isa.isaScore}</td>
        </tr>
    )
}