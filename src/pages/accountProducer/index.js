import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './accountProducer.css';
import { get } from '../../config/infura';
import * as Dialog from '@radix-ui/react-dialog';
import { IsProducerSyntropic } from '../../components/IsProducerSyntropic';
import { useTranslation } from 'react-i18next';
import { ModalChooseTypeDelation } from '../../components/ModalChooseTypeDelation';
import { api } from '../../services/api';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

//services
import { GetDelation, GetInspections, GetProducer } from '../../services/accountProducerService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';
import { InspectionItemResult } from './inspectionItemResult';
import { Warning } from '../../components/Warning';
import { ModalChooseLang } from '../../components/ModalChooseLang';
import { useMainContext } from '../../hooks/useMainContext';
import { ModalViewPhoto } from '../../components/ModalViewPhoto';
import { getImage } from '../../services/getImage';
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { ProducerGraphics } from '../../components/ProducerGraphics';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderWidth: 4,
    borderRadius: 8,
    borderColor: '#3E9EF5'
};

const containerMapStyle = {
    width: '100%',
    height: '300px',
};

export default function AccountProducer() {
    const { t } = useTranslation();
    const { walletSelected } = useParams();
    const { modalChooseLang } = useMainContext();
    const [producerData, setProducerData] = useState([]);
    const [producerAddress, setProducerAddress] = useState([]);
    const [center, setCenter] = useState({})
    const [inspections, setInspections] = useState([]);
    const [delationsReiceved, setDelationsReiceved] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [modalChooseTypeDelation, setModalChooseTypeDelation] = useState(false);
    const [modalViewPhoto, setModalViewPhoto] = useState(false);
    const [hashSelected, setHashSelected] = useState('');
    const [imageProfile, setImageProfile] = useState(null);
    const [userData, setUserData] = useState({});
    const [initialRegion, setInitialRegion] = useState(null);
    const [loadingInspections, setLoadingInspections] = useState(false);

    useEffect(() => {
        getProducer();
        getProducerApi();
    }, []);

    async function getProducer() {
        const response = await GetProducer(walletSelected);
        setProducerData(response);
        fixCoordinates(JSON.parse(response.propertyAddress.coordinate));
        getBase64(response.proofPhoto);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReiceved(delations.length);
        getInspections();
    }

    async function fixCoordinates(coords) {
        const arrayLat = String(coords.lat).split('');
        const arrayLng = String(coords.lng).split('');
        let newLat = '';
        let newLng = '';

        for (var i = 0; i < arrayLat.length; i++) {
            if (i === 3) {
                if (arrayLat[i] === '.') {
                    newLat += arrayLat[i]
                } else {
                    if (arrayLat[i] === ',') {
                        newLat += '.'
                    } else {
                        newLat += `.${arrayLat[i]}`
                    }
                }
            } else {
                newLat += arrayLat[i]
            }

        }

        for (var i = 0; i < arrayLng.length; i++) {
            if (i === 3) {
                if (arrayLng[i] === '.') {
                    newLng += arrayLng[i]
                } else {
                    if (arrayLng[i] === ',') {
                        newLng += '.'
                    } else {
                        newLng += `.${arrayLng[i]}`
                    }
                }
            } else {
                newLng += arrayLng[i]
            }
        }
        setCenter({
            lat: Number(newLat),
            lng: Number(newLng)
        })
    }

    async function getInspections() {
        setLoadingInspections(true);

        let array = [];
        const response = await api.get('/web3/history-inspections');
        array = response.data.inspections

        const filter = array.filter(item => String(item.createdBy).toUpperCase() === String(walletSelected).toUpperCase());
        setInspections(filter);
        
        setLoadingInspections(false);
    }

    async function getBase64(path) {
        const base64 = await get(path);
        setProofPhotoBase64(base64);
    }

    async function getProducerApi() {
        try {
            const response = await api.get(`/user/${String(walletSelected).toUpperCase()}`);
            const address = JSON.parse(response.data.user?.address)
            setProducerAddress(address);
            setUserData(response.data.user);
            getImageProfile(response.data.user.imgProfileUrl);
            if (response.data.user.geoLocation) {
                setInitialRegion(JSON.parse(response.data.user.geoLocation));
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return (
        <div className="w-full flex flex-col items-center bg-green-950 h-[100vh] pt-5 overflow-y-auto overflow-x-hidden px-2">
            <img
                src={require('../../assets/logo-branco.png')}
                className='w-[140px] lg:w-[170px] object-contain'
            />

            <div className='flex flex-col items-center lg:w-[1000px] lg:flex-row w-full gap-5 mt-5 lg:gap-5 lg:px-30 lg:mt-10 bg-[#0a4303] rounded-md p-3'>
                <img
                    src={imageProfile ? imageProfile : require('../../assets/token.png')}
                    className='h-[150px] w-[150px] lg:h-[200px] lg:w-[200px] object-cover border-4  rounded-full mt-5 lg:mt-0'
                />

                <div className='flex flex-col items-center lg:items-start'>
                    <h1 className='font-bold text-center lg:text-left lg:text-2xl text-white'>{userData?.name}</h1>
                    <h3 className='text-center lg:text-left lg:text-lg text-white max-w-[78%] text-ellipsis overflow-hidden lg:max-w-full'>{walletSelected}</h3>
                    <p className='lg:text-lg text-center lg:text-left text-white mt-2'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                </div>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Estatísticas do(a) produtor(a)</h3>

                <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{producerData?.totalInspections} </p>
                        <p className='text-white text-xs lg:text-base'>Inspeções recebidas</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{producerData?.isa?.isaScore}</p>
                        <p className='text-white text-xs lg:text-base'>Pontuação</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(producerData?.isa?.isaScore / producerData?.totalInspections)}</p>
                        <p className='text-white text-xs lg:text-base'>Média</p>
                    </div>

                    <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                        <p className='font-bold text-white text-xl lg:text-3xl'>0</p>
                        <p className='text-red-500 text-xs lg:text-base'>Denúncias recebidas</p>
                    </div>
                </div>

                <ProducerGraphics inspections={inspections}/>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Mapa da propriedade</h3>
                <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                    {initialRegion ? (
                        <LoadScript
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                            libraries={['drawing']}
                        >
                            <GoogleMap
                                mapContainerStyle={containerMapStyle}
                                center={{ lat: initialRegion?.latitude, lng: initialRegion?.longitude }}
                                zoom={15}
                                mapTypeId="hybrid"
                            >

                                <Marker
                                    position={{ lat: initialRegion?.latitude, lng: initialRegion?.longitude }}
                                />

                            </GoogleMap>

                        </LoadScript>
                    ) : (
                        <ActivityIndicator size={60} />
                    )}
                </div>
            </div>

            <div className='flex flex-col lg:w-[1000px] w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#0a4303] rounded-md p-3 mb-10'>
                <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>Inspeções recebidas</h3>
            </div>
        </div>
    )
}