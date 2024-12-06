import React from "react";

interface Props{
    label: string;
    onClick: () => void;
    description: string;
}
export function ActionButton({label, onClick, description}: Props){
    return(
        <div className="flex flex-col gap-1 border-b border-gray-400 pb-3">
            <p className="text-white text-sm">- {description}</p>
            <button
                onClick={onClick}
                className="w-52 h-10 rounded-md bg-blue-primary text-white font-semibold"
            >
                {label}
            </button>
        </div>
    )
}