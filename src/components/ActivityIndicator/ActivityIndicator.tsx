import React from "react";

interface Props {
    size: number;
    hiddenIcon?: boolean;
}

export function ActivityIndicator({size, hiddenIcon}: Props){
    return(
        <div className="flex items-center justify-center relative">
            <img
                src={require('../../assets/activity.png')}
                className={`w-[${size}px] h-[${size}px] object-contain animate-spin`}
                alt="icon activity"
            />

            {!hiddenIcon && (
                <img
                    src={require('../../assets/logos-green.png')}
                    className={`${size > 150 ? 'w-[100px] h-[100px]' : 'w-[15px] h-[15px]'} object-contain absolute`}
                    alt='icon logo sintrop s'
                />
            )}
        </div>
    )
}