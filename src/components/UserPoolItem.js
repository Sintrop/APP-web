import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

export function UserPoolItem({data, position}){
    const navigate = useNavigate();
    const {walletAddress} = useParams();

    function handleClickUser(){
        if(data?.userType === '1'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.producerWallet}`)
        }
        if(data?.userType === '2'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.activistWallet}`)
        }
        if(data?.userType === '3'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.researcherWallet}`)
        }
        if(data?.userType === '4'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.developerWallet}`)
        }
        if(data?.userType === '5'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.advisorWallet}`)
        }
        if(data?.userType === '6'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.contributorWallet}`)
        }
        if(data?.userType === '7'){
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.investorWallet}`)
        }
    }
    
    return(
        <div className="flex w-full">
            <div className='flex w-[5%] px-1 py-3'>
                <p className='font-bold text-white'>{position}º</p>
            </div>
            <div className='flex justify-center w-[20%] px-1 py-3'>
                <p 
                    onClick={handleClickUser}
                    className='font-bold text-blue-400 w-[13ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 cursor-pointer'
                >
                    {data.userType === '1' && data.producerWallet}
                    {data.userType === '4' && data?.developerWallet}
                </p>
            </div>
            <div className='flex justify-center w-[30%] px-1 py-3'>
                <p className='font-bold text-white'>{data?.name}</p>
            </div>
            <div className='flex justify-center w-[25%] px-1 py-3'>
                <p className='font-bold text-white'>
                    {data.userType === '1' && data?.isaScore}
                    {data.userType === '4' && data?.level}
                </p>
            </div>
            <div className='flex justify-center w-[20%] px-1 py-3 bg-[#783E19] border-l-2 border-[#3E9EF5]'>
                <p className='font-bold text-white'>{(data.balance / 10**18).toFixed(2)}</p>
            </div>
        </div>
    )
}