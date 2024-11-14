import React, {useEffect, useState} from "react";
import {FaChevronLeft} from 'react-icons/fa';
import { api } from "../../../../services/api";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { UserLikeItem } from "./UserLikeItem";
import { useTranslation } from "react-i18next";

export function ModalLikes({close, publiId}){
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        getLikes();
    }, []);

    async function getLikes(){
        setLoading(true);
        const response = await api.get(`/publication/like/${publiId}`);
        setLikes(response.data);
        setLoading(false);
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close}/>
            <div className='absolute flex flex-col p-3 lg:w-[500px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-50'>
                <div className="flex items-center gap-2">
                    <button
                        onClick={close}
                    >
                        <FaChevronLeft size={17} color='white'/>
                    </button>
                    <p className="font-semibold text-white">
                        {t('curtidas')}
                    </p>
                </div>

                <div className="flex flex-col w-full overflow-y-auto mt-3 gap-4">
                    {loading ? (
                        <ActivityIndicator size={50}/>
                    ) : (
                        <>
                            {likes.length > 0 && (
                                <>
                                {likes.map(item => (
                                    <UserLikeItem
                                        key={item.id}
                                        data={item}
                                    />
                                ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}