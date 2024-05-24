import React, { useEffect, useState } from "react";
import { getImage } from '../../../services/getImage';
import { api } from "../../../services/api";
import { useNavigate } from "react-router";

export function UserRankingItem({ data }) {
    const navigate = useNavigate();
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile() {
        if (data.userType === 7) {
            const resUser = await api.get(`/user/${data?.supporterWallet}`);
            const response = await getImage(resUser.data.user.imgProfileUrl);
            setImageProfile(response);
            return;
        }
        const response = await getImage(data?.proofPhoto);
        setImageProfile(response);
    }

    function clickUser() {
        if (data?.userType === 1) {
            navigate(`/user-details/${data?.producerWallet}`);
        }
        if (data?.userType === 2) {
            navigate(`/user-details/${data?.inspectorWallet}`);
        }
        if (data?.userType === 3) {
            navigate(`/user-details/${data?.researcherWallet}`);
        }
        if (data?.userType === 4) {
            navigate(`/user-details/${data?.developerWallet}`);
        }
        if (data?.userType === 5) {
            navigate(`/user-details/${data?.contributorWallet}`);
        }
        if (data?.userType === 6) {
            navigate(`/user-details/${data?.activistWallet}`);
        }
        if (data?.userType === 7) {
            navigate(`/user-details/${data?.supporterWallet}`);
        }
        if (data?.userType === 8) {
            navigate(`/user-details/${data?.validatorWallet}`);
        }
    }

    return (
        <div className="bg-[#0a4303] p-2 rounded-md flex flex-col items-center h-auto w-[240px]">
            <div className="h-20 w-20 rounded-full border border-white bg-gray-400">
                {data?.userType === 8 ? (
                    <img
                        src={require('../../../assets/icon-validator.png')}
                        className="h-20 w-20 rounded-full object-cover"
                    />
                ) : (
                    <>
                        {data?.userType === 7 ? (
                            <>
                                {imageProfile !== '' ? (
                                    <img
                                        src={imageProfile}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={require('../../../assets/token.png')}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                )}
                            </>
                        ) : (
                            <img
                                src={imageProfile}
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        )}
                    </>
                )}
            </div>

            <p
                className="font-bold text-white text-center hover:underline hover:cursor-pointer overflow-hidden text-ellipsis truncate w-[230px]"
                onClick={clickUser}
            >
                {data?.userType === 8 ? 'Validador(a)' : data?.name}
            </p>

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

            <div className="flex flex-col mt-5 w-full gap-1">
                {data?.userType === 1 && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Pontos de regeneração</p>
                            <p className="font-bold text-green-600 text-sm">{data?.isa?.isaScore}</p>
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Inspeções recebidas</p>
                            <p className="font-bold text-green-600 text-sm">{data?.totalInspections}</p>
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Era na pool</p>
                            <p className="font-bold text-green-600 text-sm">{data?.pool?.currentEra}</p>
                        </div>
                    </>
                )}

                {data?.userType === 2 && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Inspeções realizadas</p>
                            <p className="font-bold text-green-600 text-sm">{data?.totalInspections}</p>
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Desistências</p>
                            <p className="font-bold text-red-600 text-sm">{data?.giveUps}</p>
                        </div>
                    </>
                )}

                {data?.userType === 3 && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Pesquisas publicadas</p>
                            <p className="font-bold text-green-600 text-sm">{data?.publishedWorks}</p>
                        </div>
                    </>
                )}

                {data?.userType === 4 && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Nível</p>
                            <p className="font-bold text-green-600 text-sm">{data?.pool.level}</p>
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Era na pool</p>
                            <p className="font-bold text-green-600 text-sm">{data?.pool?.currentEra}</p>
                        </div>
                    </>
                )}

                {data?.userType === 7 && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Tokens compensados</p>
                            <p className="font-bold text-green-600 text-sm">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(data?.tokensBurned)}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}