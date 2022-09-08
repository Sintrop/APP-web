import React, {useEffect, useState} from 'react';
import './isa.css';
import './manageInspections.css'

//components
import Loading from '../Loading';
import ItemListInspections from '../ManageInspectionsComponents/ItemListInspections';

//services
import {GetInspections, RequestInspection} from '../../services/manageInspectionsService';

export default function ManageInpections({user, walletAddress, setTab}){
    const [inspections, setInpections] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInspections();
    }, [])

    async function getInspections(){
        setLoading(true);
        const res = await GetInspections();
        setInpections(res);
        setLoading(false);
        console.log(res);
    }

    async function requestInspection(){
        setLoading(true);
        const res = await RequestInspection(walletAddress);
        setLoading(false);
        getInspections()
    }
    return(
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Inspections</h1>
                <div className='area-btn-header-isa-page'>
                    {user == 1 && (
                        <button
                            className='btn-new-category-isa'
                            onClick={() => requestInspection()}
                        >
                            Request New Inspection
                        </button>
                    )}
                    <button
                        className='btn-load-categories-isa'
                        onClick={() => getInspections()}
                    >
                        Load Inspections
                    </button>
                </div>
            </div>
            <div className='area-categories-isa'>
                {inspections.length === 0 ? (
                    <h3>No open inspection</h3>
                ) : (
                    <div className='container-table-categories'>
                        <table>
                            <thead>
                                <th className='th-wallet'>Requested By</th>
                                <th className='th-wallet'>Inspected By</th>
                                <th>Created At</th>
                                <th>Expires In</th>
                                <th className='th-wallet'>Status</th>
                                <th>Updated At</th>
                                <th className='th-wallet'>Isa Score</th>
                                <th className='th-wallet'>Actions</th>
                            </thead>
                            <tbody>
                                {inspections.map(item => {
                                    if(item.status != '2'){
                                        return(
                                            <ItemListInspections
                                                data={item}
                                                user={user}
                                                walletAddress={walletAddress}
                                                key={item.id}
                                                reloadInspections={() => getInspections()}
                                                setTab={(tab, wallet) => setTab(tab, wallet)}
                                            />
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {loading && (
                <Loading/>
            )}
        </div>
    )
}