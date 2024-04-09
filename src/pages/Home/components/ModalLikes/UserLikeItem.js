import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";

export function UserLikeItem({ data }) {
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
                <p className="font-semibold text-white">{userData?.name}</p>
                <p className="text-gray-300 text-xs">
                    {userData?.userType === 1 && 'Produtor(a)'}
                    {userData?.userType === 2 && 'Inspetor(a)'}
                    {userData?.userType === 3 && 'Pesquisador(a)'}
                    {userData?.userType === 4 && 'Desenvolvedor(a)'}
                    {userData?.userType === 5 && 'Ativista'}
                    {userData?.userType === 6 && 'Validador(a)'}
                    {userData?.userType === 7 && 'Apoiador(a)'}
                    {userData?.userType === 8 && 'Validador(a)'}
                </p>
            </div>
        </div>
    )
}