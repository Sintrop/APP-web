import React from "react";

export function InvalidateUserPubli({additionalData}){
    return(
        <div>
            <p className="text-white">Votou para invalidar o usuário <span className="font-bold text-green-600">{additionalData?.userToVote?.name}</span></p>

            <p className="mt-3 text-xs text-gray-400">Justificativa:</p>
            <p className="text-white">{additionalData?.justification}</p>
        </div>
    )
}