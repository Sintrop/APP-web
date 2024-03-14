import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { getImage } from "../../../services/getImage";
import { useNavigate } from "react-router";

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
        <div className="flex flex-col p-2 rounded-md bg-[#0a4303] gap-2 w-full">
            <div className="flex gap-2">
                <div className="h-14 w-14 rounded-full bg-gray-400">
                    {imageProfile && (
                        <img
                            src={imageProfile}
                            className="h-14 w-14 rounded-full object-cover"
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
                </div>
            </div>

            <h3 className="font-bold text-white">#{data?.id} - {data?.title}</h3>
            <p className="text-white text-sm">{data?.thesis}</p>

            <a
                href={`https://${window.location.host}/view-pdf/${data?.file}`}
                target="_blank"
            >
                <button
                    className="px-2 py-1 rounded-md font-bold text-white bg-blue-500 mt-5 w-fit"
                >
                    Ver PDF
                </button>
            </a>
        </div>
    )
}