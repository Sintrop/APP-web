import React, {useEffect, useState} from 'react';
import axios from 'axios';

export function InsumoItem({data, viewPhoto, typeInsumo}){
    const categoryDetails = JSON.parse(data.categoryDetails);
    const [base64, setBase64] = useState('');

    useEffect(() => {
        getImage()
    },[data]);
    
    async function getImage(){
        if(data.photo === '')return;
        const resPhoto = await axios.get(`https://ipfs.io/ipfs/${data.photo}`)
        setBase64(resPhoto.data)
    }

    if(categoryDetails.insumoCategory === 'biomassa' && typeInsumo === 'biomassa'){
        return(
            <div className='flex w-full items-center justify-between' key={data.categoryId}>
                <div className='flex items-center gap-1'>
                    {base64 !== '' ? (
                        <img
                            src={base64}
                            className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md cursor-pointer'
                            onClick={() => viewPhoto(data.photo)}
                        />
                    ) : (
                        <div className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md bg-gray-500'>
                            <p className='text-center text-xs'>No photo</p>
                        </div>
                    )}
                    <p className='font-bold text-white lg:w-[200px]'>{data.title}</p>
                </div>

                <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                    <p className='font-bold text-blue-400 text-center'>{data.value} {categoryDetails.unity}</p>
                </div>
            </div>
        )
    }

    if(categoryDetails.insumoCategory === 'insumo-quimico' && typeInsumo === 'insumo-quimico'){
        return(
            <div className='flex w-full items-center justify-between' key={data.categoryId}>
                <div className='flex items-center gap-1'>
                    {base64 !== '' ? (
                        <img
                            src={base64}
                            className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md cursor-pointer'
                            onClick={() => viewPhoto(data.photo)}
                        />
                    ) : (
                        <div className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md bg-gray-500'>
                            <p className='text-center text-xs'>No photo</p>
                        </div>
                    )}
                    <p className='font-bold text-white lg:w-[200px]'>{data.title}</p>
                </div>

                <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                    <p className='font-bold text-blue-400 text-center'>{data.value} {categoryDetails.unity}</p>
                </div>
            </div>
        )
    }

    if(categoryDetails.insumoCategory === 'insumo-biologico' && typeInsumo === 'insumo-biologico'){
        return(
            <div className='flex w-full items-center justify-between' key={data.categoryId}>
                <div className='flex items-center gap-1'>
                    {base64 !== '' ? (
                        <img
                            src={base64}
                            className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md cursor-pointer'
                            onClick={() => viewPhoto(data.photo)}
                        />
                    ) : (
                        <div className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md bg-gray-500'>
                            <p className='text-center text-xs'>No photo</p>
                        </div>
                    )}
                    <p className='font-bold text-white lg:w-[200px]'>{data.title}</p>
                </div>

                <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                    <p className='font-bold text-blue-400 text-center'>{data.value} {categoryDetails.unity}</p>
                </div>
            </div>
        )
    }

    if(categoryDetails.insumoCategory === 'insumo-mineral' && typeInsumo === 'insumo-mineral'){
        return(
            <div className='flex w-full items-center justify-between' key={data.categoryId}>
                <div className='flex items-center gap-1'>
                    {base64 !== '' ? (
                        <img
                            src={base64}
                            className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md cursor-pointer'
                            onClick={() => viewPhoto(data.photo)}
                        />
                    ) : (
                        <div className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md bg-gray-500'>
                            <p className='text-center text-xs'>No photo</p>
                        </div>
                    )}
                    <p className='font-bold text-white lg:w-[200px]'>{data.title}</p>
                </div>

                <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                    <p className='font-bold text-blue-400 text-center'>{data.value} {categoryDetails.unity}</p>
                </div>
            </div>
        )
    }

    if(categoryDetails.insumoCategory === 'recurso-externo' && typeInsumo === 'recurso-externo'){
        return(
            <div className='flex w-full items-center justify-between' key={data.categoryId}>
                <div className='flex items-center gap-1'>
                    {base64 !== '' ? (
                        <img
                            src={base64}
                            className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md cursor-pointer'
                            onClick={() => viewPhoto(data.photo)}
                        />
                    ) : (
                        <div className='w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md bg-gray-500'>
                            <p className='text-center text-xs'>No photo</p>
                        </div>
                    )}
                    <p className='font-bold text-white lg:w-[200px]'>{data.title}</p>
                </div>

                <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                    <p className='font-bold text-blue-400 text-center'>{data.value} {categoryDetails.unity}</p>
                </div>
            </div>
        )
    }
}