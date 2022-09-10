import React, {useEffect, useState} from 'react';
import './producerPage.css';

import AvatarDefault from '../../../../assets/img/avatar02.png';

//services
import {GetProducer} from '../../../../services/producerService';
import {GetInspections} from '../../../../services/manageInspectionsService';

//components
import ItemInspection from '../../../ProducerPageComponents/ItemInspection';

export default function ProducerPage({wallet, setTab}){
    const [producerData, setProducerData] = useState([]);
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        getProducer();
    },[]);

    async function getProducer(){
        const response = await GetProducer(wallet);
        setProducerData(response);
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Producer Wallet: </h1>
                            <a className='description-cards-info__producer-page' href={`/account-producer/${producerData.producerWallet}`}>
                                {producerData === [] ? '' : producerData.producerWallet}
                            </a>
                        </div>

                        <button
                            className='area-avatar__btn-report'
                        >Report Producer</button>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData === [] ? '' : producerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData.propertyAddress === undefined ? '' : `${producerData.propertyAddress.city}/${producerData.propertyAddress.state}, ${producerData.propertyAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Inspections Reiceved: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData === [] ? '' : producerData.totalRequests}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Isa Score: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Isa Average: </h1>
                        <p className='description-cards-info__producer-page'>
                            {producerData.isa === undefined ? '' : producerData.isa.isaAverage}
                        </p>
                    </div>
                </div>

                <div className='inspections-area__producer-page'> 
                    {inspections.map((item) => {
                        if(item.createdBy == producerData.producerWallet){
                            return(
                                <ItemInspection 
                                    data={item}
                                    key={item.id} 
                                    setTab={(tab, wallet) => setTab(tab, wallet)}  
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}