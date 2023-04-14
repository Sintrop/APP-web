import React from 'react';

export function IndiceValueItem(){
    return(
        <div className="flex items-center p-1 bg-[#783E19] w-full gap-2">
            <div className="flex items-center justify-center py-2 rounded-md bg-[#A75722] w-[60%]">
                <p className="font-bold text-white">Defensivo Químico</p>
            </div>
            <div className="flex items-center justify-center py-2 rounded-md bg-[#A75722] w-[40%]">
                <p className="font-bold text-white">25</p>
            </div>
        </div>
    )
}