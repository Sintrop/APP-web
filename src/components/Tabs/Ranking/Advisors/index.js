import React, { useEffect, useState } from "react";
import AdvisorsService from "../../../../services/advisorsService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";

export default function AdvisorsRanking({ wallet, setTab }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const advisorsService = new AdvisorsService(wallet);
    const [advisors, setAdvisors] = useState([]);
    const {tabActive, walletAddress} = useParams();
        
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        advisorsService
        .getAdvisorsRanking()
        .then((res) => {
            if(res.length > 0){
            //   let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.level[0]) - parseInt(a.level[0]))
            setAdvisors(res);
            }
        })
        .catch((err) => console.log(err));
    }, []);
    return (
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-5 lg:pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className="font-bold text-2xl text-white">{t('Advisors')}</h1>
                
            </div>

            <div className="flex items-center h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                    >
                        <option value="">Todos os conselheiros</option>
                        <option value="">Buscar pela wallet</option>
                        <option value="">Buscar pelo nome</option>
                    </select>
                </div>
                <div className="flex bg-white h-full w-[70%] px-3 rounded-r-md">
                    <input
                        className="bg-white border-0 h-full w-full"
                        placeholder="Digite aqui"
                    />
                    <button
                        className="font-bold py-2 rounded-md bg-white"
                    >
                        <img
                            src={require('../../../../assets/icon-search.png')}
                            className="w-[30px] h-[30px] object-contain"
                        />
                    </button>
                </div>
                
            </div>

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-5 lg:mt-14">
                {advisors.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum conselheiro cadastrado no sistema!</p>
                ) : (
                    <>
                    {advisors.map((item, index) => (
                        <RankingItem
                            data={item}
                            position={index + 1}
                        />
                    ))}
                    </>
                )}
            </div>
        </div>
    );
}
