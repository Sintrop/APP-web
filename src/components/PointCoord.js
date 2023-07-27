import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "./Loader";

export function PointCoord({data, zones, analiseSolo}){
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getImage();
    },[])

    async function getImage(){
        setLoading(true);
        const image64 = await axios.get(`https://ipfs.io/ipfs/${data.photo}`)
        setImage(image64.data);
        setLoading(false);
    }

    return(
        <div className="flex items-center gap-2">
            {loading ? (
                <div className="w-[40px] h-[40px] border-2 bg-gray-500 border-[#ff9900] rounded-md">
                    
                </div>
            ) : (
                <>
                    {image !== '' && (
                        <img
                            src={image}
                            className="w-[40px] h-[40px] object-cover border-2 border-[#ff9900] rounded-md"
                        />
                    )}
                </>
            )}

            {zones && (
                <>
                <p className="font-bold text-white text-sm">Lat:</p>
                <p className=" text-white text-sm">{data.lat}, </p>
                <p className="font-bold text-white text-sm">Lng:</p>
                <p className=" text-white text-sm">{data.lng}; </p>
                </>
            )}

            {analiseSolo && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p className="font-bold text-white text-sm">Lat:</p>
                        <p className=" text-white text-sm">{data.coord.lat}, </p>
                        <p className="font-bold text-white text-sm">Lng:</p>
                        <p className=" text-white text-sm">{data.coord.lng}; </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <p className="font-bold text-[#ff9900] text-sm">Cobertura de solo (Em kg):</p>
                        <p className=" text-white text-sm">{data.value} kg</p>
                    </div>
                </div>
            )}
        </div>
    )
}