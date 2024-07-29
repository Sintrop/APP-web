import React, {} from "react";

export function CategorieItem({data}){
    return(
        <div className="w-full flex flex-col p-2 rounded-md bg-[#0a4303] lg:w-[49%]">
            <p className="font-bold text-white">{data?.name}</p>
            <p className="text-white">{data?.description}</p>

            <p className="text-gray-200 text-sm mt-3">Regenerative 3 (25 pts):</p>
            <p className="text-white">{data?.regenerative3}</p>

            <p className="text-gray-200 text-sm mt-3">Regenerative 2 (10 pts):</p>
            <p className="text-white">{data?.regenerative2}</p>

            <p className="text-gray-200 text-sm mt-3">Regenerative 1 (1 pts):</p>
            <p className="text-white">{data?.regenerative1}</p>

            <p className="text-gray-200 text-sm mt-3">Neutro:</p>
            <p className="text-white">{data?.neutro}</p>

            <p className="text-gray-200 text-sm mt-3">Not Regenerative 1 (-1 pts):</p>
            <p className="text-white">{data?.notRegenerative1}</p>

            <p className="text-gray-200 text-sm mt-3">Not Regenerative 2 (-10 pts):</p>
            <p className="text-white">{data?.notRegenerative2}</p>

            <p className="text-gray-200 text-sm mt-3">Not Regenerative 3 (-25 pts):</p>
            <p className="text-white">{data?.notRegenerative3}</p>
        </div>
    )
}