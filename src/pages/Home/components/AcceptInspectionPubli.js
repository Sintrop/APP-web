import React, {useEffect, useState} from 'react';
import { api } from '../../../services/api';
import { getImage } from '../../../services/getImage';
import { useNavigate } from 'react-router';

export function AcceptInspectionPubli({data}){
    const navigate = useNavigate();
    const additionalData = JSON.parse(data?.additionalData);
    const [inspectionData, setInspectionData] = useState({});
    const [imageUserSecondary, setImageUserSecondary] = useState(null);
    const [loadingInspection, setLoadingInspection] = useState(false);

    useEffect(() => {
        getInspectionDetail(additionalData?.inspectionId)
    }, []);

    async function getInspectionDetail(id) {
        setLoadingInspection(true);
        const response = await api.get(`/web3/inspection/${id}`);

        setInspectionData(response.data);
        const img = await getImage(response.data.userData?.imgProfileUrl);
        setImageUserSecondary(img);
        setLoadingInspection(false);
    }

    return(
        <div className='p-3 flex flex-col rounded-md bg-green-950'>
            <div className='items-center bg-[#0a4303] rounded-md p-2'>
                <p className='font-bold text-white text-center'>Aceitou a inspeção #{additionalData?.inspectionId}</p>
            </div>

            <p className='mt-3 text-sm text-gray-400'>Dados do produtor(a)</p>

            <button 
                className='items-center bg-[#0a4303] rounded-md p-2 flex gap-3'
                onClick={() => navigate(`/user-details/${String(inspectionData?.userData?.wallet).toLowerCase()}`)}
            >
                <div className='h-10 w-10 rounded-full bg-gray-500'>
                    {imageUserSecondary && (
                        <img
                            src={imageUserSecondary}
                            className='h-10 w-10 rounded-full object-cover'
                        />
                    )}
                </div>

                <p className='font-bold text-white text-sm'>{inspectionData?.userData?.name}</p>
            </button>
        </div>
    )
}