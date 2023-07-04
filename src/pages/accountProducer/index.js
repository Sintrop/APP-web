import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './accountProducer.css';
import {get} from '../../config/infura';
import * as Dialog from '@radix-ui/react-dialog';
import { IsProducerSyntropic } from '../../components/IsProducerSyntropic';
import { useTranslation } from 'react-i18next';
import { ModalChooseTypeDelation } from '../../components/ModalChooseTypeDelation';
import { api } from '../../services/api';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

//services
import {GetDelation, GetInspections, GetProducer} from '../../services/accountProducerService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';
import { InspectionItemResult } from './inspectionItemResult';
import {Warning} from '../../components/Warning';
import {ModalChooseLang} from '../../components/ModalChooseLang';
import { useMainContext } from '../../hooks/useMainContext';
import { ModalViewPhoto } from '../../components/ModalViewPhoto';

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
    const {modalChooseLang} = useMainContext();
    const [producerData, setProducerData] = useState([]);
    const [producerAddress, setProducerAddress] = useState([]);
    const [center, setCenter] = useState({})
    const [inspections, setInspections] = useState([]);
    const [delationsReiceved, setDelationsReiceved] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [modalChooseTypeDelation, setModalChooseTypeDelation] = useState(false);
    const [modalViewPhoto, setModalViewPhoto] = useState(false);
    const [hashSelected, setHashSelected] = useState('');

    useEffect(() => {
        getProducer();
        getProducerApi();
    },[]);

    async function getProducer(){
        const response = await GetProducer(walletSelected);
        setProducerData(response);
        fixCoordinates(JSON.parse(response.propertyAddress.coordinate));
        getBase64(response.proofPhoto);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReiceved(delations.length);
        getInspections();
    }

    async function fixCoordinates(coords){
        const arrayLat = String(coords.lat).split('');
            const arrayLng = String(coords.lng).split('');
            let newLat = '';
            let newLng = '';

            for(var i = 0; i < arrayLat.length; i++){
                if(i === 3){
                    if(arrayLat[i] === '.'){
                        newLat += arrayLat[i]
                    }else{
                        if(arrayLat[i] === ','){
                            newLat += '.'
                        }else{
                            newLat += `.${arrayLat[i]}`
                        }
                    }
                }else{
                    newLat += arrayLat[i]
                }

            }

            for(var i = 0; i < arrayLng.length; i++){
                if(i === 3){
                    if(arrayLng[i] === '.'){
                        newLng += arrayLng[i]
                    }else{
                        if(arrayLng[i] === ','){
                            newLng += '.'
                        }else{
                            newLng += `.${arrayLng[i]}`
                        }
                    }
                }else{
                    newLng += arrayLng[i]
                }
            }
            setCenter({
                lat: Number(newLat),
                lng: Number(newLng)
            })
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
            console.log(response.data.user)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="w-full flex flex-col items-center bg-green-950 h-[100vh]">
            
            <div className='w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] flex items-center justify-center lg:justify-start lg:px-16 mb-3'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[170px] object-contain'
                />
            </div>

            <div className='flex flex-col w-full items-center overflow-auto'>
            <Warning
                message='Data from our test network'
                width={250}
            />

            <div className='flex flex-col lg:w-[1000px] lg:flex-row w-full gap-5 lg:gap-10 justify-center items-center lg:px-30 lg:mt-10'>
                <img 
                    src={`data:image/png;base64,${proofPhotoBase64}`} 
                    className='h-[200px] w-[200px] object-cover border-4 border-[#3E9EF5] rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col'>
                    <h1 className='font-bold text-center lg:text-left text-2xl text-white'>{producerData?.name}</h1>
                    <p className='text-lg text-center lg:text-left text-white mt-2'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Inspections Received')}: {inspections?.length}</p>
                    <div className='flex w-full justify-center lg:justify-start'>
                        <IsProducerSyntropic data={producerData}/>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <p className='text-lg text-center lg:text-left text-white mt-2'>{t('Regeneration Score')}: {producerData?.isa?.isaScore}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Average Regeneration')}: {(Number(producerData?.isa?.isaScore) / Number(producerData?.totalInspections)).toFixed(1).replace('.',',')}</p>
                    <p className='text-lg text-center lg:text-left text-white'>{t('Delations Received')}: 0</p>
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
                        googleMapsApiKey='AIzaSyD9854_llv58ijiMNKxdLbe6crnQuCpGuo'
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

        
            <Dialog.Root
                open={modalChooseLang}
            >
                <ModalChooseLang/>
            </Dialog.Root>
            </div>
        </div>
    )
}