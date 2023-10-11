import React, {useEffect, useState} from 'react';
import { api } from '../../services/api';
import { RequestItem } from './requestItem';

export function RequestSepolia(){
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getRequests()
    },[])

    async function getRequests(){
        try{
            const response = await api.get('/request-faucet');
            setRequests(response.data.requests)
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div className='flex flex-col items-center p-3'>
            {requests.map(item => (
                <RequestItem
                    key={item.id}
                    data={item}
                />
            ))}
        </div>
    )
}