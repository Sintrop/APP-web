import React, {useEffect, useState} from "react";
import { api } from "../../../../../../services/api";
import { format } from "date-fns";
import { getImage } from "../../../../../../services/getImage";

export function CommentResearche({data}){
    const [imageProfile, setImageProfile] = useState(null);
    const [userComment, setUserComment] = useState({});

    useEffect(() => {
        getUserComment();
    }, []);

    async function getUserComment(){
        const response = await api.get(`/user/${data?.walletAuthor}`);
        setUserComment(response.data.user);
        getImageProfile(response.data.user.imgProfileUrl);
    }

    async function getImageProfile(hash){
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return(
        <div className="flex flex-col mb-3">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    {imageProfile ? (
                        <img
                            src={imageProfile}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={require('../../../../../../assets/perfil_sem_foto.png')}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col">
                    <p className="font-bold text-white text-sm">{userComment?.name}</p>
                    <p className="text-xs text-gray-300">{format(new Date(data?.createdAt), 'dd/MM/yyyy - kk:mm')}</p>
                </div>
            </div>

            <div className="ml-10 flex">
                <p className="text-white">{data?.comment}</p>
            </div>
        </div>
    )
}