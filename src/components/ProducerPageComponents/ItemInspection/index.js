import React, {useEffect, useState} from 'react';
import './itemInspection.css';
import {format} from 'date-fns';
import { useParams } from 'react-router-dom';

//services
import {GetIsa} from '../../../services/manageInspectionsService';

//components
import ItemCategory from '../ItemCategory';

export default function ItemInspection({data, setTab, typeAccount, wallet}){
    const {walletAddress} = useParams();
    const [isas, setIsas] = useState([]);
    const [moreDetails, setMoreDetails] = useState('item-inpection__container');
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [inspectedAt, setInspectedAt] = useState('');
    const [acceptedAt, setAcceptedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');

    useEffect(() => {
        getIsa();
        timestampToDate()
        console.log(data)
    }, []);

    function timestampToDate(){
        const acceptedAtTime = parseInt(data.acceptedAtTimestamp);
        const createdAtTime = new Date(parseInt(data.createdAtTimestamp)*1000);
        const inspectedAtTime = new Date(parseInt(data.inspectedAtTimestamp)*1000);
        setCreatedAt(format(createdAtTime, "dd/MM/yyyy - kk:mm"))
        if(acceptedAtTime === 0){
            setAcceptedAt('Not Accepted')
        }else{
            const date = new Date(acceptedAtTime*1000);
            setAcceptedAt(format(date, "dd/MM/yyyy - kk:mm"))
        }
        if(inspectedAtTime === 0){
            setInspectedAt('Not inspected')
        }else{
            const date = new Date(acceptedAtTime*1000);
            setInspectedAt(format(date, "dd/MM/yyyy - kk:mm"))
        }
    }

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
                        <h1 className='item-inspection__tit-cards-info'>
                            {typeAccount === 'producer' ? 'Activist Wallet' : 'Producer Wallet'}
                        </h1>
                        <a 
                            href={typeAccount === 'producer' ? `/dashboard/${walletAddress}/activist-page/${data.createdBy}` : `/dashboard/${walletAddress}/producer-page/${data.createdBy}`} 
                            className='item-inspection__description-cards-info'
                        >{typeAccount === 'producer' ? `${data.acceptedBy}` : `${data.createdBy}`}</a>
                    </div>
                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Isa Score: </h1>
                    <p className='item-inspection__description-cards-info'>
                        {data.isaScore}
                    </p>
                </div>

                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Requested At: </h1>
                    <p className='item-inspection__description-cards-info'> {createdAt}</p>
                </div>

                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Accepted At: </h1>
                    <p className='item-inspection__description-cards-info'> {acceptedAt}</p>
                </div>

                <div className='item-inspection__card-info'>
                    <h1 className='item-inspection__tit-cards-info'>Inspected At: </h1>
                    <p className='item-inspection__description-cards-info'> {inspectedAt}</p>
                </div>
            </div>
            <div className='item-inspection__content-inspections'>
                <div className='content-inspections__area-btn-report'>
                    <button
                        className='area-btn-report__btn-report'
                    >Report Inspection</button>
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