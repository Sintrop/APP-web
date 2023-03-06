import React, { useEffect, useState } from "react";
import ResearchersService from "../../../../services/researchersService";
import "../../Ranking/ranking.css";
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function ResearchersRanking({ wallet, setTab }) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const researchersService = new ResearchersService(wallet);
  const [researchers, setResearchers] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

  useEffect(() => {
    researchersService
      .getResearcherRanking()
      .then((res) => {
        if (res.length > 0) {
          //   let investorSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
          setResearchers(res);
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
    <div className='header-isa'>
        <h1>{t('Researchers')}</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>{t('Wallet')}</th>
          <th>{t('Name')}</th>
          <th>{t('Votes Received')}</th>
        </tr>
        {researchers?.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/researcher-page/${item.researcherWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                {item.researcherWallet}
              </a>
            </td>
            <td>{item.name}</td>
            {/* <td>{item.totalInspections}</td> */}
          </tr>
        ))}
      </table>
    </>
  );
}
