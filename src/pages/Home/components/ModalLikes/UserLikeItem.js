import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { useTranslation } from "react-i18next";

export function UserLikeItem({ data }) {
    const { t } = useTranslation();
    const userData = JSON.parse(data?.userData);
    const [imageProfile, setImageProfile] = useState(null);

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile() {
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
                    {userData?.userType === 1 && t('textProdutor')}
                    {userData?.userType === 2 && t('textInspetor')}
                    {userData?.userType === 3 && t('textPesquisador')}
                    {userData?.userType === 4 && t('textDesenvolvedor')}
                    {userData?.userType === 5 && t('textContribuidor')}
                    {userData?.userType === 6 && t('textAtivista')}
                    {userData?.userType === 7 && t('textApoiador')}
                    {userData?.userType === 8 && t('textValidador')}
                </p>
            </div>
        </div>
    )
}