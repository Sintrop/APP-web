import React, {useEffect, useState} from 'react';
import {api} from '../../services/api';
import { IndiceItem } from './indiceItem';

export default function IndicesControl(){
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    },[]);

    async function getCategories(){
        try{
            const response = await api.get('subCategories');
            setCategories(response.data.subCategories);
            console.log(response.data.subCategories);
        }catch(err){
            console.log(err);
        }finally{

        }
    }

    return(
        <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-5">
                <img
                    src={require('../../assets/logo-cinza.png')}
                    className='w-[200px] object-contain'
                />
                <div className='w-[1px] h-16 bg-gray-500'/>
                <h1 className='font-bold text-3xl text-[#0a4303]'>Indices Control</h1>
            </div>

            <div className='flex flex-col w-[1000px]'>
                <div className='flex w-full border-2'>
                    <div className='w-12 border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>#ID</p>
                    </div>

                    <div className='w-[250px] border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>Title</p>
                    </div>

                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>Carbon Value</p>
                    </div>

                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>Water Value</p>
                    </div>

                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>Soil Value</p>
                    </div>

                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                        <p className=''>Bio Value</p>
                    </div>
                </div>
                {categories.map(item => (
                    <IndiceItem
                        key={item.id}
                        data={item}
                        attIndices={getCategories}
                    />
                ))}
            </div>
        </div>
    )
}