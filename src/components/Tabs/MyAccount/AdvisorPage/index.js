import React, {useEffect, useState, useContext} from 'react';
import {MainContext} from '../../../../contexts/main';
import AdvisorsService from '../../../../services/advisorsService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {get} from '../../../../config/infura';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdvisorPage({wallet, setTab}){
    const {t} = useTranslation();
    const {user, chooseModalRegister} = useContext(MainContext);
    const advisorService = new AdvisorsService(wallet)
    const [advisorData, setAdvisorData] = useState([]);
    const [base64, setBase64] = useState('');
    const {tabActive, walletSelected} = useParams();

    useEffect(() => {
        getAdvisor();
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    async function getAdvisor(){
        const response = await advisorService.getAdvisors(walletSelected);
        getBase64(response.proofPhoto)
        setAdvisorData(response);
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
                                {advisorData === [] ? '' : advisorData.advisorWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    {t('Report')} {t('Advisor')}
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    {t('Report')} {t('Advisor')}
                                </Dialog.Trigger>
                            )}
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {advisorData === [] ? '' : advisorData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Address')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {advisorData.advisorAddress === undefined ? '' : `${advisorData.advisorAddress.city}/${advisorData.advisorAddress.state}, ${advisorData.advisorAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}