import React, { useEffect, useState } from "react";
import ActivistService from "../../../../services/activistService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';

export default function ActivistRanking({ wallet, setTab }) {
    const navigate = useNavigate(); 
    const activistService = new ActivistService(wallet);
    const [activist, setActivist] = useState([]);
    const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        activistService
        .getAtivistRanking()
        .then((res) => {
            if(res.length > 0){
            let activistSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
            setActivist(activistSort);
            }
        })
        .catch((err) => console.log(err));
    }, []);
  return (
    <>
      <div className='header-isa'>
        <h1>Activists</h1>          
      </div>
      <div style={{overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '70vh'}}>   
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
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/activist-page/${item.activistWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
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
      </div>
    </>
  );
}
