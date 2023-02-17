import React, {useEffect, useState} from "react";
import {format} from 'date-fns';
import './itemReceipt.css';

export function ItemReceipt({data}){
    const [date, setDate] = useState('');

    useEffect(() => {
        calculateDate();
    }, []);

    function calculateDate(){
        const newDate = format(new Date(Number(data.timeStamp) * 1000), 'dd-MM-yyyy - kk:mm')
        setDate(newDate);
    }

    return(
        <div className="item-receipt__container">
            <p className="item-receipt__label">Transaction hash</p>
            <a target="_blank" href={`https://goerli.etherscan.io/tx/${data.hash}`}>
                <p className="item-receipts__text-hash">{data.hash}</p>
            </a>

            <p className="item-receipt__label">From address</p>
            <p className="item-receipt__description">{data.contractAddress}</p>

            <p className="item-receipt__label">Block number</p>
            <p className="item-receipt__description">{data.blockNumber}</p>

            <p className="item-receipt__label">Date</p>
            <p className="item-receipt__description">{date}</p>

            <p className="item-receipt__label">Total burned</p>
            <p className="item-receipt__description">{(Number(data.value) / 10**18).toFixed(5)}</p>

            <div className="item-receipt__area-footprint-calculator">
                <p style={{fontWeight: 'bold', color: 'white', margin: 0, textAlign: 'center'}}>Total impact = 0t</p>
                <p style={{fontWeight: 'bold', color: 'white', margin: 0, textAlign: 'center'}}>CO2e</p>
                <p style={{fontWeight: 'bold', color: 'white', margin: 0, textAlign: 'center'}}>0 units of life</p>
            </div>
        </div>
    )
}