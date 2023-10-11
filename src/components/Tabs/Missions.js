import React, {useEffect, useState} from 'react';
import { BackButton } from '../BackButton';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export function Missions({setTab}){
    const {t} = useTranslation();
    const {tabActive} = useParams();

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive]);

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:pl-10 pt-1 lg:pt-10 overflow-auto h-screen pb-24 lg:pb-0'>
            <div className='flex items-center gap-2'>
                <BackButton/>
                <h1 
                    className='font-bold text-lg lg:text-2xl text-white'
                >{t('Missions')}</h1>
            </div>

            <div className='overflow-auto mt-2 lg:mt-5 pb-20 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
                <div className='flex flex-col lg:max-w-[1000px]'>
                    <div className='flex items-center justify-center bg-[#0a4303] text-white font-bold w-full rounded-md h-10'>
                        <h2>{t('Our mission is to regenerate the planet')}</h2>
                    </div>

                    <p className='text-white mt-5'>{t('Where are we going with planet earth')}?</p>
                    <p className='text-white'>{t('See in the figures below the comparison of part of the territory of South America in 1985 and 2020')}:</p>

                    <div className='flex flex-col items-center justify-center gap-4 lg:flex-row my-5'>
                        <div className='flex flex-col'>
                            <img
                                src={require('../../assets/1984.png')}
                                className='lg:w-[400px] object-contain'
                            />
                            <div className='flex items-center justify-center w-20 py-2 bg-white font-bold text-green-800 rounded-tr-lg mt-[-40px]'>
                                <p>1985</p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <img
                                src={require('../../assets/2020.png')}
                                className='lg:w-[400px] object-contain'
                            />
                            <div className='flex items-center justify-center w-20 py-2 bg-white font-bold text-green-800 rounded-tr-lg mt-[-40px]'>
                                <p>2020</p>
                            </div>
                        </div>
                    </div>

                    <p className='text-white text-justify'>{t('The process of deforestation and desertification of the territory and soil degradation is visible and frightening. What will the next photo in this sequence look like, in 2050, if we keep up the pace of destruction? How much biodiversity will be lost? How much CO2 will be emitted into the atmosphere? And going a little further, imagine now how it will be in 2500? Will there be life on earth if we continue at this pace')}?</p>
                    <p className='text-white text-justify mt-3'>{t("We are destroying Nature: Depleting soils. Finishing and contaminating with water. Extinct biodiversity. Emitting a lot of greenhouse gases")}.</p>
                    <p className='text-white mt-3'>{t('Unfortunately, we are on the path of economic and socio-environmental collapse')}.</p>
                    <p className='text-white mt-3'>{t("It is such a big problem that it affects all living beings that live here and also future generations. The need for change is urgent and we need to change before it's too late")}!</p>
                    <p className='text-white mt-3'>{t('Instead of deforesting, reforest')}.</p>
                    <p className='text-white mt-3'>{t('Instead of eroding soils, recover them')}.</p>
                    <p className='text-white mt-3'>{t('Instead of depleting and contaminating water, recover springs and rivers')}.</p>
                    <p className='text-white mt-3'>{t('Instead of exterminating biodiversity, live in harmony with the other forms of life that live here')}.</p>
                    <p className='text-white mt-3'>{t('The level of environmental degradation is currently enormous. And the level of regeneration and restoration of ecosystems is still very low')}.</p>
                    
                    <p className='text-white font-bold mt-8'>{t('Our mission is to reverse this scenario and regenerate the Planet')}.</p>

                    <img
                        src={require('../../assets/grafico-missoes-1.png')}
                        className='lg:w-[400px] object-contain my-3'
                    />

                    <p className='text-white'>{t('When we begin to regenerate a larger area than we degraded, we will be on the way to solving environmental and climate change problems by the cause, and not by treating the symptoms of this serious disease')}.</p>
                    <p className='text-white mt-3'>{t("The solution is to use nature's ancient wisdom to our advantage. The solution is to make agroforestry and all forms of agriculture that regenerate ecosystems the norm in our society")}.</p>
                </div>
            </div>
        </div>
    )
}