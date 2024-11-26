import React from "react";

interface Props{
    label: string;
    onClick: () => void;
}
export function ActionButton({label, onClick}: Props){
    return(
        <button
            onClick={onClick}
            className="w-52 h-10 rounded-md bg-blue-primary text-white font-semibold"
        >
            {label}
        </button>
    )
}