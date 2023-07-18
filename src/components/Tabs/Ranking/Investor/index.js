import React, { useEffect, useState } from "react";
import InvestorService from "../../../../services/investorService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";
import { BackButton } from "../../../BackButton";
import { GetCertificateTokens } from "../../../../services/accountProducerService";
import Loading from '../../../Loading';

export default function InvestorRanking({ wallet, setTab }) {
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const investorService = new InvestorService(wallet);
    const [investor, setInvestor] = useState([]);
    const {tabActive, walletAddress} = useParams();
        
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    
    useEffect(() => {
        setLoading(true);
        investorService
        .getInvestorRanking()
        .then((res) => {
            orderRanking(res);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
        });
    }, []);

    async function orderRanking(investors){
        let arrayInvestors = [];
        for(var i = 0; i < investors.length; i++){
            const tokens = await GetCertificateTokens(investors[i].investorWallet);
            let data = {
                ...investors[i],
                tokens: Number(tokens) / 10 ** 18
            }
            arrayInvestors.push(data);
        }

        let investorsSort = arrayInvestors.map(item => item ).sort((a, b) => parseInt(b.tokens) - parseInt(a.tokens))
        setInvestor(investorsSort)
    }

    return (
        <div className='flex flex-col h-[100vh] bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Investors')}</h1>
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                    >
                        <option value="">Todos os investidores</option>
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
                {investor.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum investidor cadastrado no sistema!</p>
                ) : (
                    <>
                    {investor.map((item, index) => (
                        <RankingItem
                            data={item}
                            position={index + 1}
                        />
                    ))}
                    </>
                )}
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    );
}
