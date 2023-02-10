import React, { useEffect, useState } from "react";
import ProducerService from "../../../../services/producerService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';

export default function ProducerRanking({ wallet, setTab }) {
  const navigate = useNavigate();
  const producerService = new ProducerService(wallet);
  const [producers, setProducers] = useState([]);
  const {tabActive, walletAddress} = useParams();
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

  useEffect(() => {
    producerService
      .getProducerRanking()
      .then((res) =>{
        if(res.length > 0){

          let producerSort = res.map((item) => item ).sort( (a,b) => parseInt(b.isa.isaScore) - parseInt(a.isa.isaScore))
          
          setProducers(producerSort)
        } 
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className='header-isa'>
        <h1>Producers</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
          <th>Inspections Received</th>
          <th>Isa score</th>
          <th>Isa average</th>
        </tr>
        {producers.map(item => (
          <tr key={item.producerWallet}>
            <td>{item.id}</td>
            <td id='createdByIsaTable'>
              <a
                onClick={() => navigate(`/dashboard/${walletAddress}/producer-page/${item.producerWallet}`)}
                style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}
              >
                <p className="p-wallet" title={item.producerWallet}>
                  {item.producerWallet}
                </p>
              </a>
            </td>
            <td>{item.name}</td>
            <td>
              <div className="div-address">
                {item.propertyAddress.map((address) => (
                  <p>{address},</p>
                ))}
              </div>
            </td>
            <td>{item.totalRequests}</td>
            <td>{item.isa.isaScore}</td>
            <td>{item.isa.isaAverage}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
