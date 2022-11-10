import React, {useEffect, useState} from 'react';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import DevelopersService from '../../../../services/developersService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';

export default function DeveloperPage({wallet}){
    const developersService = new DevelopersService(wallet)
    const [developerData, setDeveloperData] = useState([]);

    useEffect(() => {
        getDeveloper();
    },[]);

    async function getDeveloper(){
        const response = await developersService.getDeveloper(wallet);
        setDeveloperData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>Developer Wallet: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {developerData === [] ? '' : developerData.developerWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            <Dialog.Trigger className='area-avatar__btn-report'>
                                Report Developer
                            </Dialog.Trigger>
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Name: </h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData === [] ? '' : developerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Address: </h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.userAddress === undefined ? '' : `${developerData.userAddress.city}/${developerData.userAddress.state}, ${developerData.userAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Level:</h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.level === undefined ? '' : developerData.level.level}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>Current Era:</h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.level === undefined ? '' : developerData.level.currentEra}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}