import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ItemReceipt } from './ItemReceipts';

//services
import {GetInvestor, GetCertificateTokens} from '../../services/accountProducerService';

export default function AccountInvestor(){
    const {t} = useTranslation();
    const {walletSelected} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [tokens, setTokens] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        getInvestor();
        getReceipts();
    },[]);

    async function getInvestor(){
        const response = await GetInvestor(walletSelected);
        console.log(response)
        if(response.userType === '0'){
            let data = {
                name: 'Investidor Anônimo'
            }
            setInvestorData(data);
        }else{
            setInvestorData(response);
        }
        const tokens = await GetCertificateTokens(response.investorWallet);
        console.log(tokens);
    }

    async function getReceipts(){
        //add try catch in future
        let receiptsArray = [];
        const receipts = await axios.get(`https://api-goerli.etherscan.io/api?module=account&action=tokentx&contractaddress=0x3b25db3d9853ef80f60079ab38e5739cd1543b34&address=0x49b85e2d9f48252bf32ba35221b361da77aac683&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
        if(receipts.data.status === '1'){
            receiptsArray = receipts.data.result;
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
                    className='h-[200px] w-[200px] object-cover border-4 border-[#3E9EF5] rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col items-center lg:items-start'>
                    <h1 className='font-bold text-center lg:text-left text-2xl text-white'>{investorData?.name}</h1>
                    <h1 className='text-center lg:text-left text-lg text-white max-w-[78%] text-ellipsis overflow-hidden lg:max-w-full'>{walletSelected}</h1>
                    <div className='flex items-center justify-center px-5 py-3 bg-[#0a4303] rounded-md mt-2'>
                        <p className='font-bold text-white'>{tokens} SAC Tokens</p>
                    </div>
                </div>

            </div>

            <div className="flex flex-col items-center w-full mt-5 lg:mt-10 px-2 lg:px-0">
                    <h3 className="font-bold text-white lg:text-3xl text-center lg:w-[700px] border-b-2 pb-5">A terra agradece sua contribuição, juntos tornaremos a agricultura regenerativa</h3>
                
                    <div className="flex flex-col lg:w-[800px] mt-10 bg-[#0A4303] rounded-md border-2 border-[#3E9EF5] px-2 py-4">
                        <div className="flex w-full py-1 items-center justify-center bg-[#783E19] rounded-md">
                            <p className="font-bold text-white text-xl">Meu impacto</p>

                        </div>
                        <div className="flex flex-col lg:flex-row w-full justify-center flex-wrap gap-2 mt-5">
                            <div className="flex lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Carbono</p>
                                    <img
                                        src={require('../../assets/icon-co2.png')}
                                        className="w-[70px] h-[60px] object-cover"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">25</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">ton</p>
                                </div>
                            </div>

                            <div className="flex lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Solo</p>
                                    <img
                                        src={require('../../assets/icon-solo.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex lg:w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">50</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">m²</p>
                                </div>
                            </div>

                            <div className="flex lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Biodiversidade</p>
                                    <img
                                        src={require('../../assets/icon-bio.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">35</p>
                                    <p className="font-bold text-[#0a4303] text-3xl">uni</p>
                                </div>
                            </div>

                            <div className="flex lg:w-[49%] bg-white rounded-md px-4 py-5">
                                <div className="flex flex-col w-[30%]">
                                    <p className="font-bold text-[#0A4303] text-2xl">Água</p>
                                    <img
                                        src={require('../../assets/icon-agua.png')}
                                        className="w-[50px] h-[50px] object-contain"
                                    />
                                </div>
                                <div className="flex w-[70%] h-full items-center justify-center">
                                    <p className="font-bold text-[#0a4303] text-[50px]">62</p>
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