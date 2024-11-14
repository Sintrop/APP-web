import React, {} from "react";

export function CategorieItem({data}){
    return(
        <div className="w-full flex flex-col p-2 rounded-md bg-[#03364B] lg:w-[49%]">
            <p className="font-bold text-white">{data?.name}</p>
            <p className="text-white">{data?.description}</p>

            <div className="flex flex-col gap-2 mt-3">
                {data?.indicators?.map(item => (
                    <div className="flex flex-col">
                        <p className="text-white text-sm">Indicator: {item?.isaId}</p>
                        <p className="font-semibold text-white">{item?.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}