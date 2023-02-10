import React, {useEffect, useState} from 'react';
import './researchItem.css';
import {format} from 'date-fns';
import { saveAs } from 'file-saver';
import {useParams, useNavigate} from 'react-router-dom';

export function ResearchItem({data}){
    const navigate = useNavigate();
    const {walletAddress} = useParams();
    const [date, setDate] = useState('');
    useEffect(() => {
        formatDate();
    },[]);

    async function formatDate(){
        const timestamp = Number(data.createdAtTimeStamp) * 1000;
        const date = new Date(timestamp);
        const formatedDate = format(date, 'dd/MM/yyyy - kk:mm');
        setDate(formatedDate);
    }

    function handleDownloadPDF(){
        saveAs(`https://ipfs.io/ipfs/${data.file}`, `Research ${data.id} - ${data.title} - ${data.createdBy}`)
    }

    return(
        <div className="research-item__container">
            <div className="research-item__header">
                <div className='research-item__card-header'>
                    <label className="research-item__label">ID</label>
                    <p>{data.id}</p>
                </div>
                <div className='research-item__card-header'>
                    <label className="research-item__label">CreatedAt</label>
                    <p>{date}</p>
                </div>
                <div className='research-item__card-header'>
                    <label className="research-item__label">CreatedBy</label>
                    <a
                        onClick={() => navigate(`/dashboard/${walletAddress}/researcher-page/${data.createdBy}`)}
                        style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                    >
                        {data.createdBy}
                    </a>
                </div>
            </div>

            <h1 className='research-item__title'>{data.title}</h1>

            <label className='research-item__label'>Thesis</label>
            <p className='research-item__description'>{data.thesis}</p>

            <label className='research-item__label'>PDF Report</label>
            <div className='research-item__area-btn-pdf'>
                <button>
                    <a
                        href={`https://ipfs.io/ipfs/${data.file}`}
                        target="_blank"
                        style={{textDecoration: 'none', color: '#000'}}
                    >View PDF</a>
                </button>
                <button onClick={handleDownloadPDF} style={{cursor: 'pointer'}}>
                    Download PDF
                </button>
            </div>
        </div>
    )
}