import React, { useEffect, useState } from "react";
import { api } from "../../../../../services/api";
import { getImage } from "../../../../../services/getImage";
import { useNavigate } from "react-router";
import { FaFileAlt, FaShare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";

export function ResearcheItem({ data }) {
    const navigate = useNavigate();
    const [imageProfile, setImageProfile] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getUserData();
    }, []);

    async function getUserData() {
        const response = await api.get(`/user/${data?.createdBy}`);
        const user = response.data.user;

        setUserData(user);
        getImageProfile(user);
    }

    async function getImageProfile(user) {
        const response = await getImage(user?.imgProfileUrl);
        setImageProfile(response);
    }

    return (
        <div className="flex flex-col p-5 rounded-md bg-[#0a4303] w-full">
            <div className="flex gap-2 mb-3 px-5">
                <div className="h-20 w-20 rounded-full bg-gray-400">
                    {imageProfile && (
                        <img
                            src={imageProfile}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col">
                    <p
                        className="text-white font-bold hover:underline hover:cursor-pointer"
                        onClick={() => navigate(`/user-details/${String(userData?.wallet).toLowerCase()}`)}
                    >
                        {userData?.name}
                    </p>
                    <p className="text-white text-sm">{String(userData?.wallet).toLowerCase()}</p>
                    {data?.createdAtTimeStamp && (
                        <p className="text-white text-xs">{format(new Date(data?.createdAtTimeStamp * 1000), 'dd/MM/yyyy - kk:mm')}</p>
                    )}
                </div>
            </div>
            
            <p className="font-bold text-white mx-5">Pesquisa #{data?.id}</p>
            
            <div className="flex flex-col px-5 border-t border-white/50 mt-4 pt-4">
                <h1 className="font-bold text-white text-lg">{data?.title}</h1>
                <p className="text-white text-sm">{data?.thesis}</p>
            </div>

            <div className="flex items-center gap-5 border-b border-white/50 w-full mt-3 pb-5 pt-3 px-5">
                <a
                    href={`https://app.sintrop.com/view-pdf/${data?.file}`}
                    target="_blank"
                >
                    <button
                        className="flex flex-col items-center gap-1 font-bold text-white text-sm"
                    >
                        <FaFileAlt size={20} color='white'/>
                        Ver Relatório
                    </button>
                </a>

                <button
                    className="flex flex-col items-center gap-1"
                    onClick={() => {
                        navigator.clipboard.writeText(`https://app.sintrop.com/researche/${data?.id}`);
                        toast.success('Link copiado para área de transferência.')
                    }}
                >
                    <FaShare color='white' size={20} />
                    <p className="text-white font-bold text-sm">Compartilhar</p>
                </button>
            </div>
            
            <div className="flex flex-col px-5">
                <p className="text-white text-sm mt-5">Comentários</p>
            </div>
            
            <ToastContainer/>
        </div>
    )
}