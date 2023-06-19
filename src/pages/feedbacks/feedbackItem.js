import React, {useState, useEffect} from 'react';
import {get} from '../../config/infura';
import { api } from '../../services/api';

export function FeedbackItem({data}){
    const [imgBase64, setImgBase64] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        getBase64();
        setStatus(Number(data.status))
    },[])

    async function getBase64(){
        const response = await get(data.photoHash);
        setImgBase64(response);
    }

    async function updateStatus(value){
        try{
            await api.put('/feedback/status',{
                id: data.id,
                status: Number(value)
            })
        }catch(err){
            console.log(err);
        }
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
            <div className='flex items-center w-full justify-end gap-3'>
                {editStatus ? (
                    <select
                        className='w-40'
                        value={String(status)}
                        onChange={(e) => {
                            setStatus(Number(e.target.value))
                            updateStatus(e.target.value)
                            setEditStatus(false);
                        }}
                    >
                        <option value='0'>Em Análise</option>
                        <option value='1'>Futuramente</option>
                        <option value='2'>Em Desenvolvimento</option>
                        <option value='3'>Recusada</option>
                        <option value='4'>Concluida</option>
                    </select>
                ) : (
                    <p 
                        className='text-sm border-b-2 text-blue-500 border-blue-500 cursor-pointer'
                        onClick={() => setEditStatus(true)}
                    >Editar Status</p>
                )}
                {status === 0 && (
                    <div className='px-4 py-1 bg-yellow-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Em Análise</p>
                    </div>
                )}
                {status === 1 && (
                    <div className='px-4 py-1 bg-gray-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Futuramente</p>
                    </div>
                )}
                {status === 2 && (
                    <div className='px-4 py-1 bg-blue-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Em Desenvolvimento</p>
                    </div>
                )}
                {status === 3 && (
                    <div className='px-4 py-1 bg-red-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Recusada</p>
                    </div>
                )}
                {status === 4 && (
                    <div className='px-4 py-1 bg-green-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Concluida</p>
                    </div>
                )}
            </div>
        </div>
    )
}