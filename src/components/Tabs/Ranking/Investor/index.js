import React, { useEffect, useState } from "react";
import InvestorService from "../../../../services/investorService";
import '../../Ranking/ranking.css';
import {useParams} from 'react-router-dom';

export default function InvestorRanking({ wallet, setTab }) {
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
        <h1>Investor</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
        {investor.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <a href={`/dashboard/${walletAddress}/investor-page/${item.investorWallet}`}>{item.investorWallet}</a>
            </td>
            <td>{item.name}</td>
            <td>
              <div className="div-address">
                {item.investorAddress.map((address) => (
                  <p>{address},</p>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}
