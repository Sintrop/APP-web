import React, {useEffect, useState, useContext} from 'react';
import { MainContext } from '../../../../contexts/main';
import './producerPage.css';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {FaLock, FaCheck} from 'react-icons/fa';
import { api } from '../../../../services/api';

//services
import {GetProducer} from '../../../../services/producerService';
import {GetInspections} from '../../../../services/manageInspectionsService';

//components
import ItemInspection from '../../../ProducerPageComponents/ItemInspection';
import  Map  from '../../../Map';
import axios from 'axios';

export default function ProducerPage({wallet, setTab}){
    const [loading, setLoading] = useState(true)
    const [loadingApi, setLoadingApi] = useState(true)
    const {t} = useTranslation();
    const {user, chooseModalRegister, blockNumber, walletConnected} = useContext(MainContext);
    const [producerData, setProducerData] = useState([]);
    const [producerDataApi, setProducerDataApi] = useState({});
    const [propertyPath, setPropertyPath] = useState([]);
    const [areaProperty, setAreaProperty] = useState(0);
    const [inspections, setInspections] = useState([]);
    const [base64, setBase64] = useState('');
    const [base64Map, setBase64Map] = useState('');
    const {tabActive, walletSelected} = useParams();
    const [viewMap, setViewMap] = useState(true);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);

    useEffect(() => {
        getProducer();
        getApiProducer();
    }, []);

    async function getApiProducer(){
        try{
            setLoadingApi(true);
            const response = await api.get(`/user/${wallet}`);
            setProducerDataApi(response.data.user)
            setPropertyPath(JSON.parse(response.data.user.propertyGeolocation))
            calculateArea(JSON.parse(response.data.user.propertyGeolocation))
        }catch(err){
            console.log(err);
        }finally{
            setLoadingApi(false);
        }
    }

    async function calculateArea(coords){
        let coordsUTM = [];
        for(var i = 0; i < coords.length; i++){
            let object = {}
            const response = await axios.get(`https://epsg.io/srs/transform/${coords[i].lng},${coords[i].lat}.json?key=default&s_srs=4326&t_srs=3857`)
            object = response.data.results[0]
            coordsUTM.push(object)
        }

        let areaX = 0;
        let areaY = 0;
        for(var i = 1; i < coordsUTM.length; i++){
            let product1 = coordsUTM[i-1].y * coordsUTM[i].x;
            areaX += product1
        }
        for(var i = 1; i < coordsUTM.length; i++){
            let product2 = coordsUTM[i-1].x * coordsUTM[i].y;
            areaY += product2
        }

        let repeatX = coordsUTM[coordsUTM.length - 1].y * coordsUTM[0].x; 
        let repeatY = coordsUTM[coordsUTM.length - 1].x * coordsUTM[0].y; 

        areaX += repeatX;
        areaY += repeatY;

        let D = areaX - areaY;
        let areaM2 = 0.5 * D;
        setAreaProperty(areaM2);
    }

    async function getProducer(){
        setLoading(true)
        const response = await GetProducer(walletSelected);
        getBase64(response)
        setProducerData(response);
        getInspections();
        setLoading(false)
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getBase64(data){
        const res = await get(data.proofPhoto);
        setBase64(res);
        const map64 = await get(data.propertyAddress.country);
        setBase64Map(map64);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div className='area-avatar__producer-page'>
                        <img 
                            src={`data:image/png;base64,${base64}`}
                            className='avatar__producer-page'
                        />
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>{t('Wallet')}: </h1>
                            <a className='description-cards-info__producer-page' href={`/account-producer/${producerData.producerWallet}`}>
                                {producerData === [] ? '' : producerData.producerWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    {t('Report')} {t('Producer')}
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    {t('Report')} {t('Producer')}
                                </Dialog.Trigger>
                            )}
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData === [] ? '' : producerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Address')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.city}/${producerData.propertyAddress.state}, ${producerData.propertyAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Inspections Reiceved')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData === [] ? '' : producerData.totalInspections}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('ISA Score')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('ISA Average')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData?.totalInspections === 0 ? (
                                <>
                                    {producerData?.isa?.isaScore / producerData?.totalInspections}
                                </>
                            ) : ('0')}
                        </p>
                    </div>
                    
                    {user === '1' && (
                        <div className='producer-cards-info__producer-page'>
                            <h1 className='tit-cards-info__producer-page'>Prox. Request: </h1>
                            {Number(producerData?.lastRequestAt) === 0 ? (
                                <div style={{
                                        display: 'flex', 
                                        flexDirection: 'row', 
                                        marginLeft: 5, 
                                        color: 'green', 
                                        alignItems: 'center'
                                    }}
                                >
                                    <FaCheck size={15} style={{marginRight: 5}}/>
                                    {t('You Can Request Inspections')}
                                </div>
                                
                            ) : (
                                <>
                                {(Number(producerData?.lastRequestAt) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0 ? (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'green', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaCheck size={15} style={{marginRight: 5}}/>
                                        {t('You Can Request Inspections')}
                                    </div>
                                ) : (
                                    <div style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            marginLeft: 5, 
                                            color: 'red', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaLock size={15} style={{marginRight: 5}}/>
                                        {t('Wait')} {(Number(producerData?.lastRequestAt) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber)} {t("blocks to request")}
                                    </div>
                                )}
                                </>
                            )}
                            
                        </div>
                    )}
                    </div>
                    
                    {!loading && (
                        <>
                            {!loadingApi && (
                                <>
                                <Map
                                    editable={false}
                                    //position={producerData?.propertyAddress?.complement}
                                    position={"-23.648088032964072,-46.56503617923737"}
                                    pathPolyline={propertyPath}
                                />
                                <p style={{margin: 0, fontWeight: "bold", textAlign: "center"}}>Área Aprox.: {areaProperty.toFixed(2)}m²</p>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className='inspections-area__producer-page'> 
                    {inspections.map((item) => {
                        if(item.createdBy == producerData.producerWallet){
                            return(
                                <ItemInspection 
                                    data={item}
                                    key={item.id} 
                                    setTab={(tab, wallet) => setTab(tab, wallet)}  
                                    typeAccount='producer'
                                    wallet={wallet}
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}