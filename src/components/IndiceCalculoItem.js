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
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center text-sm lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500 text-sm"> {data?.value}</p>
                        <p className="font-bold text-white text-sm mx-1">x</p>
                        <p className="font-bold text-sm mx-2 text-blue-500">{categoryDetails?.carbonValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-sm text-white mx-1">=</p>
                    <p className="flex item-center font-bold text-sm mx-2 text-green-400">{Number(categoryDetails?.carbonValue) * Number(data?.value)} <p className="text-xs ml-1">Kg/Co²</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'agua' && categoryDetails?.aguaValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.aguaValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{Number(Number(categoryDetails?.aguaValue) * Number(data?.value)).toFixed(2)} <p className="text-xs ml-1">m³</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'solo' && categoryDetails?.soloValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.soloValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{Number(Number(categoryDetails?.soloValue) * Number(data?.value)).toFixed(2)} <p className="text-xs ml-1">m²</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '3' && indice === 'solo' && categoryDetails?.id === '13' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500">{data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">1</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{data?.value} <p className="text-xs ml-1">m²</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '3' && indice === 'bio' && categoryDetails?.id !== '13' && data?.value2 !== '0' && categoryDetails?.insumoCategory === 'biomassa'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">Insetos na {data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500">{data?.value2}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">1</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400">{data?.value2}</p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '2' && indice === 'bio' && categoryDetails?.bioValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.bioValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400">{Number(Number(categoryDetails?.bioValue) * Number(data?.value)).toFixed(2)}</p>
                    </div>
                </div>
            )
        }
    }

    if(type === 'degeneration'){
        if(categoryDetails.category === '1' && indice === 'carbon' && categoryDetails?.carbonValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.carbonValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{Number(Number(categoryDetails?.carbonValue) * Number(data?.value)).toFixed(2)} <p className="text-xs ml-1"> kg/Co²</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'agua' && categoryDetails?.aguaValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.aguaValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{Number(Number(categoryDetails?.aguaValue) * Number(data?.value)).toFixed(2)} <p className="text-xs ml-1">m³</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'solo' && categoryDetails?.soloValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.soloValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400 flex items-center">{Number(Number(categoryDetails?.soloValue) * Number(data?.value)).toFixed(2)} <p className="text-xs ml-1">m²</p></p>
                    </div>
                </div>
            )
        }

        if(categoryDetails.category === '1' && indice === 'bio' && categoryDetails?.bioValue !== '0' && data?.value !== '0'){
            return(
                <div className="flex flex-col lg:flex-row items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                    <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">{data?.title}: </p>
                    <div className="flex items-center">
                        <p className="font-bold mx-2 text-red-500"> {data?.value}</p>
                        <p className="font-bold text-white mx-1">x</p>
                        <p className="font-bold mx-2 text-blue-500">{categoryDetails?.bioValue}</p>
                    </div>
                    <div className="flex items-center">
                    <p className="font-bold text-white mx-1">=</p>
                    <p className="font-bold  mx-2 text-green-400">{Number(Number(categoryDetails?.bioValue) * Number(data?.value)).toFixed(2)}</p>
                    </div>
                </div>
            )
        }
    }

    return(
        <div/>
    )
}