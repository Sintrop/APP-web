import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../hooks/useMainContext';

export function RankingItem({data, position}){
    const {setWalletSelected} = useMainContext();
    const {walletAddress} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    
    function handleClickUser(){
        if(data?.userType === '1'){
            setWalletSelected(data?.producerWallet)
        }
        if(data?.userType === '2'){
            setWalletSelected(data?.activistWallet)
        }
        if(data?.userType === '3'){
            setWalletSelected(data?.researcherWallet)
        }
        if(data?.userType === '4'){
            setWalletSelected(data?.developerWallet)
        }
        if(data?.userType === '5'){
            setWalletSelected(data?.advisorWallet)
        }
        if(data?.userType === '6'){
            setWalletSelected(data?.contributorWallet)
        }
        if(data?.userType === '7'){
            setWalletSelected(data?.investorWallet)
        }

        navigate(`/dashboard/${walletAddress}/user-details/${data.userType}`)
    }

    return(
        
            <div 
                className="flex flex-col w-[220px] h-[280px] bg-[#0A4303] rounded-md cursor-pointer"
                onClick={handleClickUser}
            >
                <img
                    src={`https://ipfs.io/ipfs/${data?.proofPhoto}`}
                    className='w-full h-[150px] object-cover rounded-t-md'
                />

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
                            <p className='font-bold text-center text-sm text-white mt-3'>{t('Level')}: {data?.level?.level}</p>
                            <p className='font-bold text-center text-sm text-white'>{t('Current')} Era: {data?.level?.currentEra}</p>
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
                            <p className='font-bold text-center text-sm text-white mt-3'>-</p>
                            <p className='font-bold text-center text-sm text-white'>-</p>
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