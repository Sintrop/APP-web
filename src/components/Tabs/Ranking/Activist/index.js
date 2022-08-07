import React, { useEffect, useState } from "react";
import ActivistService from "../../../../services/activistService";
import "./activist.css";
export default function ActivistRanking({ wallet }) {
  const activistService = new ActivistService(wallet);
  const [activist, setActivist] = useState([]);
  useEffect(() => {
    activistService
      .getAtivistRanking()
      .then((res) => {
        let activistSort = res;
        setActivist(activistSort.sort((a, b) => b.totalInspections - a.totalInspections));
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
              <a href="#">{item.activistWallet}</a>
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
