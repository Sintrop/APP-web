import React, {useState, useEffect} from 'react';
import AvatarDefault from '../../../assets/img/avatar03.png';
import ActivistService from '../../../services/activistService';
import {GetInspections} from '../../../services/manageInspectionsService';

//components
import ItemInspection from '../../ProducerPageComponents/ItemInspection';

export default function ActivistPage({wallet}){
    const activistService = new ActivistService(wallet)
    const [activistData, setActivistData] = useState([]);
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        getActivist();
    },[]);

    async function getActivist(){
        const response = await activistService.getAtivist(wallet);
        setActivistData(response)
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
                            <h1 className='tit-cards-info__producer-page'>Activist Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='/producer-page'>
                                {activistData === [] ? '' : activistData.activistWallet}
                            </a>
                        </div>

                        <button
                            className='area-avatar__btn-report'
                        >Report Activist</button>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData === [] ? '' : activistData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData.activistAddress === undefined ? '' : `${activistData.activistAddress.city}/${activistData.activistAddress.state}, ${activistData.activistAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Total Inspections:</h1>
                        <p className='description-cards-info__producer-page'>
                            {activistData === [] ? '' : activistData.totalInspections}
                        </p>
                    </div>
                </div>

                <div className='inspections-area__producer-page'> 
                    {inspections.map((item) => {
                        if(item.acceptedBy == activistData.activistWallet){
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