import React, { useEffect, useState } from 'react';
import './researches.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalPublish } from './ModalPublish';
import Loading from '../../Loading';
import {GetResearches} from '../../../services/researchersService';
import { ResearchItem } from './ResearchItem';
import { useTranslation } from 'react-i18next';

export default function ResearchesPage({user, wallet, setTab}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const {tabActive, walletAddress} = useParams();
    const [modalPublish, setModalPublish] = useState(false);
    const [researches, setResearches] = useState([]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getResearches();
    },[])

    async function getResearches(){
        setLoading(true);
        const response = await GetResearches();
        setResearches(response);
        setLoading(false);
    }

    return(
        <div className='reports__container'>
            <div className='header-isa'>
                <h1>{t('Researches')}</h1>
                <div className='area-btn-header-isa-page'>
                    {user === '3' && (
                        <button
                            className='btn-new-category-isa'
                            onClick={() => setModalPublish(true)}
                        >
                            {t('Publish research')}
                        </button>
                    )}
                </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', height: '70vh', overflow: 'auto'}}>
                {researches.map(item => (
                    <ResearchItem 
                        key={item.id}
                        data={item}
                    />
                ))}
            </div>

            <Dialog.Root
                open={modalPublish}
                onOpenChange={(open) => setModalPublish(open)}
            >
                <ModalPublish
                    walletAddress={walletAddress}
                    close={() => {
                        setModalPublish(false)
                        getResearches()
                    }}
                />
            </Dialog.Root>

            {loading && <Loading/>}
        </div>
    )
}