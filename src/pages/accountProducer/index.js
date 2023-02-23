import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './accountProducer.css';
import {get} from '../../config/infura';
import Logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import AvatarDefault from '../../assets/img/avatar02.png';

//services
import {GetDelation, GetInspections, GetProducer} from '../../services/accountProducerService';

//components
import ItemInspection from '../../components/ProducerPageComponents/ItemInspection';

export default function AccountProducer(){
    const {walletAddress} = useParams();
    const [producerData, setProducerData] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [delationsReiceved, setDelationsReiceved] = useState('0');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');

    useEffect(() => {
        getProducer();
    },[]);

    async function getProducer(){
        const response = await GetProducer(walletAddress);
        setProducerData(response);
        getBase64(response.proofPhoto);
        const delations = await GetDelation(response.producerWallet);
        setDelationsReiceved(delations.length);
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getBase64(path){
        const base64 = await get(path);
        setProofPhotoBase64(base64);
    }

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
                            <h1 className='tit-cards-info__account-producer-page'>Producer Wallet: </h1>
                            <a className='description-cards-info__account-producer-page' href={`/account-producer/${producerData.producerWallet}`}>
                                {producerData === [] ? '' : producerData.producerWallet}
                            </a>
                        </div>

                        <button
                            className='area-avatar__btn-report'
                        >Report Producer</button>
                    </div>  

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Name: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData === [] ? '' : producerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Address: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData.propertyAddress === undefined ? '' : `${producerData?.propertyAddress.street}, ${producerData.propertyAddress.city}-${producerData.propertyAddress.state}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Inspections Reiceved: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData === [] ? '' : producerData.totalInspections}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Isa Score: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData.isa === undefined ? '' : producerData.isa.isaScore}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Isa Average: </h1>
                        <p className='description-cards-info__account-producer-page'>
                            {producerData?.totalInspections === '0' ? '0' : Number(producerData?.isa?.isaScore) / Number(producerData?.totalInspections)}
                        </p>
                    </div>

                    <div className='producer-cards-info__account-producer-page'>
                        <h1 className='tit-cards-info__account-producer-page'>Delations Received: </h1>
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