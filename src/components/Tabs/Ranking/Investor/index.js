import React, { useEffect, useState } from "react";
import InvestorService from "../../../../services/investorService";
import '../../Ranking/ranking.css';
export default function InvestorRanking({ wallet, setTab }) {
  const investorService = new InvestorService(wallet);
  const [investor, setInvestor] = useState([]);
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
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
          <th>Inspections Realized</th>
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <a href="#" onClick={() => setTab('investor-page', item.investorWallet)}>{item.investorWallet}</a>
            </td>
            <td>{item.name}</td>
            <td>
              {item.investorAddress.map((address) => (
                <p>{address}</p>
              ))}
            </td>
            <td>{item.totalInspections}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
