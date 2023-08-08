import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { QuoteItem } from './QuoteItem';
import { ModalReserve } from './ModalReserve';
import * as Dialog from '@radix-ui/react-dialog';

export function PrivateSales(){
    const {t} = useTranslation();
    const [quotes, setQuotes] = useState([]);
    const [modalReserve, setModalReserve] = useState(false);

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
        <div className='flex flex-col w-full items-center bg-green-950 pt-5'>
            <div className='flex flex-col w-full items-center overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
            <div className='flex flex-col w-[1000px] h-[97vh]'>
                <h1 className='font-bold text-white text-2xl'>{t('Private Sales')} 1</h1>

                <div className='flex items-center gap-5 w-full'>
                    <div className='flex items-center justify-center gap-5 w-[60%] h-[350px] rounded-md bg-[#0a4303]'>
                        <img
                            src={require('../../assets/private-sales-1.png')}
                            className='w-[250px] object-contain'
                        />
                        <p className='text-white w-[200px]'>{t("We are with our first private sales open for funding. We are looking for angel investors that share our vision and want to fight for the planet's regeneration")}.</p>
                    </div>

                    <div className='flex flex-col items-center justify-center w-[38%] h-[350px] rounded-md bg-[#0a4303]'>
                        <p className='text-white font-bold text-sm'>{t('TOKEN SALE START')}</p>
                        <p className='text-white text-sm'>AUGUST 23</p>
                        <p className='text-white font-bold mt-2 text-sm'>{t('TOKEN SALE END')}</p>
                        <p className='text-white text-sm'>NOVEMBER 30</p>

                        <p className='text-yellow-300 font-bold mt-2'>R$ 44.000,00</p>
                        <p className='text-white font-bold'>{t('OF')}</p>
                        <p className='text-yellow-300 font-bold'>R$ 1.100.000,00</p>

                        <button className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2'>
                            {t('DOWNLOAD PRESENTATION')}
                        </button>

                        <button className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2'>
                            {t('SCHEDULE MEETING')}
                        </button>

                        <button className='w-56 bg-yellow-300 h-10 rounded-md text-green-700 text-sm mt-2'>
                            {t('DOWNLOAD WHITEPAPER')}
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-5 w-full mt-10'>
                    <div className='flex flex-col p-3 w-[49%] h-[350px] rounded-md bg-[#0a4303]'>
                        <div className='w-full h-12 bg-green-950 flex items-center justify-center'>
                            <p className='font-bold text-yellow-300 text-xl'>{t('OFFER')}</p>
                        </div>
                        
                        <div className='w-full flex items-center justify-between mt-5'>
                            <p className='font-bold text-white text-xl'>{t('Offered Tokens')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>39.000.000</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-xl'>% {t('From private offer')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>8,97%</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-xl'>{t('Unitary value')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>R$ 0,0282</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-xl'>{t('Capitalization target')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>R$ 1.100.000,00</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-xl'>{t('Private market cap')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>R$ 12.267.000,00</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col p-3 w-[49%] h-[350px] rounded-md bg-[#0a4303]'>
                        <div className='w-full h-12 bg-green-950 flex items-center justify-center'>
                            <p className='font-bold text-yellow-300 text-xl'>1 {t('QUOTA')}</p>
                        </div>
                        
                        <div className='w-full flex items-center justify-between mt-5'>
                            <p className='font-bold text-white text-xl'>{t('Regeneration Credits')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>1.560.000,00</p>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-3'>
                            <p className='font-bold text-white text-xl'>{t('Investment')}</p>
                            <div className='w-48 bg-green-950 h-10 flex items-center justify-end pr-2'>
                                <p className='font-bold text-white text-xl'>R$ 44.000,00</p>
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
                <div className='flex items-center gap-3 flex-wrap mt-2'>
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