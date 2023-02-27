import React, { useEffect, useState } from "react";
import DeveloperService from "../../../../services/developersService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function DevelopersRanking({ wallet, setTab }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const developerService = new DeveloperService(wallet);
  const [activist, setActivist] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

  useEffect(() => {
    developerService
      .getDeveloperRanking()
      .then((res) => {
        if(res.length > 0){
          let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.level[0]) - parseInt(a.level[0]))
          setActivist(activistSort);
        }
        console.log(res)
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className='header-isa'>
        <h1>{t('Developers')}</h1>          
      </div> 
      <table border="1">
        <tr>
          <th>#</th>
          <th>{t('Wallet')}</th>
          <th>{t('Name')}</th>
          <th>{t('Developer Level')}</th>
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/developer-page/${item.developerWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                <p className="p-wallet" title={item.developerWallet}>
                  {item.developerWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            <td>{item.level[0]}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
