import React, { useEffect, useState } from "react";
import {GetActivists} from "../../../../services/activistService";
import {GetActivistsInfura} from '../../../../services/methodsGetInfuraApi';
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { RankingItem } from "../../../RankingItem";
import {BackButton} from '../../../BackButton';
import Loader from '../../../Loader';
import { useMainContext } from "../../../../hooks/useMainContext";

export default function ActivistRanking({ wallet, setTab }) {
    const {viewMode} = useMainContext();
    const {t} = useTranslation();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [activist, setActivist] = useState([]);
    const {tabActive, walletAddress} = useParams();
    const [inputFilter, setInputFilter] = useState('');
    const [filterSelect, setFilterSelect] = useState('reais');
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {    
        getActivists();
    }, []);

    async function getActivists(){
        setLoading(true);
        if(viewMode){
            const response = await GetActivistsInfura();
            orderRaking(response);
        }else{
            const response = await GetActivists();
            orderRaking(response);
        }
    }
    
    function orderRaking(res){
        if(res.length > 0){
            let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
            setActivist(activistSort);
        }
        setLoading(false);
    }

    function filter(type, activistArray){
        if(type === 'all'){
            getActivists('all');
        }

        if(type === 'wallet'){
            let users = activist;
            const usersFilter = users.filter(item => item.activistWallet === inputFilter);
            setActivist(usersFilter);
        }

        if(type === 'reais'){
            let users = activistArray;
            const usersFilter = users.filter(item => item.activistWallet === '0x954B8C950A9F9b6fDf6082033aE741a22FC137d2' ||
                item.activistWallet === '0x55E75F35a5AAd1676749a3a03c85c6ea70A5F72A' ||
                item.activistWallet === '0x4E5C1Cf06094C64c3396E96d00B787392B2b5cB6' ||
                item.activistWallet === '0x67879715dFaCBBF3b759558686c94114764a6462'
            );
            setActivist(usersFilter);
        }
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
            <div className='flex items-center justify-between mb-2 lg:mb-5'>
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className="font-bold text-lg lg:text-2xl text-white">{t('Inspectors')}</h1>
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                        onChange={(e) => {
                            setFilterSelect(e.target.value)
                            if(e.target.value === 'all'){
                                setInputFilter('');
                                filter('all')
                            }
                            if(e.target.value === 'reais'){
                                setInputFilter('');
                                filter('reais', activist)
                            }
                        }}
                        value={filterSelect}
                    >
                        <option value="reais">Inspetores reais</option>
                        <option value="all">Todos os inspetores</option>
                        <option value="wallet">Buscar pela wallet</option>
                    </select>
                </div>
                <div className="flex bg-white h-full w-[70%] px-3 rounded-r-md">
                    <input
                        className="bg-white border-0 h-full w-full"
                        placeholder="Digite aqui"
                        value={inputFilter}
                        onChange={(e) => setInputFilter(e.target.value)}
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

            <div className="flex h-[95vh] pb-40 overflow-auto justify-center flex-wrap gap-5 mt-2 lg:mt-14 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md">
                {activist.length === 0 ? (
                    <p className="text-white font-bold text-center mt-10">Nenhum ativista cadastrado no sistema!</p>
                ) : (
                    <>
                    {activist.map((item, index) => (
                        <RankingItem
                            key={item.id}
                            data={item}
                            position={index + 1}
                            filterSelect={filterSelect}
                        />
                    ))}
                    </>
                )}
            </div>
        </div>
    )

    return (
    <>
      <div className='header-isa'>
        <h1>{t('Activists')}</h1>          
      </div> 
      <table border="1">
        <tr>
          <th>#</th>
          <th>{t('Wallet')}</th>
          <th>{t('Name')}</th>
          <th>{t('Address')}</th>
          <th>{t('Inspections Realized')}</th>
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/activist-page/${item.activistWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                <p className="p-wallet" title={item.activistWallet}>
                  {item.activistWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            <td>
              <div className="div-address">
                {item.activistAddress.map((address) => (
                  <p>{address},</p>
                ))}
              </div>
            </td>
            <td>{item.totalInspections}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
