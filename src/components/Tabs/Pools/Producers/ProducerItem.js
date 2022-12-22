import React, {useEffect, useState} from "react";

import {GetBalanceProducer} from '../../../../services/producerPoolService';

export default function ProducerItem({data, setTab}){
    const [balanceProducer, setBalanceProducer] = useState('0');

    useEffect(() => {
        getBalance();
    },[]);

    async function getBalance(){
        const balance = await GetBalanceProducer(data.producerWallet);
        setBalanceProducer(balance);
    }

    return(
        <tr key={data.id}>
            <td>{data.id}</td>
            <td id='createdByIsaTable'>
                <a href="#" onClick={() => setTab('developer-page', data.producerWallet)}>
                    <p className="p-wallet" title={data.producerWallet}>
                        {data.producerWallet}
                    </p>
                </a>
            </td>
            <td>{data.name}</td>
            <td>{parseFloat(balanceProducer) / 10**18}</td>
        </tr>
    )
}