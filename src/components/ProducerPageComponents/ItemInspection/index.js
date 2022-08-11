import React, {useEffect, useState} from 'react';
import './itemInspection.css';

//services
import {GetIsa} from '../../../services/manageInspectionsService';

//components
import ItemCategory from '../ItemCategory';

export default function ItemInspection({data}){
    const [isas, setIsas] = useState([]);
    const [moreDetails, setMoreDetails] = useState('item-inpection__container');
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    useEffect(() => {
        getIsa()
    }, []);

    async function getIsa(){
        const response = await GetIsa(data.id);
        setIsas(response);
    }

    function toggleMoreDetails(){
        if(showMoreDetails){
            setMoreDetails('item-inpection__container');
            setShowMoreDetails(false);
        }else{
            setMoreDetails('item-inpection__container more-details');
            setShowMoreDetails(true);
        }
    }

    return(
        <div className={moreDetails}>
            <h1 className='item-inspection__title-inspection'>Inspection {data.id} result</h1>
            <div className='item-inspection__content-inspection-info'>
                    <div className='item-inspection__card-info card-wallet'>
                        <h1 className='item-inspection__tit-cards-info'>Activist Wallet</h1>
                        <a href='/' className='item-inspection__description-cards-info'> {data.acceptedBy}</a>
                    </div>
                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Isa Score: </h1>
                    <p className='item-inspection__description-cards-info'>
                        {data.isaScore}
                    </p>
                </div>

                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Requested At: </h1>
                    <p className='item-inspection__description-cards-info'> {data.createdAt}</p>
                </div>

                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Updated At: </h1>
                    <p className='item-inspection__description-cards-info'> {data.updatedAt}</p>
                </div>
            </div>
            <div className='item-inspection__content-inspections'>
                <div className='content-inspections__area-btn_more'>
                    <button
                        className='area-btn-more__btn-more'
                        onClick={() => toggleMoreDetails()}
                    >
                        {showMoreDetails ? 'Less Details' : 'More Details'}
                    </button>
                </div>
                {isas.map((item) => {
                    return(
                        <ItemCategory
                            key={item.categoryId}
                            data={item}
                        />
                    )
                })}
            </div>
        </div>
    )
} 