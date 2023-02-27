import React, { useEffect, useState } from "react";
import ProducerService from "../../../../services/producerService";
import '../../Ranking/ranking.css';
import {useParams, useNavigate} from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function ProducerRanking({ wallet, setTab }) {
  const {t} = useTranslation();
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
        <h1>{t('Producers')}</h1>          
      </div>  
      <table border="1">
        <tr>
          <th>#</th>
          <th>{t('Wallet')}</th>
          <th>{t('Name')}</th>
          <th>{t('Address')}</th>
          <th>{t('Inspections Received')}</th>
          <th>{t('ISA Score')}</th>
          <th>{t('ISA Average')}</th>
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
                {item.propertyAddress.street}, {item.propertyAddress.complement}, {item.propertyAddress.city}-{item.propertyAddress.state}
              </div>
            </td>
            <td>{item.totalInspections}</td>
            <td>{item.isa.isaScore}</td>
            <td>
              {item.totalInspections !== '0' ? (
                <>
                {Number(item.isa.isaScore) / Number(item?.totalInspections)}
                </>
              ) : (
                '0'
              )}
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}
