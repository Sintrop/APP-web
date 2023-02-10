import React, { useEffect, useState } from "react";
import AdvisorsService from "../../../../services/advisorsService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';

export default function AdvisorsRanking({ wallet, setTab }) {
  const navigate = useNavigate();
  const advisorsService = new AdvisorsService(wallet);
  const [advisors, setAdvisors] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

  useEffect(() => {
    advisorsService
      .getAdvisorsRanking()
      .then((res) => {
        if(res.length > 0){
        //   let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.level[0]) - parseInt(a.level[0]))
        setAdvisors(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className='header-isa'>
        <h1>Advisors</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          {/* <th>Developer Level</th> */}
        </tr>
        {advisors.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/advisor-page/${item.advisorWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                <p className="p-wallet" title={item.advisorWallet}>
                  {item.advisorWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            {/* <td></td> */}
          </tr>
        ))}
      </table>
    </>
  );
}
