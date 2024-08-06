import React, {useEffect, useState} from "react";


export function UserAccountItem({data, selectAccount}){
    return(
        <button className="w-full px-3 py-1 rounded-md bg-green-500 flex items-center gap-2" onClick={() => selectAccount(data)}>
            <div className="w-10 h-10 rounded-full bg-gray-300">

            </div>

            <div className="flex flex-col items-start">
                <p className="font-bold text-white text-sm">{data?.name}</p>
                <p className="text-white text-xs">{String(data?.wallet).toLowerCase()}</p>
            </div>
        </button>
    )
}