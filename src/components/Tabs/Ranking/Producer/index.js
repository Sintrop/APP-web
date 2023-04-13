import React, { useEffect, useState } from "react";
import ProducerService from "../../../../services/producerService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";

export default function ProducerRanking({ wallet, setTab }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const producerService = new ProducerService(wallet);
    const [producers, setProducers] = useState([]);
    const {tabActive, walletAddress} = useParams();
        
        useEffect(() => {
            setTab(tabActive, '')
        }, [tabActive])

    useEffect(() => {
        producerService
        .getProducerRanking()
        .then((res) =>{
            if(res.length > 0){

            let producerSort = res.map((item) => item ).sort( (a,b) => parseInt(b.isa.isaScore) - parseInt(a.isa.isaScore))
            
            setProducers(producerSort)
            } 
        })
        .catch((err) => console.log(err));
    }, []);

    return (
        <div className='flex flex-col h-[100vh] bg-green-950 px-10 pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className="font-bold text-2xl text-white">{t('Producers')}</h1>
                
            </div>

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-10">
                {producers.map((item, index) => (
                    <RankingItem
                        data={item}
                        position={index + 1}
                    />
                ))}
            </div>
        </div>
    )
}
