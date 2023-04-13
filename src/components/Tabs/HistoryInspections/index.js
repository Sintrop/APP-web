import React , { useEffect, useState } from "react";
import InspectionsService from "../../../services/inspectionsHistoryService";
import Loading from "../../Loading";
import '../manageInspections.css'
import {useParams} from 'react-router-dom';
import ItemListInspections from "../../ManageInspectionsComponents/ItemListInspections";
import { useTranslation } from "react-i18next";
import {InspectionItem} from '../../InspectionItem';

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
    <div className='flex flex-col bg-green-950 px-10 pt-10 overflow-auto'>
            <div className='flex items-center justify-between mb-10'> 
                <h1 className='font-bold text-2xl text-white'>{t('Inspections History')}</h1>
                <div className='flex items-center gap-5'>
                    
                </div>
            </div>
            
                {inspections.length === 0 ? (
                    <h3>{t('There are no open inspections')}</h3>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 py-1 w-full border-2 bg-green-950">
                            <div className='flex items-center h-full lg:w-[300px] px-2 font-bold'>
                                <p className='text-white'>{t('Requested By')}</p>
                            </div>
                            <div className='flex items-center h-full w-full px-1 font-bold'>
                                <p className='text-white'>{t('Producer Address')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Inspected By')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Created At')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Expires In')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>Status</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>Isa {t('Score')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Actions')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col h-[90vh] overflow-auto'>
                            {inspections.map(item => (
                                <InspectionItem
                                    key={item.id}
                                    data={item}
                                />
                            ))}
                        </div>
                    </div>

                    // <table>
                    //     <thead>
                    //         <th className='th-wallet'>{t('Requested By')}</th>
                    //         <th>{t('Producer Address')}</th>
                    //         <th className='th-wallet'>{t('Inspected By')}</th>
                    //         <th>{t('Created At')}</th>
                    //         <th>{t('Expires In')}</th>
                    //         <th className='th-wallet'>Status</th>
                    //         <th className='th-wallet'>Isa {t('Score')}</th>
                    //         <th className='th-wallet'>{t('Actions')}</th>
                    //     </thead>
                    //     <tbody>
                    //         {inspections.map(item => {
                    //             if(item.status != '2'){
                    //                 return(
                    //                     <ItemListInspections
                    //                         data={item}
                    //                         user={user}
                    //                         walletAddress={walletAddress}
                    //                         key={item.id}
                    //                         reloadInspections={() => getInspections()}
                    //                         setTab={(tab, wallet) => setTab(tab, wallet)}
                    //                     />
                    //                 )
                    //             }
                    //         })}
                    //     </tbody>
                    // </table>
                
                )}
        </div>
  )
}

export default HistoryInspections;
