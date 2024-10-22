import React, { useEffect, useState } from "react";
import { getImage } from '../../../../services/getImage';
import { api } from "../../../../services/api";
import { useNavigate } from "react-router";

export function UserRankingItem({ data }) {
    const navigate = useNavigate();
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        getImageProfile();
    }, []);

    async function getImageProfile() {
        if (data.supporterWallet) {
            const resUser = await api.get(`/user/${data?.supporterWallet}`);
            const response = await getImage(resUser.data.user.imgProfileUrl);
            setImageProfile(response);
            return;
        }
        const response = await getImage(data?.proofPhoto);
        setImageProfile(response);
    }

    function clickUser() {
        if (data?.producerWallet) {
            navigate(`/user-details/${data?.producerWallet}`);
        }
        if (data?.inspectorWallet) {
            navigate(`/user-details/${data?.inspectorWallet}`);
        }
        if (data?.researcherWallet) {
            navigate(`/user-details/${data?.researcherWallet}`);
        }
        if (data?.developerWallet) {
            navigate(`/user-details/${data?.developerWallet}`);
        }
        if (data?.contributorWallet) {
            navigate(`/user-details/${data?.contributorWallet}`);
        }
        if (data?.activistWallet) {
            navigate(`/user-details/${data?.activistWallet}`);
        }
        if (data?.supporterWallet) {
            navigate(`/user-details/${data?.supporterWallet}`);
        }
        if (data?.validatorWallet) {
            navigate(`/user-details/${data?.validatorWallet}`);
        }
    }

    return (
        <div className="bg-[#03364B] p-2 rounded-md flex flex-col items-center h-auto w-[240px]">
            <div className="h-20 w-20 rounded-full border border-white bg-gray-400">
                {data?.validatorWallet ? (
                    <img
                        src={require('../../../../assets/icon-validator.png')}
                        className="h-20 w-20 rounded-full object-cover"
                    />
                ) : (
                    <>
                        {data?.supporterWallet ? (
                            <>
                                {imageProfile !== '' ? (
                                    <img
                                        src={imageProfile}
                                        className="h-20 w-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={require('../../../../assets/token.png')}
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
                {data?.validatorWallet ? 'Validador(a)' : data?.name}
            </p>

            <p className="text-xs text-gray-400 text-ellipsis overflow-hidden truncate w-[230px]">
                {data?.producerWallet && data?.producerWallet}
                {data?.inspectorWallet && data?.inspectorWallet}
                {data?.researcherWallet && data?.researcherWallet}
                {data?.developerWallet && data?.developerWallet}
                {data?.contributorWallet && data?.contributorWallet}
                {data?.activistWallet && data?.activistWallet}
                {data?.supporterWallet && data?.supporterWallet}
                {data?.validatorWallet && data?.validatorWallet}
            </p>

            <div className="flex flex-col mt-5 w-full gap-1">
                {data?.producerWallet && (
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

                {data?.inspectorWallet && (
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

                {data?.researcherWallet && (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <p className="font-bold text-white text-sm">Pesquisas publicadas</p>
                            <p className="font-bold text-green-600 text-sm">{data?.publishedWorks}</p>
                        </div>
                    </>
                )}

                {data?.developerWallet && (
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

                {data?.supporterWallet && (
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