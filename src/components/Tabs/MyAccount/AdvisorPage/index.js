import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import AdvisorsService from '../../../../services/advisorsService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';

export default function AdvisorPage({wallet}){
    const advisorService = new AdvisorsService(wallet)
    const [advisorData, setAdvisorData] = useState([]);

    useEffect(() => {
        getAdvisor();
    },[]);

    async function getAdvisor(){
        const response = await advisorService.getAdvisors(wallet);
        setAdvisorData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Advisor Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {advisorData === [] ? '' : advisorData.advisorWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            <Dialog.Trigger className='area-avatar__btn-report'>
                                Report Advisor
                            </Dialog.Trigger>
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {advisorData === [] ? '' : advisorData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {advisorData.advisorAddress === undefined ? '' : `${advisorData.advisorAddress.city}/${advisorData.advisorAddress.state}, ${advisorData.advisorAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}