import React, { useEffect, useState } from "react";
import ResearchersService from "../../../../services/researchersService";
import "../../Ranking/ranking.css";
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";
import { BackButton } from "../../../BackButton";
import Loader from "../../../Loader";

export default function ResearchersRanking({ wallet, setTab }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const researchersService = new ResearchersService(wallet);
    const [researchers, setResearchers] = useState([]);
    const {tabActive, walletAddress} = useParams();
        
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        setLoading(true);
        researchersService
        .getResearcherRanking()
        .then((res) => {
            if (res.length > 0) {
            let researchersSort = res.map(item => item ).sort((a, b) => parseInt(b.publishedWorks) - parseInt(a.publishedWorks))
            setResearchers(researchersSort);
            }
            setLoading(false);
        })
        .catch((err) => setLoading(false));
    }, []);

    if(loading){
        return(
            <div className="flex items-center justify-center bg-green-950 w-full h-screen">
                <Loader
                    color='white'
                    type='hash'
                />
            </div>
        )
    }

    return (
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Researchers')}</h1>
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                    >
                        <option value="">Todos os pesquisadores</option>
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
                            className="w-[20px] lg:w-[30px] object-contain"
                        />
                    </button>
                </div>
                
            </div>

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-2 lg:mt-14">
                {researchers.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum pesquisador cadastrado no sistema!</p>
                ) : (
                    <>
                    {researchers.map((item, index) => (
                        <RankingItem
                            key={item.id}
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
