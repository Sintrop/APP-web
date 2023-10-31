import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useMainContext } from '../hooks/useMainContext';
import { api } from '../services/api';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';

export function RankingItem({data, position, researchersCenter, developersCenter, filterSelect}){
    const {setWalletSelected} = useMainContext();
    const {walletAddress} = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [loadingApi, setLoadingApi] = useState(false);
    const [userDataApi, setUserDataApi] = useState({});
    const [impactInvestor, setImpactInvestor] = useState({});
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        if(data?.userType === '7'){
            getInvestorApi();
            getImpact();
        }else{
            getImageProfile(data.proofPhoto);
        }
    },[]);

    async function getImageProfile(photo){
        const response = await axios.get(`https://ipfs.io/ipfs/${photo}`);
        
        if(response.data.includes('base64')){
            setImageProfile(response.data);
        }else{
            setImageProfile(`https://ipfs.io/ipfs/${photo}`)
        }
    }

    async function getInvestorApi(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${String(data?.investorWallet).toUpperCase()}`);
            setUserDataApi(response.data.user);
            getImageProfile(response.data.user.imgProfileUrl);
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
            navigate(`/dashboard/${walletAddress}/user-details/${data.userType}/${data?.inspectorWallet}`)
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

    async function getImpact(){
        let carbon = 0;
        let water = 0;
        let bio = 0;
        let soil = 0;

        const response = await api.get(`/tokens-burned/by-wallet/${data?.investorWallet}`);
        const arrayTokens = response.data.tokensBurned;
        for(var i = 0; i < arrayTokens.length; i++){
            const tokens = arrayTokens[i].tokens;
            carbon += tokens * arrayTokens[i].carbon;
            water += tokens * arrayTokens[i].water;
            bio += tokens * arrayTokens[i].bio;
            soil += tokens * arrayTokens[i].soil;
        }

        setImpactInvestor({carbon, water, bio, soil})
    }

    if(data?.userType === '7'){
        return(
            <div 
                className={`flex flex-col w-[240px] bg-[#0a4303] rounded-md cursor-pointer p-3`}
                onClick={handleClickUser}
            >   
                <div className="flex w-full justify-center">
                    {userDataApi?.imgProfileUrl ? (
                        <img
                            src={imageProfile}
                            className='w-[150px] h-[150px] object-cover rounded-full'
                        />
                    ) : (
                        <img
                            src={require('../assets/token.png')}
                            className='w-[150px] h-[150px] object-cover rounded-full border-[10px] border-white'
                        />
                    )}
                </div>
                

                <div className="flex flex-col w-full py-1 items-center">
                    <p className='font-bold text-center text-md text-white'>{data?.name}</p>
                    
                    <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.investorWallet}</p> 
                    <p className='text-center text-sm text-white mt-3'>{t('Contributed with')}</p>

                    <div className="flex items-center gap-1">
                            <NumericFormat 
                                value={data?.tokens?.toFixed(0)} 
                                allowLeadingZeros 
                                thousandSeparator="." 
                                decimalSeparator="," 
                                className="font-bold text-[#ff9900] bg-transparent text-center text-xl"
                            />
                    </div>
                    {/* <p className='font-bold text-center text-lg text-[#ff9900]'>{data?.tokens.toFixed(0)}</p> */}
                    <p className='font-bold text-center text-sm text-white'>{t('Regeneration Credits')}</p> 
                </div>

                <div className='flex flex-col items-center justify-between w-full gap-2 mt-2'>
                    <div className='flex items-center justify-center w-full'>
                        <div className='flex flex-col items-center w-[50%]'>
                            <img
                                src={require('../assets/co2.png')}
                                className='w-[30px] h-[30px] object-contain'
                            />
                            <p className='text-white text-xs'>{t('Carbon')}</p>
                            <p className='text-[#ff9900] font-bold text-xs text-center'>{impactInvestor?.carbon?.toFixed(2).replace('.',',')} kg</p>
                        </div>

                        <div className='flex flex-col items-center w-[50%]'>
                            <img
                                src={require('../assets/agua.png')}
                                className='w-[30px] h-[30px] object-contain'
                            />
                            <p className='text-white text-xs'>{t('Water')}</p>
                            <p className='text-[#ff9900] font-bold text-xs text-center'>{impactInvestor?.water?.toFixed(2).replace('.',',')} m³</p>
                        </div>
                    </div>
                    
                    <div className='flex items-center justify-center w-full'>
                        <div className='flex flex-col items-center w-[50%]'>
                            <img
                                src={require('../assets/solo.png')}
                                className='w-[30px] h-[30px] object-contain'
                            />
                            <p className='text-white text-xs'>{t('Soil')}</p>
                            <p className='text-[#ff9900] font-bold text-xs text-center'>{impactInvestor?.soil?.toFixed(2).replace('.',',')} m²</p>
                        </div>

                        <div className='flex flex-col items-center w-[50%]'>
                            <img
                                src={require('../assets/bio.png')}
                                className='w-[30px] h-[30px] object-contain'
                            />
                            <p className='text-white text-xs'>{t('Bio')}</p>
                            <p className='text-[#ff9900] font-bold text-xs text-center'>{impactInvestor?.bio?.toFixed(0).replace('.',',')} uv</p>
                        </div>
                    </div>
                </div>
                {/* {position === 1 && (
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
                )} */}
            </div>
        )
    }

    if(developersCenter){
        return(
            <div 
                className={`flex flex-col w-[220px] h-[280px] bg-black rounded-md cursor-pointer`}
                onClick={handleClickUser}
            >   
                
                <img
                    src={imageProfile}
                    className='w-full h-[150px] object-cover rounded-t-md'
                />
                

                <div className="flex flex-col w-full py-1 items-center">
                    <p className='font-bold text-center text-md text-[#FFC633]'>{data?.name}</p>
                    
                    <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.developerWallet}</p> 
                    <p className='font-bold text-center text-sm text-white mt-3'>{t('Level')}: {data?.pool?.level}</p>
                    <p className='font-bold text-center text-sm text-white'>{t('Current')} Era: {data?.pool?.currentEra}</p>
                    <p className='font-bold text-center text-sm text-white'>.</p> 
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
    
    return(
            <div 
                className={`flex flex-col w-[220px] h-[280px] ${researchersCenter ? 'bg-[#1B7A74]' : 'bg-[#0A4303]'} rounded-md cursor-pointer`}
                onClick={handleClickUser}
            >   
                {data?.userType === '7' ? (
                    <img
                        src={imageProfile}
                        className='w-full h-[150px] object-cover rounded-t-md'
                    />
                ) : (
                    <img
                        src={imageProfile}
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
                            <p className='text-xs text-center text-white max-w-[30ch] overflow-hidden text-ellipsis'>{data?.validatorWallet}</p> 
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
    );
    
}