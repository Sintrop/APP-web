import React from "react";
import { BiInfoCircle } from "react-icons/bi";

interface Props{
    text1: string;
    text2?: string;
    text3?: string;
    text4?: string;
    text5?: string;
    text6?: string;
}
export function Info({ text1, text2, text3, text4, text5, text6 }: Props) {
    return (
        <div className="p-2 rounded-md flex flex-col w-full bg-green-600 gap-1">
            <p className="text-white text-sm">{text1}</p>

            {text2 && (
                <p className="text-white text-sm">{text2}</p>
            )}

            {text3 && (
                <p className="text-white text-sm">{text3}</p>
            )}

            {text4 && (
                <p className="text-white text-sm">{text4}</p>
            )}

            {text5 && (
                <p className="text-white text-sm">{text5}</p>
            )}

            {text6 && (
                <p className="text-white text-sm">{text6}</p>
            )}

            <div className="flex justify-end">
                <BiInfoCircle color='white' size={20}/>
            </div>
        </div>
    );
}
