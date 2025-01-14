import React, { useEffect, useState } from "react";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { Jazzicon } from "@ukstv/jazzicon-react";
import { useTranslation } from "react-i18next";
import { FaHandHoldingUsd, FaUserCheck } from "react-icons/fa";
import { UserApiProps } from "../../../../types/user";
import { getImage } from "../../../../services/getImage";

interface Props {
    userType: number;
    blockchainData: BlockchainUserDataProps;
    wallet: string;
    userApi: UserApiProps;
}
export function HeaderUserDetails({blockchainData, userType, wallet, userApi }: Props) {
    const {t} = useTranslation();
    const [imageProfile, setImageProfile] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        setData();
    }, [userType, blockchainData]);

    useEffect(() => {
        if(userApi.imgProfileUrl)getImageProfile(userApi.imgProfileUrl);
    }, [userApi]);

    async function getImageProfile(hash: string) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    function setData(){
        if(userType === 1){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 2){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 3){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 4){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 5){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 6){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 7){
            if(userType === blockchainData.userType){
                setName(blockchainData.name);
            }
        }
        if(userType === 8){
            if(userType === blockchainData.userType){
                setName('Validador')
            }
        }
    }

    return (
        <div>
            {userType === 9 && (
                <div className="flex items-center justify-center w-full h-20 mb-5 bg-red-600 rounded-md">
                    <p className="font-bold text-white text-xl">{t('usuarioInvalidado')}</p>
                </div>
            )}
            <div className="w-full flex flex-col bg-[#03364B] p-3 rounded">
                <div className="bg-florest w-full h-[230px] bg-center bg-cover bg-no-repeat rounded-t-md">
                    {/* {userData?.bannerUrl && (
                        <img
                            src={userData?.bannerUrl}
                            className="w-full h-full object-cover rounded-t-md"
                        />
                    )} */}
                </div>
                <div className="flex flex-col bg-[#012939] p-3 rounded">
                    <div className="w-28 h-28 rounded-full bg-gray-400 border-4 border-white mt-[-90px]">
                        {imageProfile !== '' ? (
                            <img
                                src={imageProfile}
                                className="rounded-full object-cover w-full h-full"
                                alt="profile"
                            />
                        ) : (
                            <Jazzicon address={wallet}/>
                        )}
                    </div>

                    <p className="font-bold text-white mt-3 text-sm lg:text-base">{name}</p>
                    <p className="text-gray-300 text-sm">
                        {userType === 1 && t('textProdutor')}
                        {userType === 2 && t('textInspetor')}
                        {userType === 3 && t('textPesquisador')}
                        {userType === 4 && t('textDesenvolvedor')}
                        {userType === 5 && t('textContribuidor')}
                        {userType === 6 && t('textAtivista')}
                        {userType === 7 && t('textApoiador')}
                        {userType === 8 && t('textValidador')}
                    </p>

                    {/* {userData?.bio && (
                        <p className="text-sm text-white">{userData?.bio}</p>
                    )} */}

                    <div className="p-1 bg-[#03364B] border-2 border-green-500 rounded-md w-fit mt-1">
                        <p className="text-white text-xs lg:text-base">Wallet: {wallet}</p>
                    </div>

                    <div className="flex gap-3 mt-2 ">
                        {userType === 1 && (
                            <a
                                className="flex items-center gap-2 text-white font-semibold text-sm py-1 px-3 border rounded-md w-fit bg-[#03364B]"
                                href={`https://app.sintrop.com/producer/${String(wallet).toLowerCase()}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaUserCheck color='white' size={20} />
                                {t('paginaProdutor')}
                            </a>
                        )}

                        <a
                            className="flex items-center gap-2 text-white font-semibold text-sm py-1 px-3 border rounded-md w-fit bg-[#03364B]"
                            href={`https://app.sintrop.com/supporter/${String(wallet).toLowerCase()}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaHandHoldingUsd color='white' size={20} />
                            {t('paginaApoiador')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}