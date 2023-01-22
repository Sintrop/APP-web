import React , { useEffect, useState } from "react";
import InspectionsService from "../../../services/inspectionsHistoryService";
import Loading from "../../Loading";
import '../manageInspections.css'
import ListItemHistory from "./component/ListItemHistory";
import {useParams} from 'react-router-dom';


function HistoryInspections({ walletAddress, user, setTab } ) {
    const {tabActive} = useParams();
    const [inspections, setInspections ] = useState([]);
    const [loading, setLoading] = useState(false);
    const inspection = new InspectionsService(walletAddress);

    useEffect(() => {
        loadInspections()
    }, [])

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    
  const loadInspections = () => {
    inspection.getAllInspections().then( res => {
      setInspections(res);
    });
  }

  return (
    <>
      <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Inspections History</h1>
                <div className='area-btn-header-isa-page'>
                    {/* {user == 1 && (
                        <button
                            className='btn-new-category-isa'
                            onClick={() => requestInspection()}
                        >
                            Request New Inspection
                        </button>
                    )} */}
                    <button
                        className='btn-load-categories-isa'
                        onClick={() => loadInspections()}
                    >
                        Load Inspections
                    </button>
                </div>
            </div>
           
                {inspections.length === 0 ? (
                    <h3>No open inspection</h3>
                ) : (
                    
                        <table>
                            <thead>
                                <th className='th-wallet'>Requested By</th>
                                <th className='th-wallet'>Inspected By</th>
                                <th>Created At</th>
                                <th>Expires In</th>
                                <th className='th-wallet'>Status</th>
                                <th>Accepted At</th>
                                <th className='th-wallet'>Isa Score</th>
                                <th className='th-wallet'>Actions</th>
                            </thead>
                            <tbody>
                                {inspections.map(item => {
                                    return(
                                        <ListItemHistory
                                            data={item}
                                            user={user}
                                            walletAddress={walletAddress}
                                            key={item.id}
                                            reloadInspections={() => loadInspections()}
                                            setTab={(tab, wallet) => setTab(tab, wallet)}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                   
                )}
          

            {loading && (
                <Loading/>
            )}
        </div>
    </>
  )
}

export default HistoryInspections;
