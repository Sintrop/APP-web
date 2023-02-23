import React, { useEffect, useState } from "react";
import ResearchersService from "../../../../services/researchersService";
import "../../Ranking/ranking.css";
import {useParams, useNavigate} from 'react-router-dom';

export default function ResearchersRanking({ wallet, setTab }) {
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
        <h1>Researchers</h1>          
      </div>
      <div style={{overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '70vh'}}>   
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Votes Received</th>
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
      </div>
    </>
  );
}
