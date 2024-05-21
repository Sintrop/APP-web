import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router";

export function ContentItem({data, type, index}){
    const navigate = useNavigate();

    function goToContent(){
        navigate(`/content/${data?.id}`);
    }

    if(type === 'top-10'){
        return(
            <button className="flex w-[500px] h-[220px] relative" onClick={goToContent}>
                <p className="font-bold text-gray-400 text-[280px] leading-[220px]">{index + 1}</p>
                <img
                    src={data?.postUrl}
                    className="w-[150px] ml-[-50px] h-full object-cover border-2 border-white rounded-md"
                />
            </button>
        )
    }
    return(
        <button className="flex w-[150px] h-[220px] border-2 border-white rounded-md overflow-hidden" onClick={goToContent}>
            <img
                src={data?.postUrl}
                className="w-full h-full object-cover"
            />
        </button>
    )
}