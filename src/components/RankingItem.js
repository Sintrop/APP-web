import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../hooks/useMainContext';
import { api } from '../services/api';

export function RankingItem({data, position}){
    const {setWalletSelected} = useMainContext();
    const {walletAddress} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [loadingApi, setLoadingApi] = useState(false);
    const [userDataApi, setUserDataApi] = useState({});

    useEffect(() => {
        if(data?.userType === '7'){
            getInvestorApi()
        }
    },[]);

    async function getInvestorApi(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(data?.investorWallet).toUpperCase()}`);
            setUserDataApi(response.data.user)
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }
    
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
        
            <div 
                className="flex flex-col w-[220px] h-[280px] bg-[#0A4303] rounded-md cursor-pointer"
                onClick={handleClickUser}
            >   
                {data?.userType === '7' ? (
                    <img
                        src={`https://ipfs.io/ipfs/${userDataApi?.imgProfileUrl}`}
                        className='w-full h-[150px] object-cover rounded-t-md'
                    />
                ) : (
                    <img
                        src={`https://ipfs.io/ipfs/${data?.proofPhoto}`}
                        className='w-full h-[150px] object-cover rounded-t-md'
                    />
                )}

                <div className="flex flex-col w-full py-1 items-center">
                    <p className='font-bold text-center text-md text-white'>{data?.name}</p>

                    {data?.userType === '1' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.producerWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>{t('Inspections Reiceved')}: {data?.totalInspections}</p> 
                            <p className='font-bold text-center text-sm text-white'>ISA {t('Score')}: {data?.isa?.isaScore}</p>
                            <p className='font-bold text-center text-sm text-white'>ISA {t('Average')}: {data?.isa?.isaAverage}</p>  
                        </>
                    )}

                    {data?.userType === '2' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.activistWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>{t('Inspections Realized')}: {data?.totalInspections}</p> 
                            <p className='font-bold text-center text-sm text-white'>{t('Give Ups')}: {data?.giveUps}</p>
                            <p className='font-bold text-center text-sm text-white'>.</p>  
                        </>
                    )}

                    {data?.userType === '3' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.researcherWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>{t('Published Works')}: {data?.publishedWorks}</p>
                            <p className='font-bold text-center text-sm text-white'>.</p>
                            <p className='font-bold text-center text-sm text-white'>.</p> 
                        </>
                    )}

                    {data?.userType === '4' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.developerWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>{t('Level')}: {data?.pool?.level}</p>
                            <p className='font-bold text-center text-sm text-white'>{t('Current')} Era: {data?.pool?.currentEra}</p>
                            <p className='font-bold text-center text-sm text-white'>.</p> 
                        </>
                    )}

                    {data?.userType === '5' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.advisorWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>-</p>
                            <p className='font-bold text-center text-sm text-white'>-</p>
                            <p className='font-bold text-center text-sm text-white'>-</p> 
                        </>
                    )}

                    {data?.userType === '6' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.contributorWallet}</p> 
                            <p className='font-bold text-center text-sm text-white mt-3'>-</p>
                            <p className='font-bold text-center text-sm text-white'>-</p>
                            <p className='font-bold text-center text-sm text-white'>-</p> 
                        </>
                    )}

                    {data?.userType === '7' && (
                        <>
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.investorWallet}</p> 
                            <p className='font-bold text-center text-[#ff9900] mt-3'>{Number(data.tokens).toFixed(0)}</p>
                            <p className='font-bold text-center text-sm text-white'>{t('Regeneration Credit')}</p>
                            <p className='font-bold text-center text-sm text-white'>-</p> 
                        </>
                    )}
                </div>
                {position === 1 && (
                    <img
                        src={require('../assets/med-ouro.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-270px] ml-[-10px]'
                    />
                )}
                {position === 2 && (
                    <img
                        src={require('../assets/med-prata.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-270px] ml-[-10px]'
                    />
                )}

                {position === 3 && (
                    <img
                        src={require('../assets/med-bronze.png')}
                        className='w-[60px] h-[60px] object-contain mt-[-270px] ml-[-10px]'
                    />
                )}
            </div>
    )
}