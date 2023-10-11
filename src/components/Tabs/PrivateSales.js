import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { QuoteItem } from '../QuoteItem';
import { ModalReserve } from '../ModalReserve';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';

export function PrivateSales({setTab}){
    const {t} = useTranslation();
    const {tabActive} = useParams();
    const [quotes, setQuotes] = useState([]);
    const [modalReserve, setModalReserve] = useState(false);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getQuotes();
    }, []);

    async function getQuotes(){
        try{
            const responseQuotes = await api.get('/quotes');
            setQuotes(responseQuotes.data.quotes);
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div className='flex flex-col w-full px-2 lg:pl-10 lg:pr-0 bg-green-950 pt-5'>
            <div className='flex flex-col w-full overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
            <div className='flex flex-col lg:w-[950px] h-[97vh]'>
                <h1 className='font-bold text-white text-2xl'>{t('Seed Round')}</h1>

                <div className='flex items-center flex-col lg:flex-row gap-5 w-full mt-5'>
                    <div className='flex items-center flex-col lg:flex-row justify-center gap-5 lg:w-[60%] lg:h-[350px] rounded-md bg-[#0a4303] p-2'>
                        <img
                            src={require('../../assets/private-sales-1.png')}
                            className='w-[200px] object-contain'
                        />
                        <p className='text-white lg:w-[300px] text-sm'>{t("We are looking for investors who share our vision and want to fight for the regeneration of the Planet. It is the opportunity to be part of the first offer to sell the Regeneration Credit. The investment will be used for market testing, marketing and sales, product development and smart contract auditing. To understand our business model, download our presentation. To understand the whole logic of the Decentralized System for the Regeneration of Nature, download our whitepaper. Or schedule a meeting with our team")}!</p>
                    </div>

                    <div className='flex flex-col items-center justify-center w-full lg:w-[38%] lg:h-[350px] rounded-md bg-[#0a4303] p-2'>
                        <p className='text-white font-bold text-lg'>{t('Sales status')}</p>

                        <p className='text-yellow-300 font-bold mt-2'>R$ 44.000,00</p>
                        <p className='text-white font-bold'>{t('OF')}</p>
                        <p className='text-yellow-300 font-bold'>R$ 1.100.000,00</p>

                        <a 
                            href='https://www.sintrop.com/presentation-investors.pdf'
                            target='_blank'
                            className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2 flex items-center justify-center'
                        >
                            {t('DOWNLOAD PRESENTATION')}
                        </a>

                        <a 
                            href='https://calendly.com/andre-sintrop/agendar?month=2023-09'
                            target='_blank'
                            className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2 flex items-center justify-center'
                        >
                            {t('SCHEDULE MEETING')}
                        </a>

                        <a 
                            href='https://www.sintrop.com/assets/qr-code/whitepaper.pdf'
                            target='_blank'
                            className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2 flex items-center justify-center'
                        >
                            {t('DOWNLOAD WHITEPAPER')}
                        </a>

                        <a 
                            href='https://docs.google.com/spreadsheets/d/1B98efJjfopv26cYUvu2GLK28iEb7qPx9GJkTHdItB4A/edit?usp=sharing'
                            target='_blank'
                            className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2 flex items-center justify-center'
                        >
                            {t('FINANCIAL PROJECTION')}
                        </a>
                    </div>
                </div>

                <div className='flex items-center flex-col lg:flex-row gap-5 w-full mt-10'>
                    <div className='flex flex-col p-3 w-full lg:w-[49%] lg:h-[350px] rounded-md bg-[#0a4303]'>
                        <div className='w-full h-12 bg-green-950 flex items-center justify-center'>
                            <p className='font-bold text-yellow-300 text-sm lg:text-xl'>{t('OFFER')}</p>
                        </div>
                        
                        <div className='w-full flex items-center justify-between mt-5'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Offered Tokens')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>39.000.000</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-sm lg:text-xl'>% {t('From private offer')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>8,97%</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Unitary value')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>R$ 0,0282</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Capitalization target')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>R$ 1.100.000,00</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Private market cap')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>R$ 12.267.000,00</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col p-3 lg:w-[49%] lg:h-[350px] rounded-md bg-[#0a4303]'>
                        <div className='w-full h-12 bg-green-950 flex items-center justify-center'>
                            <p className='font-bold text-yellow-300 text-sm lg:text-xl'>1 {t('QUOTA')}</p>
                        </div>
                        
                        <div className='w-full flex items-center justify-between mt-5'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Regeneration Credits')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>1.560.000</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-sm lg:text-xl'>{t('Investment')}</p>
                            <div className='w-32 lg:w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-sm lg:text-xl'>R$ 44.000,00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-between w-full mt-10'>
                    <h3 className='font-bold text-white text-2xl'>{t('Quots')}</h3>

                    <button
                        onClick={() => setModalReserve(true)}
                        className='px-3 py-2 rounded-md font-bold text-green-700 bg bg-yellow-300'
                    >
                        {t('Reserve Quot')}
                    </button>
                </div>
                <div className='flex items-center justify-center gap-3 flex-wrap mt-2'>
                    {quotes.map((item, index) => (
                        <QuoteItem
                            key={item.id}
                            data={item}
                            index={index + 1}
                            attQuots={getQuotes}
                        />
                    ))}
                </div>
            </div>
            </div>
            
            {quotes.length > 0 && (
                <Dialog.Root
                    open={modalReserve}
                    onOpenChange={(open) => setModalReserve(open)}
                >
                    <ModalReserve
                        quotes={quotes}
                        close={() => {
                            setModalReserve(false);
                            getQuotes();
                        }}
                    />
                </Dialog.Root>
            )}
        </div>
    );
}