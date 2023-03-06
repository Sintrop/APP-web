import React, {useEffect, useState, useContext} from 'react';
import { MainContext } from '../../../../contexts/main';
import DevelopersService from '../../../../services/developersService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export default function DeveloperPage({wallet, setTab}){
    const {t} = useTranslation();
    const {user, chooseModalRegister} = useContext(MainContext);
    const developersService = new DevelopersService(wallet)
    const [developerData, setDeveloperData] = useState([]);
    const [base64, setBase64] = useState('');
    const {tabActive, walletSelected} = useParams();

    useEffect(() => {
        getDeveloper();
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    async function getDeveloper(){
        const response = await developersService.getDeveloper(walletSelected);
        getBase64(response.proofPhoto)
        setDeveloperData(response);
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
                        <img src={`data:image/png;base64,${base64}`} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>{t('Wallet')}: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {developerData === [] ? '' : developerData.developerWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    {t('Report')} {t('Developer')}
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    {t('Report')} {t('Developer')}
                                </Dialog.Trigger>
                            )}
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData === [] ? '' : developerData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Address')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.userAddress === undefined ? '' : `${developerData.userAddress.city}/${developerData.userAddress.state}, ${developerData.userAddress.country}`}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Level')}:</h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.level === undefined ? '' : developerData.level.level}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Current ERA')}:</h1>
                        <p className='description-cards-info__producer-page'>
                            {developerData.level === undefined ? '' : developerData.level.currentEra}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}