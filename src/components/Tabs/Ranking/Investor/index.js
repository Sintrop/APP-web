import React, { useEffect, useState } from "react";
import InvestorService from "../../../../services/investorService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';

export default function InvestorRanking({ wallet, setTab }) {
  const navigate = useNavigate();
  const investorService = new InvestorService(wallet);
  const [investor, setInvestor] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
  
  useEffect(() => {
    investorService
      .getInvestorRanking()
      .then((res) => {
        if(res.length > 0){
          let investorSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
          setInvestor(investorSort);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
    <div className='header-isa'>
        <h1>Investors</h1>          
      </div> 
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
        </tr>
        {investor.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/investor-page/${item.investorWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                {item.investorWallet}
              </a>
            </td>
            <td>{item.name}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
