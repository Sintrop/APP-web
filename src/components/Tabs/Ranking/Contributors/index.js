import React, { useEffect, useState } from "react";
import ContributorsService from "../../../../services/contributorService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function ContributorsRanking({ wallet, setTab }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const contributorsService = new ContributorsService(wallet);
  const [activist, setActivist] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
  
  useEffect(() => {
    contributorsService
      .getContributorsRanking()
      .then((res) => {
        if(res.length > 0){
        //   let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.level[0]) - parseInt(a.level[0]))
          setActivist(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className='header-isa'>
        <h1>{t('Contributors')}</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>{t('Wallet')}</th>
          <th>{t('Name')}</th>
         {/* <th>Developer Level</th> */}
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/contributor-page/${item.contributorWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                <p className="p-wallet" title={item.contributorWallet}>
                  {item.contributorWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            {/* <td>{item.level[0]}</td> */}
          </tr>
        ))}
      </table>
    </>
  );
}
