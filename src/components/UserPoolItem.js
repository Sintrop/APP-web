import React, {useEffect, useState} from 'react';
import {GetBalanceDeveloper} from '../services/developersPoolService';
import {GetBalanceProducer} from '../services/producerPoolService';

export function UserPoolItem({data, position}){
    const [balance, setBalance] = useState('')
    useEffect(() => {
        getBalance();
    },[]);

    async function getBalance(){
        let balanceTokens = '';
        if(data?.userType === '4'){
            const balance = await GetBalanceDeveloper(data.developerWallet);
            balanceTokens = balance
        }
        if(data?.userType === '1'){
            const balance = await GetBalanceProducer(data.producerWallet);
            balanceTokens = balance
        }
        setBalance(balanceTokens);
    }

    return(
        <div className="flex w-full">
            <div className='flex w-[5%] px-1 py-3'>
                <p className='font-bold text-white'>{position}º</p>
            </div>
            <div className='flex justify-center w-[20%] px-1 py-3'>
                <p className='font-bold text-white w-[13ch] text-ellipsis overflow-hidden'>
                    {data.userType === '1' && data.producerWallet}
                    {data.userType === '4' && data?.developerWallet}
                </p>
            </div>
            <div className='flex justify-center w-[30%] px-1 py-3'>
                <p className='font-bold text-white'>{data?.name}</p>
            </div>
            <div className='flex justify-center w-[25%] px-1 py-3'>
                <p className='font-bold text-white'>
                    {data.userType === '1' && data.isa?.isaScore}
                    {data.userType === '4' && data.pool?.level}
                </p>
            </div>
            <div className='flex justify-center w-[20%] px-1 py-3 bg-[#783E19] border-l-2 border-[#3E9EF5]'>
                <p className='font-bold text-white'>{parseFloat(balance) / 10**18}</p>
            </div>
        </div>
    )
}