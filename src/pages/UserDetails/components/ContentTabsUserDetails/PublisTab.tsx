import React, { useEffect, useState } from "react";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { UserApiProps } from "../../../../types/user";
import { PublicationProps } from "../../../../types/publication";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { getPublicationsUserDetails } from "../../../../services/userDetails/publicationsUser";
import { PublicationItem } from "../../../Home/components/PublicationItem";

interface Props {
    userType: number;
    blockchainData: BlockchainUserDataProps;
    userApi: UserApiProps;
    wallet: string;
}
export function PublisTab({userApi}: Props){
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [publications, setPublications] = useState<PublicationProps[]>([]);

    useEffect(() => {
        handleGetPublis();
    }, []);

    async function handleGetPublis(){
        if(!userApi.id){
            return;
        }

        setLoading(true);
        const response = await getPublicationsUserDetails(userApi.id);
        setIsError(!response.success);

        if(response.success){
            setPublications(response.publications);
        }
        setLoading(false);
    }

    if(loading){
        return(
            <div className="w-full items-center flex flex-col mt-10">
                <ActivityIndicator size={80}/>
            </div>
        )
    }

    if(isError){
        return(
            <div className="w-full items-center flex flex-col mt-10">
                <p className="text-white">Erro ao buscar as informações</p>
            </div>
        )
    }

    if(publications.length === 0){
        return(
            <div className="w-full items-center flex flex-col mt-10">
                <p className="text-white">Nenhuma publicação encontrada</p>
            </div>
        )
    }

    return(
        <div className="flex flex-col gap-3 w-full items-center mt-5">
            {publications.map(publication => (
                <PublicationItem
                    key={publication.id}
                    data={publication}
                />
            ))}
        </div>
    )
}