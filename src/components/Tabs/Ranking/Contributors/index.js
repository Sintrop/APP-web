import React, { useEffect, useState } from "react";
import ContributorsService from "../../../../services/contributorService";
import '../../Ranking/ranking.css';
export default function ContributorsRanking({ wallet, setTab }) {
  const contributorsService = new ContributorsService(wallet);
  const [activist, setActivist] = useState([]);
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
        <h1>Contributors</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
         {/* <th>Developer Level</th> */}
        </tr>
        {activist.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a href="#" onClick={() => setTab('contributor-page', item.contributorWallet)}>
                <p className="p-wallet" title={item.contributorWallet}>
                  {item.contributorWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            <td>
              <div className="div-address">
                {item.contributorAddress.map((address) => (
                  <p key={`${item.cep}-${Math.random()}`}>{address},</p>
                ))}
              </div>
            </td>
            {/* <td>{item.level[0]}</td> */}
          </tr>
        ))}
      </table>
    </>
  );
}
