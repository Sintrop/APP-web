import React, { useEffect, useState } from "react";
import { Jazzicon } from '@ukstv/jazzicon-react';
import { format } from "date-fns";
import { BiCubeAlt } from "react-icons/bi";
import { getUser } from "../../../../../../../services/web3/userService";
import { GetProducer } from "../../../../../../../services/web3/producerService";
import { getImage } from "../../../../../../../services/getImage";
import { useTranslation } from "react-i18next";
import { GetInspector } from "../../../../../../../services/web3/inspectorService";
import { GetResearcher } from "../../../../../../../services/web3/researchersService";
import { GetDeveloper } from "../../../../../../../services/web3/developersService";
import { GetActivist } from "../../../../../../../services/web3/activistService";
import { GetSupporter } from "../../../../../../../services/web3/supporterService";
import { GetValidator } from "../../../../../../../services/web3/validatorService";

interface UserWeb3BasicInfoProps{
    id: string;
    name: string;
    proofPhoto?: string;
    userType: UserTypeToNameType;
}
interface Props {
    fromWallet: string;
    timestamp: string;
    blockNumber: number;
}
export function TransactionWeb3Header({ fromWallet, timestamp, blockNumber }: Props) {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({} as UserWeb3BasicInfoProps);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [imageProfile, setImageProfile] = useState('');

    useEffect(() => {
        verifyUser();
    }, []);

    async function verifyUser(){
        setLoading(true);

        const userType = await getUser(fromWallet);
        if(userType === 0){
            setIsUserRegistered(false);
            setLoading(false);
            return;
        }

        getUserData(userType);
    }

    async function getUserData(userType: number){
        setLoading(true);

        if(userType === 1){
            const response = await GetProducer(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
            getImageProfile(response?.proofPhoto)
        }

        if(userType === 2){
            const response = await GetInspector(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
            getImageProfile(response?.proofPhoto)
        }

        if(userType === 3){
            const response = await GetResearcher(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
            getImageProfile(response?.proofPhoto)
        }

        if(userType === 4){
            const response = await GetDeveloper(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
            getImageProfile(response?.proofPhoto)
        }

        if(userType === 6){
            const response = await GetActivist(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
            getImageProfile(response?.proofPhoto)
        }

        if(userType === 7){
            const response = await GetSupporter(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType,
                proofPhoto: response?.proofPhoto
            });
        }

        if(userType === 8){
            const response = await GetValidator(fromWallet);
            setUser({
                id: response?.id,
                name: response?.name,
                userType
            });
        }

        setLoading(false);
    }

    async function getImageProfile(hash: string){
        if(!hash)return;

        const response = await getImage(hash);
        setImageProfile(response);
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-container-secondary">
                    {imageProfile === '' ? (
                        <Jazzicon address={fromWallet} />
                    ) : (
                        <img
                            src={imageProfile}
                            className="w-full h-full rounded-full object-cover"
                            alt="IMagem de perfil do usuário"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    {user.name && (
                        <p className="text-white text-sm truncate">
                            {user.name}
                            <span className="text-xs text-gray-300 ml-2">{t(userTypeToName[user.userType])}</span> 
                        </p>
                    )}
                    <p className="text-white text-sm">{fromWallet}</p>

                    <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-300">{format(new Date(timestamp), 'dd/MM/yyyy - kk:mm')}</p>

                        <a 
                            className="text-xs text-white underline flex items-center gap-1"
                            href={`${process.env.REACT_APP_URL_EXPLORER}/block/${blockNumber}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <BiCubeAlt size={15} color='white'/>
                            {blockNumber}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const userTypeToName = {
    1: 'textProdutor',
    2: 'textInspetor',
    3: 'textPesquisador',
    4: 'textDesenvolvedor',
    5: 'textContribuidor',
    6: 'textAtivista',
    7: 'textApoiador',
    8: 'textValidador',
};
type UserTypeToNameType = keyof typeof userTypeToName;