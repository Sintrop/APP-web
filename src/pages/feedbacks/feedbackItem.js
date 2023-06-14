import React, {useState, useEffect} from 'react';
import {get} from '../../config/infura';

export function FeedbackItem({data}){
    const [imgBase64, setImgBase64] = useState('');

    useEffect(() => {
        getBase64();
    },[])

    async function getBase64(){
        const response = await get(data.photoHash);
        setImgBase64(response);
    }

    return(
        <div key={data.id} className='flex flex-col w-[550px] border-2 border-gray-300 rounded-md p-3 mb-5'>
            <p className='font-bold text-[#ff9900] text-lg'>{data.title}</p>
            <p className='text-justify'>{data.description}</p>
            {imgBase64 && (
                <img
                    src={`data:image/png;base64,${imgBase64}`}
                    className='w-full object-cover'
                />
            )}
            <p className='text-sm mt-3'>{data.createdAt}</p>
            <p className='text-sm'>{data.id}</p>
        </div>
    )
}