import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ItemReceipt } from './ItemReceipts';
import { api } from '../../services/api';

//services
import {GetSupporter, GetCertificateTokens} from '../../services/accountProducerService';

export default function AccountInvestor(){
    const {t} = useTranslation();
    const {walletSelected} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [tokens, setTokens] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [impactInvestor, setImpactInvestor] = useState({});

    useEffect(() => {
        getInvestor();
        getReceipts();
        getImpact();
    },[]);

    async function getImpact(){
        let carbon = 0;
        let water = 0;
        let bio = 0;
        let soil = 0;

        const response = await api.get(`/tokens-burned/by-wallet/${walletSelected}`);
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

    async function getInvestor(){
        const response = await GetSupporter(walletSelected);
        if(response.userType === '0'){
            let data = {
                name: 'Investidor Anônimo'
            }
            setInvestorData(data);
        }else{
            setInvestorData(response);
        }
        const tokens = await GetCertificateTokens(walletSelected);
        setTokens((Number(tokens) / 10**18));
    }

    async function getReceipts(){
        //add try catch in future
        let receiptsArray = [];
        const receipts = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS}&address=${walletSelected}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=ACCKTAAXZP7GYX6993CMR7BHQYKI7TJA8Q`);
        if(receipts.data.status === '1'){
            const array = receipts.data.result;
            for(var i = 0; i < array.length; i++){
                if(array[i].to === '0x0000000000000000000000000000000000000000'){
                    receiptsArray.push(array[i]);
                }
            }
        }
        setReceipts(receiptsArray.reverse())
    }

    return(
        <div className="w-full flex flex-col  items-center bg-green-950">
            <div className='w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] flex items-center justify-center lg:justify-start lg:px-16'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[170px] object-contain'
                />
            </div>

            <div className='flex flex-col lg:w-[1000px] lg:flex-row w-full gap-5 lg:gap-10 items-center justify-center lg:px-30 lg:mt-10'>
                <img 
                    src={`data:image/png;base64,${proofPhotoBase64}`} 
                    className='h-[200px] w-[200px] object-cover border-4  rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col items-center lg:items-start'>
                    <h1 className='font-bold text-center lg:text-left text-2xl text-white'>{investorData?.name}</h1>
                    <h1 className='text-center lg:text-left text-lg text-white max-w-[78%] text-ellipsis overflow-hidden lg:max-w-full'>{walletSelected}</h1>
                    <div className='flex items-center justify-center px-5 py-3 bg-[#0a4303] rounded-md mt-2'>
                        <p className='font-bold text-white'>{Number(tokens).toFixed(2).replace('.',',')} Créditos de Regeneração</p>
                    </div>
                </div>

            </div>

            <div className="flex flex-col items-center w-full mt-5 lg:mt-10 px-2 lg:px-0">
                    <h3 className="font-bold text-white lg:text-3xl text-center lg:w-[700px] border-b-2 pb-5">A terra agradece sua contribuição, juntos tornaremos a agricultura regenerativa</h3>
                
                    <div className="flex flex-col w-full lg:w-[800px] mt-10 bg-[#0A4303] rounded-md border-2  px-2 py-4">
                        <div className="flex w-full py-1 items-center justify-center bg-[#783E19] rounded-md">
                            <p className="font-bold text-white text-xl">Meu impacto</p>
                        </div>
                        <div className="flex flex-col lg:flex-row w-full justify-center flex-wrap gap-2 mt-5">
                            <div className="flex flex-col lg:flex-row lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col lg:w-[30%] items-center">
                                    <p className="font-bold text-[#0A4303] text-2xl">Carbono</p>
                                    <img
                                        src={require('../../assets/icon-co2.png')}
                                        className="w-[70px] h-[60px] object-cover"
                                    />
                                </div>
                                <div className="flex lg:w-[70%] h-full items-center justify-center mt-2">
                                    <p className="font-bold text-[#0a4303] text-4xl lg:text-[50px]">{Number(impactInvestor?.carbon).toFixed(2)}</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">kg</p>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col items-center lg:w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Solo</p>
                                    <img
                                        src={require('../../assets/icon-solo.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex lg:w-[70%] h-full items-center justify-center mt-2">
                                    <p className="font-bold text-[#0a4303] text-4xl lg:text-[50px]">{Number(impactInvestor?.soil).toFixed(2)}</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">m²</p>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col items-center lg:w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Biodiversidade</p>
                                    <img
                                        src={require('../../assets/icon-bio.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex lg:w-[70%] h-full items-center justify-center mt-2">
                                    <p className="font-bold text-[#0a4303] text-4xl lg:text-[50px]">{Number(impactInvestor?.bio).toFixed(2)}</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">uv</p>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col items-center lg:w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Água</p>
                                    <img
                                        src={require('../../assets/icon-agua.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex lg:w-[70%] h-full items-center justify-center mt-2">
                                    <p className="font-bold text-[#0a4303] text-4xl lg:text-[50px]">{Number(impactInvestor?.water).toFixed(2)}</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">m³</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="flex lg:w-[1000px] justify-center flex-wrap gap-10 mt-10">
                    {receipts.length !== 0 && (
                        <>
                        {receipts.map((item, index) => (
                            <ItemReceipt
                                data={item}
                                index={index + 1}
                            />
                        ))}
                        </>
                    )}
            </div>
        </div>
    )
}