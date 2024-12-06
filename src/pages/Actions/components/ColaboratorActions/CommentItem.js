import React, {useEffect, useState} from 'react';
import {api} from '../../../../services/api';
import {format} from 'date-fns';
import Loader from '../../../../components/Loader';
import { getImage } from '../../../../services/getImage';
import { ActivityIndicator } from '../../../../components/ActivityIndicator/ActivityIndicator';

export function CommentItem({data}){
    const [userData, setUserData] = useState(null);
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        getUser();
    },[]);

    async function getUser(){
        try{
            const response = await api.get(`/user/${data.walletAuthor}`);
            setUserData(response.data.user);
            getImageProfile(response.data.user.imgProfileUrl);
        }catch(err){

        }finally{

        }
    }

    async function getImageProfile(hash){
        const response = await getImage(hash);
        setImageProfile(response)
    }

    if(!userData){
        return(
            <ActivityIndicator size={40}/>
        )
    }

    return(
        <div className="flex gap-3">
            <img
                src={imageProfile}
                className='w-[40px] h-[40px] rounded-full border object-cover'
            />
            <div className='flex flex-col'>
                <h1 className='font-bold text-blue-500 text-sm'>{userData.name}</h1>
                <p className='text-white'>{data.comment}</p>
                <p className='text-gray-300 text-xs'>{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
            </div>
        </div>
    )
}