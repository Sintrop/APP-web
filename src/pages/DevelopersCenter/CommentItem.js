import React, {useEffect, useState} from 'react';
import {api} from '../../services/api';
import {format} from 'date-fns';
import {get} from '../../config/infura';
import Loader from '../../components/Loader';

export function CommentItem({data}){
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUser();
    },[]);

    async function getUser(){
        try{
            const response = await api.get(`/user/${data.walletAuthor}`);
            setUserData(response.data.user)
        }catch(err){

        }finally{

        }
    }

    if(!userData){
        return(
            <Loader
                type='spinning'
                color='white'
            />
        )
    }

    return(
        <div className="flex gap-3">
            <img
                src={`https://ipfs.io/ipfs/${userData?.imgProfileUrl}`}
                className='w-[30px] h-[30px] rounded-full border-2 object-cover'
            />
            <div className='flex flex-col'>
                <h1 className='font-bold text-[#ff9900] text-sm'>{userData.name}</h1>
                <p className='text-gray-300'>{data.comment}</p>
                <p className='text-gray-300 text-xs'>{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
            </div>
        </div>
    )
}