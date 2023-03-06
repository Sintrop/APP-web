import React, {useEffect, useState, useContext} from 'react';
import { MainContext } from '../../../../contexts/main';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import InvestorService from '../../../../services/investorService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function InvestorPage({wallet, setTab}){
    const {t} = useTranslation();
    const {user, chooseModalRegister} = useContext(MainContext);
    const investorService = new InvestorService(wallet)
    const [investorData, setInvestorData] = useState([]);
    const {tabActive, walletSelected} = useParams();

    useEffect(() => {
        getInvestor();
    },[]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    async function getInvestor(){
        const response = await investorService.getInvestor(walletSelected);
        setInvestorData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page'>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>{t('Wallet')}: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {investorData === [] ? '' : investorData.investorWallet}
                            </a>
                        </div>

                        <Dialog.Root>
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    {t('Report')} {t('Investor')}
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    {t('Report')} {t('Investor')}
                                </Dialog.Trigger>
                            )}
                            <ModalDelation reportedWallet={wallet}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {investorData === [] ? '' : investorData.name}
                        </p>
                    </div>

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Address')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {investorData.investorAddress === undefined ? '' : `${investorData.investorAddress.city}/${investorData.investorAddress.state}, ${investorData.investorAddress.country}`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}