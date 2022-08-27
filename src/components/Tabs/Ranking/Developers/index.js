import React, { useEffect, useState } from "react";
import DeveloperService from "../../../../services/developersService";
import '../../Ranking/ranking.css';
export default function DevelopersRanking({ wallet, setTab }) {
  const developerService = new DeveloperService(wallet);
  const [activist, setActivist] = useState([]);
  useEffect(() => {
    developerService
      .getDeveloperRanking()
      .then((res) => {
        if(res.length > 0){
          // let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
          setActivist(res);
        }
        console.log(res)
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className='header-isa'>
        <h1>Developers</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
          <th>Developer Level</th>
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a href="#" onClick={() => setTab('activist-page', item.activistWallet)}>
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
