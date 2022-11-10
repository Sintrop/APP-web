import React, { useEffect } from 'react';
import './reports.css';
import {useParams} from 'react-router-dom';

import ReportItem from './reportItem';

export default function ReportsPage({user, wallet, setTab}){
    const {tabActive} = useParams();

    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])
    return(
        <div className='reports__container'>
            <h1>Reports</h1>
            <ReportItem/>
        </div>
    )
}