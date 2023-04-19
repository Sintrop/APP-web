import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import Logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import { useTranslation } from 'react-i18next';
import { ModalChooseTypeDelation } from '../../components/ModalChooseTypeDelation';

//services
import {GetInvestor} from '../../services/accountProducerService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';
import { InspectionItemResult } from './inspectionItemResult';

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

    return(
        <div className='container__account-producer-page'>
            <div className='header__account-producer-page'>
                <img className='logo__account-producer-page' src={Logo}/>
            </div>

            <div className='content__account-producer-page'>
                <div className='account-producer-area-info__account-producer-page'>
                    <div className='area-avatar__account-producer-page'>
                        <img src={`data:image/png;base64,${proofPhotoBase64}`} className='avatar__account-producer-page'/>
                        <div className='producer-cards-info__account-producer-page card-wallet'>
                            <h1 className='tit-cards-info__account-producer-page'>{t('Producer Wallet')}: </h1>
                            <a className='description-cards-info__account-producer-page' href={`/account-producer/${producerData.producerWallet}`}>
                                {producerData === [] ? '' : producerData.producerWallet}
                            </a>
                        </div>

                        <Dialog.Root open={modalChooseTypeDelation} onOpenChange={(open) => setModalChooseTypeDelation(open)}>
                            <ModalChooseTypeDelation/>
                            <Dialog.Trigger
                                className='area-avatar__btn-report'
                            >
                                {t('Report Producer')}
                            </Dialog.Trigger>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData === [] ? '' : producerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('Address')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData.propertyAddress === undefined ? '' : `${producerData?.propertyAddress.street}, ${producerData.propertyAddress.city}-${producerData.propertyAddress.state}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('Inspections Reiceved')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData === [] ? '' : producerData.totalInspections}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('ISA Score')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('ISA Average')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData?.totalInspections === '0' ? '0' : Number(producerData?.isa?.isaScore) / Number(producerData?.totalInspections)}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>{t('Delations Received')}: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {delationsReiceved}
                        </p>
                    </div>
                </div>

                <div className='inspections-area__account-producer-page'> 
                    {inspections.map((item) => {
                        if(item.createdBy == producerData.producerWallet){
                            return(
                                <ItemInspection 
                                    data={item}
                                    key={item.id}  
                                    typeAccount='producer'  
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}