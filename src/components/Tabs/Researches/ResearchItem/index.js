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
        <div className="flex flex-col gap-3 bg-[#0A4303] border-2 border-[#3E9EF5] rounded-md p-3 mb-5">
            <div className="research-item__header">
                <div className='flex flex-col items-center'>
                    <label className="font-bold text-white">ID</label>
                    <p className="text-white">{data.id}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <label className="font-bold text-white">CreatedAt</label>
                    <p className="text-white">{date}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <label className="font-bold text-white">CreatedBy</label>
                    <a
                        onClick={() => navigate(`/dashboard/${walletAddress}/researcher-page/${data.createdBy}`)}
                        style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                    >
                        {data.createdBy}
                    </a>
                </div>
            </div>

            <h1 className='font-bold text-white text-2xl'>{data.title}</h1>

            <label className='font-bold text-white'>Thesis</label>
            <p className='text-white'>{data.thesis}</p>

            <label className='font-bold text-white'>PDF Report</label>
            <div className='flex items-center gap-5'>
                <button
                    className='px-3 py-2 bg-[#ff9900] font-bold rounded-md'
                >
                    <a
                        href={`https://ipfs.io/ipfs/${data.file}`}
                        target="_blank"
                        style={{textDecoration: 'none', color: '#000'}}
                    >View PDF</a>
                </button>
                <button onClick={handleDownloadPDF} className='px-3 py-2 bg-[#ff9900] font-bold rounded-md'>
                    Download PDF
                </button>
            </div>
        </div>
    )
}