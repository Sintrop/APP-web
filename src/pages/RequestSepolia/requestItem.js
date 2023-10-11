import React, {useState, useEffect} from 'react';
import { api } from '../../services/api';

export function RequestItem({data}){
    const [editStatus, setEditStatus] = useState(false);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        setStatus(Number(data.status))
    },[])

    async function updateStatus(value){
        try{
            await api.put('/request-faucet/status',{
                id: data.id,
                status: Number(value)
            })
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div key={data.id} className='flex flex-col w-[550px] border-2 border-gray-300 rounded-md p-3 mb-5'>
            <p className='font-bold text-[#ff9900] text-lg'>{data.wallet}</p>
    
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
                        <option value='0'>Pendente</option>
                        <option value='1'>Enviado</option>
                    </select>
                ) : (
                    <p 
                        className='text-sm border-b-2 text-blue-500 border-blue-500 cursor-pointer'
                        onClick={() => setEditStatus(true)}
                    >Editar Status</p>
                )}
                {status === 0 && (
                    <div className='px-4 py-1 bg-yellow-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Pendente</p>
                    </div>
                )}
                {status === 1 && (
                    <div className='px-4 py-1 bg-green-500 flex items-center justify-center rounded-md'>
                        <p className='font-bold text-white'>Enviado</p>
                    </div>
                )}
            </div>
        </div>
    )
}