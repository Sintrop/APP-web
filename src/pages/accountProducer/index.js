import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import Logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';

//services
import {GetProducer} from '../../services/producerService';
import {GetInspections} from '../../services/manageInspectionsService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';

export default function AccountProducer(){
    const {walletAddress} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        getProducer();
    },[]);

    async function getProducer(){
        const response = await GetProducer(walletAddress);
        setProducerData(response);
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='header__producer-page'>
                <img className='logo__producer-page' src={Logo}/>
            </div>

            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <div className='avatar__producer-page'>

                        </div>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Producer Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='/producer-page'>
                                {producerData === [] ? '' : producerData.producerWallet}
                            </a>
                        </div>
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
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}