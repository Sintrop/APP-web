import React, {useState, useEffect} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import ActivistService from '../../../../services/activistService';
import {GetInspections} from '../../../../services/manageInspectionsService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';

//components
import ItemInspection from '../../../ProducerPageComponents/ItemInspection';

export default function ActivistPage({wallet, setTab}){
    const activistService = new ActivistService(wallet)
    const [activistData, setActivistData] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [base64, setBase64] = useState('');
    const {tabActive, walletSelected} = useParams();

    useEffect(() => {
        getActivist();
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    async function getActivist(){
        const response = await activistService.getAtivist(walletSelected);
        setActivistData(response)
        getBase64(response.proofPhoto)
        getInspections();
    }

    async function getInspections(){
        const response = await GetInspections();
        setInspections(response);
    }

    async function getBase64(data){
        const res = await get(data);
        console.log(res)
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
                            <h1 className='tit-cards-info__producer-page'>Activist Wallet: </h1>
                            <a className='description-cards-info__producer-page'>
                                {activistData === [] ? '' : activistData.activistWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            <Dialog.Trigger className='area-avatar__btn-report'>
                                Report Activist
                            </Dialog.Trigger>
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
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
                                    setTab={(tab, wallet) => setTab(tab, wallet)}
                                    typeAccount='activist'     
                                />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}