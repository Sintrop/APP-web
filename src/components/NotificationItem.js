import React, {useEffect, useState} from 'react';
import { api } from '../services/api';
import Loader from './Loader';
import {FaTrash} from 'react-icons/fa';
import {TbMailOpened,TbTrash} from 'react-icons/tb';
import {format} from 'date-fns';
import {useMainContext} from '../hooks/useMainContext';
export function NotificationItem({data}){
    const dataNotification = JSON.parse(data.data);
    const {getNotifications} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [userFromData, setUserFromData] = useState(null);
    const [visualized, setVisualized] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        setVisualized(data.visualized);
        if(data.from){
            getUserData();
        }
    }, []);

    async function getUserData(){
        setLoading(true);
        try{
            const responseUser = await api.get(`/user/${data.from}`);
            setUserFromData(responseUser.data.user);
        }catch(err){

        }finally{
            setLoading(false);
        }
    }

    async function handleVisualized(){
        try{
            setVisualized(true);
            await api.put('/notifications/visualized', {
                id: data.id
            });
        }catch(err){

        }finally{

        }
    }

    async function handleDelete(){
        try{
            setDeleted(true);
            await api.delete(`/notifications/delete/${data.id}`);
            getNotifications();
        }catch(err){
            console.log(err)
        }finally{

        }
    }

    if(deleted){
        return <div/>
    }

    if(loading){
        return(
            <div className="flex w-full justify-center h-20">
                <Loader
                    type='spinning'
                    color='white'
                />
            </div>
        )
    }

    return(
        <button
            className={`flex items-center justify-between w-full min-h-20 border-b-2 border-green-950 hover:bg-green-950 duration-300 px-1 ${!visualized && 'bg-green-900'}`}
        >   
            <div className='flex w-full h-full py-2'>
                {data?.from && (
                    <img
                        src={`https://ipfs.io/ipfs/${userFromData?.imgProfileUrl}`}
                        className='h-[40px] w-[40px] rounded-full border-2 mr-2'
                    />
                )}

                <div className='flex flex-col h-full w-full items-start'>
                    {data?.from && (
                        <p className='font-bold text-[#ff9900] text-sm'>{userFromData?.name}</p>
                    )}
                    
                    <p className='text-white text-sm text-start font-bold'>{dataNotification.text1}</p>
                    <p className='text-white text-sm text-start'>{dataNotification.text2}</p>

                     
                </div>
            </div>

            <div className='flex flex-col items-end w-[70px]'>
                <div className='flex items-center gap-2'>
                    {!visualized && (
                        <button className='p-1 rounded-md border border-transparent hover:border-white' onClick={handleVisualized}>
                            <TbMailOpened size={15} color='white'/>
                        </button>
                    )}
                    <button className='p-1 rounded-md border border-transparent hover:border-white' onClick={handleDelete}>
                        <TbTrash size={15} color='white'/>
                    </button>
                </div>
                <p className='text-xs mt-1 text-gray-500'>{format(new Date(data.createdAt), 'kk:mm')}</p>
                <p className='text-xs text-gray-500'>{format(new Date(data.createdAt), 'dd/MM/yyyy')}</p>
            </div>
        </button>
    )
}