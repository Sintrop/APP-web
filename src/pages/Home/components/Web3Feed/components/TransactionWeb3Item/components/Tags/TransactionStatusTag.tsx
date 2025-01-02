import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
    status: string;
}
export function TransactionStatusTag({ status }: Props) {
    const TagData = TagVariants[status as StatusType] || VariantDefault;

    return (
        <div 
            className={`rounded-md px-3 py-1 flex items-center gap-2`}
            style={{backgroundColor: TagData.bgColor}}
        >
            <TagData.Icon size={20} color='white'/>
            <p className="text-white text-sm">{TagData.label}</p>
        </div>
    )
}

const TagVariants = {
    error: {
        bgColor: '#ef4444',
        label: 'falhou',
        Icon: RiCloseCircleFill,
    },
    ok: {
        bgColor: '#1eb762',
        label: 'sucesso',
        Icon: FaCheckCircle,
    },
}

const VariantDefault = {
    bgColor: '#012939',
    label: ''
}

type StatusType = keyof typeof TagVariants;