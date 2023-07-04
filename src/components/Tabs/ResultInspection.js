import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { useMainContext } from '../../hooks/useMainContext';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
//import { generateRoute } from '../../config/uniswap/alphaRouter';
import {InspectionItemResult} from '../../pages/accountProducer/inspectionItemResult';
import {GetInspection} from '../../services/manageInspectionsService';
import { BackButton } from '../BackButton';



export function ResultInspection({setTab}){
    const {t} = useTranslation();
    const {typeUser, tabActive, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
    const [inspection, setInspection] = useState([]);

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getInspection();
    },[]);

    async function getInspection() {
        let inspections = []
        setLoading(true);
        const response = await GetInspection(walletSelected);
        inspections.push(response);
        setInspection(inspections);
        setLoading(false);
    }

    return(
        <div className='flex flex-col bg-green-950 px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto pb-20'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2 lg:mb-10'> 
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Result Inspection')}</h1>
                </div>
            </div>

            <div className='flex flex-col w-full h-[82vh] overflow-auto'>
                {inspection.length > 0 && (
                    <>
                    {inspection.map(item => (
                        <InspectionItemResult
                            data={item}
                            initialVisible={true}
                        />
                    ))}
                    </>
                )}
            </div>
            
            {loading && (
                <Loading/>
            )}
        </div>
    )
}