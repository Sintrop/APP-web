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
         let producerSort = res;
         if(res.length > 0) setProducers(producerSort.sort((a,b) => b.isa.isaScore - a.isa.isaScore ))
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
            <td><a href="#">{item.producerWallet}</a></td>
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
