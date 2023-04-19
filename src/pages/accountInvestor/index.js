import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//services
import {GetInvestor} from '../../services/accountProducerService';

export default function AccountInvestor(){
    const {t} = useTranslation();
    const {walletSelected} = useParams();
    const [investorData, setInvestorData] = useState([]);
    const [producerAddress, setProducerAddress] = useState([]);
    const [center, setCenter] = useState({})
    const [inspections, setInspections] = useState([]);
    const [delationsReiceved, setDelationsReiceved] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [modalChooseTypeDelation, setModalChooseTypeDelation] = useState(false);

    useEffect(() => {
        getInvestor();
    },[]);

    async function getInvestor(){
        const response = await GetInvestor(walletSelected);
        setInvestorData(response);
    }

    return(
        <div className="w-full flex flex-col items-center bg-[#0A4303]">
            <div className='w-full h-20 bg-yellow-600 flex items-center justify-center lg:justify-start lg:px-16'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[170px] object-contain'
                />
            </div>

            <div className='flex flex-col lg:w-[1000px] lg:flex-row w-full gap-5 lg:gap-10 justify-center items-center lg:px-30 lg:mt-10'>
                <img 
                    src={`data:image/png;base64,${proofPhotoBase64}`} 
                    className='h-[200px] w-[200px] object-cover border-4 border-[#3E9EF5] rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col'>
                    <h1 className='font-bold text-center lg:text-left text-2xl text-white'>{investorData?.name}</h1>
                </div>

                <div className='flex flex-col'>
                    <p className='text-lg text-center lg:text-left text-white mt-2'>ISA {t('Score')}: {investorData?.isa?.isaScore}</p>
                    <p className='text-lg text-center lg:text-left text-white'>ISA {t('Average')}: {investorData?.isa?.isaAverage}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Delations Received')}: {investorData?.isa?.isaAverage}</p>
                </div>

            </div>

            <div className="flex flex-col w-full lg:w-[1000px] mt-5 lg:mt-10">
            
            </div>
        </div>
    )
}