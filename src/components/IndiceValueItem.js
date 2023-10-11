import React, {useEffect, useState} from 'react';

export function IndiceValueItem({data, type}){
    const [categoryDetails, setCategoryDetails] = useState({});

    useEffect(() => {
        setStates();
    },[]);

    function setStates() {
        if(data){
            setCategoryDetails(JSON.parse(data?.categoryDetails));
        }
        //setCategoryDetails(JSON.parse(data?.categoryDetails))
    }

    if(type === 'regeneration'){
        if(categoryDetails.category === '2'){
            return(
                <div className="flex items-center p-1 bg-green-950 w-full gap-2">
                    <div className="flex items-center justify-center py-2 rounded-md bg-[#0a4303] w-[60%]">
                        <p className="font-bold text-white">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center py-2 rounded-md bg-[#0a4303] w-[40%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                </div>
            )
        }
    }

    if(type === 'degeneration'){
        if(categoryDetails.category === '1'){
            return(
                <div className="flex items-center p-1 bg-[#783E19] w-full gap-2">
                    <div className="flex items-center justify-center py-2 rounded-md bg-[#A75722] w-[60%]">
                        <p className="font-bold text-white">{data?.title}</p>
                    </div>
                    <div className="flex items-center justify-center py-2 rounded-md bg-[#A75722] w-[40%]">
                        <p className="font-bold text-white">{data?.value}</p>
                    </div>
                </div>
            )
        }
    }

    return(
        <div/>
    )
}