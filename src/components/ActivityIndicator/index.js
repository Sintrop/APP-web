import React from "react";

export function ActivityIndicator({size}){
    return(
        <div className="flex items-center justify-center">
            <img
                src={require('../../assets/activity.png')}
                className={`w-[${size}px] h-[${size}px] object-contain animate-spin`}
            />

            <img
                src={require('../../assets/logos-green.png')}
                className={`${size > 150 ? 'w-[100px] h-[100px]' : 'w-[15px] h-[15px]'} object-contain absolute`}
            />
        </div>
    )
}