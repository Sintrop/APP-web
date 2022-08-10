import React, { useEffect, useState } from "react";
import ProducerService from "../../../../services/producerService";
import './producer.css'
export default function ProducerRanking({ wallet }) {
  const producerService = new ProducerService(wallet);
  const [producers, setProducers] = useState([])
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
            <td><a href={`/producer-page/${item.producerWallet}`}>{item.producerWallet}</a></td>
            <td>{item.name}</td>
            <td>{item.propertyAddress.map(address => <p>{address}</p>)}</td>
            <td>{item.totalRequests}</td>
            <td>{item.isa.isaScore}</td>
            <td>{item.isa.isaAverage}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
