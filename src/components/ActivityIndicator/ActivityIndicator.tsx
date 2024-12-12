import React from "react";

interface Props {
    size: number;
    hiddenIcon?: boolean;
}

export function ActivityIndicator({size}: Props){
    return(
        <div className="flex items-center justify-center relative">
            <img
                src={require('../../assets/activity.png')}
                className={`w-[${size}px] h-[${size}px] object-contain animate-spin`}
                alt="icon activity"
            />
        </div>
    )
}