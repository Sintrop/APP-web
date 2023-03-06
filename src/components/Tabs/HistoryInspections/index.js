import React , { useEffect, useState } from "react";
import InspectionsService from "../../../services/inspectionsHistoryService";
import Loading from "../../Loading";
import '../manageInspections.css'
import {useParams} from 'react-router-dom';
import ItemListInspections from "../../ManageInspectionsComponents/ItemListInspections";
import { useTranslation } from "react-i18next";

function HistoryInspections({ walletAddress, user, setTab } ) {
    const {t} = useTranslation();
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
                <h1>{t('Inspections History')}</h1>
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
                        {t('Load Inspections')}
                    </button>
                </div>
            </div>     
                {inspections.length === 0 ? (
                    <h3>{t('No open inspection')}</h3>
                ) : (
                    
                        <table>
                            <thead>
                                <th className='th-wallet'>{t('Requested By')}</th>
                                <th>{t('Producer Address')}</th>
                                <th className='th-wallet'>{t('Inspected By')}</th>
                                <th>{t('Created At')}</th>
                                <th>{t('Expires In')}</th>
                                <th className='th-wallet'>Status</th>
                                <th className='th-wallet'>Isa {t('Score')}</th>
                                <th className='th-wallet'>{t('Actions')}</th>
                            </thead>
                            <tbody>
                                {inspections.map(item => {
                                    return(
                                        <ItemListInspections
                                            data={item}
                                            user={user}
                                            walletAddress={walletAddress}
                                            key={item.id}
                                            reloadInspections={() => {}}
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
