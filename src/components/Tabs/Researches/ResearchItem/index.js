import React, {useEffect, useState} from 'react';
import './researchItem.css';
import {format} from 'date-fns';
import { saveAs } from 'file-saver';
import {useParams, useNavigate} from 'react-router-dom';
import { useMainContext } from '../../../../hooks/useMainContext';
import { GetResearcher } from '../../../../services/researchersService';

export function ResearchItem({data, myAccount}){
    const {setWalletSelected} = useMainContext();
    const navigate = useNavigate();
    const {walletAddress} = useParams();
    const [date, setDate] = useState('');
    const [researcherData, setResearcherData] = useState([]);

    useEffect(() => {
        formatDate();
        getResearcher();
    },[]);

    async function getResearcher() {
        const response = await GetResearcher(data.createdBy);
        setResearcherData(response);
    }

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
        <div className="flex flex-col gap-3 bg-[#0A4303] rounded-md p-3 mb-5 lg:w-[1000px]">
            {!myAccount && (
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start">
                    <div>
                        <img 
                            src={`https://ipfs.io/ipfs/${researcherData?.proofPhoto}`}
                            className='w-[150px] h-[150px] rounded-full border-4 object-cover'
                        />
                    </div>

                    <div className='lg:ml-10 flex flex-col items-center lg:items-start w-full'>
                        <p className='font-bold text-[#ff9900] text-center lg:text-xl max-w-[90%] lg:max-w-full text-ellipsis overflow-hidden'>{researcherData?.name}</p>
                        <a
                            onClick={() => {
                                navigate(`/dashboard/${walletAddress}/user-details/3/${data.createdBy}`)
                            }}
                            className='border-b-2 border-blue-400 text-blue-400 cursor-pointer' 
                        >
                            {data.createdBy}
                        </a>
                        <p className="text-white">{date}</p>

                    </div>
                </div>
            )}

            <h1 className='font-bold text-[#ff9900] text-justify text-lg lg:text-2xl'>#{data.id} - {data.title}</h1>

            <label className='font-bold text-[#ff9900]'>Thesis</label>
            <p className='text-white text-justify'>{data.thesis}</p>

            <label className='font-bold text-[#ff9900]'>PDF Report</label>
            <div className='flex items-center gap-5'>
                <button
                    className='px-3 py-2 bg-[#783E19] font-bold rounded-md text-white'
                >
                    <a
                        href={`https://ipfs.io/ipfs/${data.file}`}
                        target="_blank"
                        style={{textDecoration: 'none', color: '#fff'}}
                    >View PDF</a>
                </button>
                <button onClick={handleDownloadPDF} className='px-3 py-2 bg-[#783E19] font-bold rounded-md text-white'>
                    Download PDF
                </button>
            </div>
        </div>
    )
}