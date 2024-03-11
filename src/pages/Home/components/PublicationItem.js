import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { format } from "date-fns";

//icons
import { FaRegHeart } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import { AcceptInspectionPubli } from "./AcceptInspectionPubli";

export function PublicationItem({ data }) {
    const additionalData = JSON.parse(data.additionalData);
    const userData = additionalData.userData;
    const [imageProfile, setImageProfile] = useState(null);

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile() {
        const imageUrl = await getImage(userData?.imgProfileUrl);
        setImageProfile(imageUrl);
    }

    return (
        <div className="min-w-[500px] max-w-[720px] bg-[#0a4303] p-2 rounded-lg flex flex-col gap-3">
            <div className="flex justify-between w-full">
                <div className="flex">
                    <div className="w-14 h-14 rounded-full bg-gray-400">
                        {imageProfile && (
                            <img
                                src={imageProfile}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="flex flex-col ml-2">
                        <p className="text-white font-bold text-sm">{userData?.name}</p>
                        <p className="text-gray-300 text-xs">
                            {userData?.userType === 1 && 'Produtor(a)'}
                            {userData?.userType === 2 && 'Inspetor(a)'}
                            {userData?.userType === 3 && 'Pesquisador(a)'}
                            {userData?.userType === 4 && 'Desenvolvedor(a)'}
                            {userData?.userType === 5 && ''}
                            {userData?.userType === 6 && 'Ativista'}
                            {userData?.userType === 7 && 'Apoiador(a)'}
                            {userData?.userType === 8 && 'Validador(a)'}
                        </p>
                        <p className="text-gray-300 text-xs">{format(new Date(data.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
                    </div>
                </div>
            </div>

            <div>
                {data.type === 'accept-inspection' && (
                    <AcceptInspectionPubli data={data}/>
                )}
            </div>

            <div className="flex items-center border-t border-green-950 pt-2 gap-5">
                <button className="flex flex-col items-center">
                    <FaRegHeart color='white' size={20} />
                    <p className="text-white font-bold text-sm">Curtir</p>
                </button>

                <button className="flex flex-col items-center">
                    <BsChat color='white' size={20} />
                    <p className="text-white font-bold text-sm">Comentar</p>
                </button>
            </div>
        </div>
    );
}