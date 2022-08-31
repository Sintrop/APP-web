import React, { useEffect, useState } from "react";
import ResearchersService from "../../../../services/researchersService";
import "../../Ranking/ranking.css";
export default function ResearchersRanking({ wallet, setTab }) {
  const researchersService = new ResearchersService(wallet);
  const [researchers, setResearchers] = useState([]);
  useEffect(() => {
    researchersService
      .getResearcherRanking()
      .then((res) => {
        if (res.length > 0) {
          //   let investorSort = res.map(item => item ).sort((a, b) => parseInt(b.totalInspections) - parseInt(a.totalInspections))
          setResearchers(res);
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
    <div className='header-isa'>
        <h1>Researchers</h1>          
      </div>
      <table border="1">
        <tr>
          <th>#</th>
          <th>Wallet</th>
          <th>Name</th>
          <th>Address</th>
          <th>Votes Received</th>
        </tr>
        {researchers?.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>
              <a
                href="#"
                onClick={() => setTab("investor-page", item.researcherWallet)}
              >
                {item.researcherWallet}
              </a>
            </td>
            <td>{item.name}</td>
            <td>
              <div className="div-address">
                {item.researcherAddress.map((address) => (
                  <p>{address},</p>
                ))}
              </div>
            </td>
            {/* <td>{item.totalInspections}</td> */}
          </tr>
        ))}
      </table>
    </>
  );
}
