import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ItemReceipt } from './ItemReceipts';
import { api } from '../../services/api';

//services
import {GetSupporter, GetCertificateTokens} from '../../services/accountProducerService';
import {getImage} from '../../services/getImage';
import { ContributeCertificate } from '../../components/Certificates/ContributeCertificate';

export default function AccountInvestor(){
    const {t} = useTranslation();
    const {walletSelected} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [userData, setUserData] = useState({});
    const [tokens, setTokens] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [impactInvestor, setImpactInvestor] = useState({});
    const [imageProfile, setImageProfile] = useState(null);

    useEffect(() => {
        getSupporter();
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

    async function getSupporter(){
        const response = await api.get(`/user/${walletSelected}`);
        setUserData(response.data.user);
        if(response.data.user.imgProfileUrl){
            getImageProfile(response.data.user.imgProfileUrl);
        }

        const contributions = await api.get(`/web3/contributions/${String(walletSelected).toLowerCase()}`);
        setTokens(contributions.data.tokensBurned)
    }

    async function getImageProfile(hash){
        const response = await getImage(hash);
        setImageProfile(response);
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
        <div className="w-full flex flex-col  items-center bg-green-950 pt-5 px-2 overflow-x-hidden">
            
            <img
                src={require('../../assets/logo-branco.png')}
                className='w-[140px] lg:w-[170px] object-contain'
            />
            
            <div className='flex flex-col items-center lg:w-[1000px] lg:flex-row mt-5 w-full gap-5 lg:gap-5 lg:px-30 lg:mt-10 bg-[#0a4303] rounded-md p-3'>
                <img 
                    src={imageProfile ? imageProfile : require('../../assets/token.png')} 
                    className='h-[150px] w-[150px] lg:h-[200px] lg:w-[200px] object-cover border-4  rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col items-center lg:items-start'>
                    <h1 className='font-bold text-center lg:text-left lg:text-2xl text-white'>{userData?.name}</h1>
                    <h1 className='text-center lg:text-left lg:text-lg text-white max-w-[78%] text-ellipsis overflow-hidden lg:max-w-full'>{walletSelected}</h1>
                    <div className='flex flex-col items-center lg:items-start px-5 py-3 bg-green-950 rounded-md mt-3'>
                        <p className='text-white text-sm'>Contribuiu com</p>
                        <p className='font-bold text-white'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(tokens)} Créditos de Regeneração</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Impacto das contribuições</h3>

                <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.carbon)} kg</p>
                        <p className='text-white text-xs lg:text-base'>Carbono</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.soil)} m²</p>
                        <p className='text-white text-xs lg:text-base'>Solo</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.water)} m³</p>
                        <p className='text-white text-xs lg:text-base'>Água</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.bio)} uv</p>
                        <p className='text-white text-xs lg:text-base'>Biodver.</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Certificado de contribuição</h3>
                <ContributeCertificate wallet={walletSelected}/>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3 mb-5'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Recibos de contribuição</h3>
                <div className="flex lg:w-[1000px] justify-center flex-wrap gap-10">
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

        </div>
    )
}