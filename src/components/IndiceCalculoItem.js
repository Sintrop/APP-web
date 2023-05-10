import React, {useEffect, useState} from 'react';

export function IndiceCalculoItem({data, type, indice, biomassaValue}){
    const [categoryDetails, setCategoryDetails] = useState({});

    useEffect(() => {
        setStates();
    },[]);

    function setStates() {
        if(data){
            setCategoryDetails(JSON.parse(data?.categoryDetails));
            //console.log(JSON.parse(data?.categoryDetails))
        }
    }

    if(type === 'regeneration'){
        if(categoryDetails.category === '2' && indice === 'carbon' && categoryDetails?.carbonValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold text-white mx-2 border-b-4 border-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold text-white mx-2 border-b-4 border-blue-500">{categoryDetails?.carbonValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold text-white mx-2 border-b-4 border-green-400">{Number(categoryDetails?.carbonValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'agua' && categoryDetails?.aguaValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-green-950 w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.aguaValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.aguaValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'solo' && categoryDetails?.soloValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-green-950 w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.soloValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.soloValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '3' && indice === 'solo' && categoryDetails?.id === '13' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-green-950 w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">1</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'bio' && categoryDetails?.bioValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-green-950 w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.bioValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#0a4303] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.bioValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }
    }

    if(type === 'degeneration'){
        if(categoryDetails.category === '1' && indice === 'carbon' && categoryDetails?.carbonValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold text-white mx-2 border-b-4 border-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold text-white mx-2 border-b-4 border-blue-500">{categoryDetails?.carbonValue}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="font-bold text-white mx-1">=</p>
                        <p className="font-bold text-white mx-2 border-b-4 border-green-400">{Number(categoryDetails?.carbonValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'agua' && categoryDetails?.aguaValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-[#783E19] w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.aguaValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.aguaValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'solo' && categoryDetails?.soloValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-[#783E19] w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.soloValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.soloValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'bio' && categoryDetails?.bioValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex items-center h-20 p-1 bg-[#783E19] w-full gap-2">
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[40%]">
                        <p className="font-bold text-white text-center">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{categoryDetails?.bioValue}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                    <div className="flex items-center justify-center h-full rounded-md bg-[#A75722] w-[20%]">
                        <p className="font-bold text-white">{Number(categoryDetails?.bioValue) * Number(data?.value)}</p>
                    </div>
                </div>
            )
        }
    }

    return(
        <div/>
    )
}