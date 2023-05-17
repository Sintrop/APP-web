import React, { useEffect, useState } from 'react';
import './researches.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalPublish } from './ModalPublish';
import Loading from '../../Loading';
import {GetResearches} from '../../../services/researchersService';
import { ResearchItem } from './ResearchItem';
import { useTranslation } from 'react-i18next';
import {useMainContext} from '../../../hooks/useMainContext';

export default function ResearchesPage({wallet, setTab}){
    const {user} = useMainContext();
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
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
                <div className='flex items-center justify-between mb-3 lg:mb-10'> 
                    <h1 className='font-bold text-2xl text-white'>{t('Researches')}</h1>
                    <div className='flex justify-center items-center gap-5'>
                        {user === '3' && (
                            <button
                                className='flex py-2 px-5 bg-[#ff9900] font-bold duration-200 rounded-lg lg:mt-0 lg:px-10'
                                onClick={() => setModalPublish(true)}
                            >
                                {t('Publish research')}
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col h-[90vh] pb-28 overflow-auto">
                    {researches.length === 0 ? (
                        <p className='font-bold text-white'>Nenhuma pesquisa publicada</p>
                    ) : (
                        <>
                            {researches.map(item => (
                                <ResearchItem 
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </>
                    )}
                </div>

            {loading && (
                <Loading/>
            )}

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
        </div>
    )

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