import React, {} from "react";
import { IndicatorItem } from "./components/IndicatorItem";

export function CategoryItem({data}){
    return(
        <div className="w-full flex flex-col p-2 rounded-md bg-[#03364B] lg:w-[49%]">
            <p className="font-bold text-white">{data?.name}</p>
            <p className="text-white">{data?.description}</p>

            <div className="flex flex-col gap-2 mt-3">
                {data?.indicators?.map(item => (
                    <IndicatorItem
                        key={item.isaId}
                        indicator={item}
                    />
                ))}
            </div>
        </div>
    )
}