import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';

export function PhotoCarrouselItem({data, click}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [image64, setImage64] = useState('');
    
    useEffect(() => {
        getImage()
    },[]);

    async function getImage(){
        try{
            setLoading(true);
            const response = await axios.get(`https://ipfs.io/ipfs/${data.photo}`);
            setImage64(response.data);
        }catch{
            console.log('Erro hash photo')
        }finally{
            setLoading(false);
        }
    }

    if(loading){
        return(
            <div className="w-[250px] h-[300px] rounded-md bg-gray-500 flex items-center justify-center">
                <Loader
                    color='white'
                    type='spinning'
                    size={70}
                />
            </div>
        )
    }

    if(data.ray){
        return(
            <div className="w-[250px] h-[300px] rounded-md bg-gray-500 flex flex-col items-center justify-center">
                <img
                    src={image64}
                    className='w-[250px] h-[300px] object-cover rounded-md cursor-pointer'
                    onClick={() => click(data.photo)}
                />

                <div className='flex flex-col w-full h-32 bg-black/80 mt-[-70px] items-center justify-center rounded-t-lg'>
                    <p className='text-white text-center text-sm'>Lat: {data.lat}, Lng: {data.lng}</p>
                    <p className='text-white text-center text-sm'>{t('Diameter')}: {data.ray} cm, {t('Height')}: {String(data.height).replace('.',',')} m</p>
                    <p className='text-white text-center text-sm'>Volume: {(3.1459 * (((Number(data.ray) / 100) / 2 *( Number(data.ray) / 100) / 2)) * Number(data.height)).toFixed(4)} m³</p>
                </div>
            </div>
        )
    }

    if(data.coord){
        return(
            <div className="w-[250px] h-[300px] rounded-md bg-gray-500 flex flex-col items-center justify-center">
                <img
                    src={image64}
                    className='w-[250px] h-[300px] object-cover rounded-md cursor-pointer'
                    onClick={() => click(data.photo)}
                />

                <div className='flex flex-col w-full h-32 bg-black/80 mt-[-70px] items-center justify-center rounded-t-lg'>
                    <p className='text-white text-center text-sm'>Lat: {data.coord.lat}, Lng: {data.coord.lng}</p>
                    <p className='text-white text-center text-sm'>{t("Biomass")}: {data.value} kg</p>
                    <p className='text-white text-center text-sm'>{t("Life units")}: {data.insetos} uv</p>
                </div>
            </div>
        )
    }

    if(data.lat){
        return(
            <div className="w-[250px] h-[300px] rounded-md bg-gray-500 flex flex-col items-center justify-center">
                <img
                    src={image64}
                    className='w-[250px] h-[300px] object-cover rounded-md cursor-pointer'
                    onClick={() => click(data.photo)}
                />

                <div className='flex flex-col w-full h-32 bg-black/80 mt-[-70px] items-center justify-center rounded-t-lg'>
                    <p className='text-white text-center text-sm'>Lat: {data.lat}, Lng: {data.lng}</p>
                </div>
            </div>
        )
    }

    return(            
        <img
            src={image64}
            className='w-[250px] h-[300px] object-cover rounded-md cursor-pointer'
            onClick={() => click(data.photo)}
        />
    )
}