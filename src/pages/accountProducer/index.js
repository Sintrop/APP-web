import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './accountProducer.css';
import {get} from '../../config/infura';
import * as Dialog from '@radix-ui/react-dialog';
import Logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import { useTranslation } from 'react-i18next';
import { ModalChooseTypeDelation } from '../../components/ModalChooseTypeDelation';
import { api } from '../../services/api';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

//services
import {GetDelation, GetInspections, GetProducer} from '../../services/accountProducerService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';
import { InspectionItemResult } from './inspectionItemResult';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderWidth: 4,
    borderRadius: 8,
    borderColor: '#3E9EF5'
};

export default function AccountProducer(){
    const {t} = useTranslation();
    const {walletSelected} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [producerAddress, setProducerAddress] = useState([]);
    const [center, setCenter] = useState({})
    const [inspections, setInspections] = useState([]);
    const [delationsReiceved, setDelationsReiceved] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [modalChooseTypeDelation, setModalChooseTypeDelation] = useState(false);

    useEffect(() => {
        getProducer();
        getProducerApi();
    },[]);

    async function getProducer(){
        const response = await GetProducer(walletSelected);
        setProducerData(response);
        const centerProperty = JSON.parse(response.propertyAddress.coordinate)
        setCenter(centerProperty);
        getBase64(response.proofPhoto);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReiceved(delations.length);
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        const filterInspections = response.filter(item => String(item.createdBy).toUpperCase() === walletSelected.toUpperCase())
        setInspections(filterInspections);
    }

    async function getBase64(path){
        const base64 = await get(path);
        setProofPhotoBase64(base64);
    }

    async function getProducerApi(){
        try{
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            const address = JSON.parse(response.data.user?.address)
            setProducerAddress(address);
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="w-full flex flex-col items-center bg-[#0A4303]">
            <div className='w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] flex items-center justify-center lg:justify-start lg:px-16'>
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
                    <h1 className='font-bold text-center lg:text-left text-2xl text-white'>{producerData?.name}</h1>
                    <p className='text-lg text-center lg:text-left text-white mt-2'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Inspections Received')}: {inspections?.length}</p>
                </div>

                <div className='flex flex-col'>
                    <p className='text-lg text-center lg:text-left text-white mt-2'>ISA {t('Score')}: {producerData?.isa?.isaScore}</p>
                    <p className='text-lg text-center lg:text-left text-white'>ISA {t('Average')}: {producerData?.isa?.isaAverage}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Delations Received')}: {producerData?.isa?.isaAverage}</p>
                </div>

                <div className='flex flex-col'>
                    <Dialog.Root open={modalChooseTypeDelation} onOpenChange={(open) => setModalChooseTypeDelation(open)}>
                        <ModalChooseTypeDelation/>
                        <Dialog.Trigger
                            className='px-3 lg:px-8 py-3 bg-[#FF9900] rounded-md font-bold text-[#062C01]'
                        >
                            {t('Report Producer')}
                        </Dialog.Trigger>
                    </Dialog.Root>
                </div>
            </div>

            {producerData && (
                <div className='flex w-full lg:w-[1000px] justify-center mt-5 px-2 lg:px-0 lg:mt-10'>
                    <div className='flex w-full justify-center'>
                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                        libraries={['drawing']}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={18}
                            mapTypeId='satellite'
                        >
                            { 
                                <Marker position={center}/>
                            }
            

                        
                                {/* <Polyline
                                    path={pathPolyline}
                                /> */}
                            
                        </GoogleMap>
                    </LoadScript>
                    </div>
                </div>
            )}

            <div className="flex flex-col w-full lg:w-[1000px] mt-5 lg:mt-10">
            {inspections.map(item => (
                <InspectionItemResult
                    key={item.id}
                    data={item}
                />
            ))}
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