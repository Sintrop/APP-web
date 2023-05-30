import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useParams } from 'react-router';
import {get} from '../../config/infura';

export function NetworkImpact({setTab}){
    const [impact, setImpact] = useState({});
    const [usersCount, setUsersCount] = useState({});
    const {t} = useTranslation();
    const {tabActive} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getImpact();
        
    }, []);

    async function getImpact(){
        const response = await api.get('network-impact')
        setImpact(response.data?.impact[0]);
        const users = await api.get('users_count')
        setUsersCount(users.data)
        const res = await get('QmYo8zPzDPwo513QrBC563CpURki3WGLpFjvkmZ9W8dnCw');
        console.log(res);
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto h-screen'>
            <h1 className='font-bold text-2xl text-white'>{t('Network Impact')}</h1>

            <section className="flex flex-col items-center py-5 rounded-lg bg-[#0A4303] lg:w-[1000px] mt-10 px-2 mx-2 lg:mx-0">
                    <p className="text-white mb-5 font-bold">{t('IMPACTO DA NOSSA REDE')}</p>

                    <div className="flex items-center gap-2 flex-wrap justify-center">

                        <div className="flex flex-col lg:w-[300px] lg:h-[250px] justify-between lg:p-2 lg:border-r-2 border-green-950">
                            <div className="flex items-center gap-2 py-5">
                                <img
                                    src={require('../../assets/token.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <div className='flex flex-col'>
                                    <p className='text-white'>{t("VALOR DO CRÉDITO DE REGENERAÇÃO")}</p>
                                    <p className='text-white'>R$ 0,025</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-5 border-b-2 lg:border-0">
                                <img
                                    src={require('../../assets/globo-branco.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <div className='flex flex-col'>
                                    <p className='text-white'>CIRCULATING MARKET CAP</p>
                                    <p className='text-white'>R$ 0,00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-[90%] lg:w-[300px] lg:h-[250px] lg:p-2 lg:border-r-2 gap-2 border-green-950">
                            
                                <div className="flex items-center gap-2">
                                    <div className='flex flex-col font-bold'>
                                        <p className='text-[#ff9900]'>CO²</p>
                                        <img
                                            src={require('../../assets/co2.png')}
                                            alt='Token da sintrop'
                                            className='w-[40px] h-[40px] object-contain mt-[-8px]'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5'>{impact?.carbon} <span className='font-bold text-sm'>Kg</span></p>
                                </div>

                                <div className="flex items-center gap-2 mt-[-8px]">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Solo")}</p>
                                        <img
                                            src={require('../../assets/solo.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5 ml-1'>{impact?.solo} <span className='font-bold text-sm'>m²</span></p>
                                </div>
                            
                                <div className="flex items-center gap-2">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Biodiversidade")}</p>
                                        <img
                                            src={require('../../assets/bio.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg ml-[-75px] flex items-end gap-1 mt-5'>{impact?.bio} <span className='font-bold text-sm'>uni</span></p>
                                </div>

                                <div className="flex items-center gap-2 ">
                                    <div className='flex flex-col'>
                                        <p className='text-[#ff9900] font-bold'>{t("Água")}</p>
                                        <img
                                            src={require('../../assets/agua.png')}
                                            alt='Token da sintrop'
                                            className='w-[30px] h-[30px] object-contain'
                                        />
                                    </div>
                                    <p className='text-white font-bold text-lg flex items-end gap-1 mt-5 ml-[-5px]'>{impact?.agua} <span className='font-bold text-sm'>m³</span></p>
                                </div>
                            
                        </div>

                        <div className="flex flex-col w-[300px] h-[250px] justify-between lg:p-2 px-5">
                            <div className="flex items-center gap-2">
                                <img
                                    src={require('../../assets/token.png')}
                                    alt='Token da sintrop'
                                    className='w-[50px] h-[50px] object-contain'
                                />
                                <p className='text-white'>{t("IMPACTO POR TOKEN")}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/co2.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>0 <span className='font-bold text-base'>kg</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/solo.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>0 <span className='font-bold text-base'>m²</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/agua.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>0 <span className='font-bold text-base'>m³</span></p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className='flex flex-col'>
                                    <img
                                        src={require('../../assets/bio.png')}
                                        alt='Token da sintrop'
                                        className='w-[25px] h-[25px] object-contain'
                                    />
                                </div>
                                <p className='text-white font-bold text-2xl flex items-end gap-2'>0 <span className='font-bold text-base'>uni</span></p>
                            </div>
                        </div>

                    </div>

                    <div className='flex flex-col lg:flex-row items-center w-full justify-between lg:px-20 mt-5'>
                        <p className='text-white font-bold'>{t("PRODUTORES")}: <span className='text-blue-500'>{usersCount?.producersCount}</span></p>
                        <p className='text-white font-bold'>{t("ATIVISTAS")}: <span className='text-blue-500'>{usersCount?.activistsCount}</span></p>
                        <p className='text-white font-bold'>{t("PESQUISADORES")}: <span className='text-blue-500'>{usersCount?.researchersCount}</span></p>
                    </div>
                </section>
        </div>
    )
}