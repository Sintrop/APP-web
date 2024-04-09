import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { format } from "date-fns";

export function UserCommentItem({ data }) {
    const userData = JSON.parse(data?.userData);
    const [imageProfile, setImageProfile] = useState(null);

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile(){
        const response = await getImage(userData?.imgProfileUrl);
        setImageProfile(response);
    }

    return (
        <div className="w-full flex gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-500">
                {imageProfile && (
                    <img
                        src={imageProfile}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-white text-sm">{userData?.name}</p>
                <p className="text-gray-300 text-sm">{data?.text}</p>
                <p className="text-gray-500 text-xs">{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
            </div>
        </div>
    )
}