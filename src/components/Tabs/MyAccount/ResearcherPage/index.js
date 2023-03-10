import React, {useEffect, useState, useContext} from 'react';
import { MainContext } from '../../../../contexts/main';
import AvatarDefault from '../../../../assets/img/avatar03.png';
import ResearchersService from '../../../../services/researchersService';
import * as Dialog from '@radix-ui/react-dialog';
import ModalDelation from '../../../ModalDelation';
import {useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ResearcherPage({wallet, setTab}){
    const {t} = useTranslation();
    const {user, chooseModalRegister} = useContext(MainContext);
    const researchersService = new ResearchersService(wallet);
    const [researcherData, setResearcherData] = useState([]);
    const {tabActive, walletSelected} = useParams();
    const [modalDelation, setModalDelation] = useState(false);

    useEffect(() => {
        getResearcher();
    },[]);

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive])

    async function getResearcher(){
        const response = await researchersService.getResearchers(walletSelected);
        setResearcherData(response);
    }

    return(
        <div className='container__producer-page'>
            <div className='content__producer-page'>
                <div className='producer-area-info__producer-page' style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <div className='area-avatar__producer-page'>
                        <img src={AvatarDefault} className='avatar__producer-page'/>
                        <div className='producer-cards-info__producer-page card-wallet'>
                            <h1 className='tit-cards-info__producer-page'>{t('Wallet')}: </h1>
                            <a className='description-cards-info__producer-page' href='#'>
                                {researcherData === [] ? '' : researcherData.researcherWallet}
                            </a>
                        </div>

                        <Dialog.Root
                            open={modalDelation}
                            onOpenChange={(open) => setModalDelation(open)}
                        >
                            {user === '0' ? (
                                <button className='area-avatar__btn-report' onClick={chooseModalRegister}>
                                    {t('Report')} {t('Researcher')}
                                </button>
                            ) : (
                                <Dialog.Trigger className='area-avatar__btn-report'>
                                    {t('Report')} {t('Researcher')}
                                </Dialog.Trigger>
                            )}
                            <ModalDelation reportedWallet={wallet} close={() => setModalDelation(false)}/>
                        </Dialog.Root>
                    </div>  

                    <div className='producer-cards-info__producer-page'>
                        <h1 className='tit-cards-info__producer-page'>{t('Name')}: </h1>
                        <p className='description-cards-info__producer-page'>
                            {researcherData === [] ? '' : researcherData.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}