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
            const inspections = res.filter(item => item.status === '2')
            setInspections(inspections.reverse());
        });
    }

    return (
        <div className='flex flex-col bg-green-950 px-2 h-[95vh] lg:px-10 pt-3 lg:pt-10 overflow-auto'>
                <div className='flex items-center justify-between mb-5 lg:mb-10'> 
                    <h1 className='font-bold text-2xl text-white'>{t('Inspections History')}</h1>
                    <div className='flex items-center gap-5'>
                        
                    </div>
                </div>

                <div className="flex items-center h-12 lg:w-full mb-3">
                    <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                        <select
                            className="bg-white border-0 h-full w-full cursor-pointer"
                        >
                            <option value="">Todas as inspeções</option>
                            <option value="">Buscar pela wallet do ativista</option>
                            <option value="">Buscar pela wallet do produtor</option>
                        </select>
                    </div>
                    <div className="flex bg-white h-full w-[70%] px-3 rounded-r-md">
                        <input
                            className="bg-white border-0 h-full w-full"
                            placeholder="Digite aqui"
                        />
                        <button
                            className="font-bold py-2 rounded-md bg-white"
                        >
                            <img
                                src={require('../../../assets/icon-search.png')}
                                className="w-[30px] h-[30px] object-contain"
                            />
                        </button>
                    </div>
                </div>
                
                    {inspections.length === 0 ? (
                        <h3 className='font-bold text-white'>{t('There are no finished inspections')}</h3>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 py-1 w-full bg-[#80421A]">
                                <div className='flex items-center h-full lg:w-[50px] px-2 font-bold'>
                                    <p className='text-white'>ID</p>
                                </div>
                                <div className='flex items-center h-full lg:w-[350px] px-2 font-bold'>
                                    <p className='text-white'>{t('Requested By')}</p>
                                </div>
                                <div className='flex items-center h-full w-[350px] px-1 font-bold'>
                                    <p className='text-white'>{t('Inspected By')}</p>
                                </div>
                                <div className='hidden lg:flex items-center h-full w-[350px] px-1 font-bold'>
                                    <p className='text-white'>{t('Inspected At')}</p>
                                </div>
                                <div className='flex items-center h-full w-[350px] px-1 font-bold'>
                                    <p className='text-white'>Isa {t('Score')}</p>
                                </div>
                                <div className='flex items-center h-full w-[350px] px-1 font-bold'>
                                    <p className='text-white'>{t('Actions')}</p>
                                </div>
                            </div>

                            <div className='flex flex-col h-[66vh] overflow-auto'>
                                {inspections.map(item => (
                                    <InspectionItem
                                        key={item.id}
                                        data={item}
                                        type='history'
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
