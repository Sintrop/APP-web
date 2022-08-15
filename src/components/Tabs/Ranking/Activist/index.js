import React, { useEffect, useState } from "react";
import ActivistService from "../../../../services/activistService";
import "./activist.css";
export default function ActivistRanking({ wallet, setTab }) {
  const activistService = new ActivistService(wallet);
  const [activist, setActivist] = useState([]);
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
              <a href="#" onClick={() => setTab('activist-page', item.activistWallet)}>{item.activistWallet}</a>
            </td>
            <td>{item.name}</td>
            <td>
              {item.activistAddress.map((address) => (
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
