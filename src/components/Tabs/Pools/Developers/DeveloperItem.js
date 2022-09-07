import React, {useEffect, useState} from "react";

import {GetBalanceDeveloper} from '../../../../services/developersPoolService';

export default function DeveloperItem({data}){
    const [balanceDeveloper, setBalanceDeveloper] = useState('0');

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
                <a href="#" onClick={() => {}}>
                    <p className="p-wallet" title={data.developerWallet}>
                        {data.developerWallet}
                    </p>
                </a>
            </td>
            <td>{data.name}</td>
            <td>{parseFloat(balanceDeveloper) / 1000000000000000000}</td>
            <td>{data.level[0]}</td>
        </tr>
    )
}