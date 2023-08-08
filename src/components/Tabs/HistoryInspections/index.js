import React , { useEffect, useState } from "react";
import InspectionsService from "../../../services/inspectionsHistoryService";
import '../manageInspections.css'
import {useParams} from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {InspectionItem} from '../../InspectionItem';
import { BackButton } from "../../BackButton";
import Loader from "../../Loader";
import { useMainContext } from "../../../hooks/useMainContext";

function HistoryInspections({ walletAddress, user, setTab } ) {
    const {blockNumber} = useMainContext();
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
        setLoading(true);
        inspection.getAllInspections().then( res => {
            filterInspections(res);
        });
    }

    function filterInspections(data){
        let newArrayInspections = [];
        const inspections = data;
        for(var i = 0; i < inspections.length; i++){
            if(inspections[i].status === '1'){
                if(Number(inspections[i].acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION) < Number(blockNumber)){
                    newArrayInspections.push(inspections[i]);
                }
            }
            if(inspections[i].status === '2'){
                newArrayInspections.push(inspections[i]);
            }
        }
        setInspections(newArrayInspections.reverse());
        setLoading(false);
    }

    if(loading){
        return(
            <div className="flex items-center justify-center bg-green-950 w-full h-screen">
                <Loader
                    color='white'
                    type='hash'
                />
            </div>
        )
    }

    return (
        <div className='flex flex-col bg-green-950 px-2 h-[95vh] lg:px-10 pt-2 lg:pt-10 overflow-auto'>
                <div className='flex items-center justify-between mb-2 lg:mb-10'>
                    <div className='flex items-center gap-2'>
                        <BackButton/>
                        <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Inspections History')}</h1>
                    </div> 
                    <div className='flex items-center gap-5'>
                        
                    </div>
                </div>

                <div className="flex items-center h-10 lg:h-12 lg:w-full mb-3">
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

                                <div className='hidden lg:flex items-center h-full lg:w-[200px] px-2 font-bold'>
                                    <p className='text-white'>{t('Inspected At')}</p>
                                </div>
                            </div>

                            <div className='flex flex-col h-[66vh] overflow-auto pb-12 scrollbar-thin scrollbar-thumb-green-900 scrollbar-thumb-rounded-md'>
                                {inspections.map(item => (
                                    <InspectionItem
                                        key={item.id}
                                        data={item}
                                        type='history'
                                        statusExpired={(id) => {}}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
            </div>
    )
}

export default HistoryInspections;
