import React, { useEffect, useState } from "react";
import { getImage } from '../../../services/getImage';
import { api } from "../../../services/api";

export function UserRankingItem({ data }) {
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile() {
        if(data.userType === 7){
            const resUser = await api.get(`/user/${data?.supporterWallet}`);
            const response = await getImage(resUser.data.user.imgProfileUrl);
            setImageProfile(response);
            return;
        }
        const response = await getImage(data?.proofPhoto);
        setImageProfile(response);
    }

    return (
        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col items-center h-[250px] w-[240px]">
            <div className="h-20 w-20 rounded-full border border-white bg-gray-400">
                <img
                    src={imageProfile}
                    className="h-20 w-20 rounded-full object-cover"
                />

            </div>

            <p className="font-bold text-white text-center">{data?.name}</p>
            <p className="text-xs text-gray-400 text-ellipsis overflow-hidden truncate w-[230px]">
                {data?.userType === 1 && data?.producerWallet}
                {data?.userType === 2 && data?.inspectorWallet}
                {data?.userType === 3 && data?.researcherWallet}
                {data?.userType === 4 && data?.developerWallet}
                {data?.userType === 5 && data?.contributorWallet}
                {data?.userType === 6 && data?.activistWallet}
                {data?.userType === 7 && data?.supporterWallet}
                {data?.userType === 8 && data?.validatorWallet}
            </p>
        </div>
    )
}