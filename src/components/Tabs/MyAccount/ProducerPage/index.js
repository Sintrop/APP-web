import React, {useEffect, useState, useContext} from 'react';
import { MainContext } from '../../../../contexts/main';
import './producerPage.css';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {FaLock, FaCheck} from 'react-icons/fa';

//services
import {GetProducer} from '../../../../services/producerService';
import {GetInspections} from '../../../../services/manageInspectionsService';

//components
import ItemInspection from '../../../ProducerPageComponents/ItemInspection';

export default function ProducerPage({wallet, setTab}){
    const {t} = useTranslation();
    const {user, chooseModalRegister, blockNumber, walletConnected} = useContext(MainContext);
    const [producerData, setProducerData] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [base64, setBase64] = useState('');
    const {tabActive, walletSelected} = useParams();

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive]);

    useEffect(() => {
        getProducer();
    }, [])

    async function getProducer(){
        const response = await GetProducer(walletSelected);
        getBase64(response.proofPhoto)
        setProducerData(response);
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getBase64(data){
        const res = await get(data);
        setBase64(res);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
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