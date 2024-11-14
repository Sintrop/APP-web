import React, {useEffect, useState} from "react";
import format from "date-fns/format";
import { useMainContext } from "../../../../hooks/useMainContext";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";

export function UserInvite({data, inviteUser, loadingInvite}){
    const {userData} = useMainContext();

    return(
        <div className="p-2 rounded-md bg-[#03364B] flex flex-col">
            <p className="font-bold text-white">
                {data?.name} 
                <span className="text-gray-300 text-sm font-normal">
                    {data?.userType === 2 && ' (Inspetor(a))'}
                    {data?.userType === 6 && ' (Ativista)'}
                </span>
            </p>
            <p className="text-white">wallet: {String(data?.wallet).toLowerCase()}</p>

            <p className="text-gray-300 text-sm">
                Solicitado em: {format(new Date(data?.createdAt), 'dd/MM/yyyy - kk:mm')}
            </p>

            {userData?.userType === 6 && (
                <div className="flex w-full items-center justify-center mt-2">
                    <button
                        className="px-5 py-1 rounded-md font-semibold text-white bg-blue-500 h-10"
                        onClick={() => inviteUser({wallet: String(data?.wallet).toLowerCase(), userType: data?.userType})}
                    >
                        {loadingInvite ? (
                            <ActivityIndicator size={20}/>
                        ) : 'Convidar usuário'}
                    </button>
                </div>
            )}
        </div>
    )
}