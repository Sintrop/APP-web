import React, { useEffect, useState } from "react";
import {GetDevelopers} from "../../../../services/developersService";
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {RankingItem} from '../../../RankingItem';
import { BackButton } from "../../../BackButton";
import Loader from "../../../Loader";
import { useMainContext } from "../../../../hooks/useMainContext";
import { GetDevelopersInfura } from "../../../../services/methodsGetInfuraApi";

export default function DevelopersRanking({ wallet, setTab }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {viewMode} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [developers, setDevelopers] = useState([]);
    const {tabActive, walletAddress} = useParams();
        
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getDevelopers();
    }, []);
    
    async function getDevelopers(){
        setLoading(true);
        if(viewMode){
            const response = await GetDevelopersInfura();
            console.log(response);
            orderRanking(response);
        }else{
            const response = await GetDevelopers();
            orderRanking(response);
        }
    }

    function orderRanking(data){
        if(data.length > 0){
            let develoeprSort = data.map((item) => item ).sort( (a,b) => parseInt(b.pool.level) - parseInt(a.pool.level))
            setDevelopers(develoeprSort)
        }
        setLoading(false);
    }

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
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Developers')}</h1>
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                    >
                        <option value="">Todos os desenvolvedores</option>
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

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-5 lg:mt-14 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
                {developers.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum desenvolvedor cadastrado no sistema!</p>
                ) : (
                    <>
                    {developers.map((item, index) => (
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
