import React, { useEffect, useState } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { NewPubli } from "../NewPubli";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { api } from "../../../../services/api";
import { toast } from "react-toastify";
import { PublicationItem } from "../PublicationItem";
import { useTranslation } from "react-i18next";
import { PublicationProps } from "../../../../types/publication";

export function SocialFeed() {
    const {t} = useTranslation();
    //@ts-ignore
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false);
    const [publications, setPublications] = useState<PublicationProps[]>([]);
    const [page, setPage] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        getPublications();
    }, [page]);

    async function getPublications() {
        if (firstLoad) {
            setLoading(true);
            setFirstLoad(false);
        } else {
            setLoadingMore(true);
        }

        const response = await api.get(`/publications/get-all/${page}`);
        const resPublis = response.data.publications;

        if (page === 0) {
            setPublications(resPublis);
        } else {
            for (var i = 0; i < resPublis.length; i++) {
                publications.push(resPublis[i]);
            }
        }

        setLoadingMore(false);
        setLoading(false);
    }

    if(loading){
        return (
            <div className="w-[93%] mx-2 lg:mx-0 lg:w-[550px] flex flex-col gap-3">

            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {userData?.accountStatus === 'blockchain' && (
                <NewPubli attPublis={() => {
                    setPage(0)
                    getPublications();
                    toast.success('Publicação feita com sucesso!')
                }} />
            )}
            {publications.length > 0 && (
                <>
                    {publications.map(item => (
                        <PublicationItem
                            data={item}
                            key={item.id}
                        />
                    ))}

                    {loadingMore ? (
                        <ActivityIndicator size={40} />
                    ) : (
                        <button onClick={() => setPage(page + 1)} className="underline text-white mb-3">
                            {t('verMais')}
                        </button>
                    )}
                </>
            )}
        </div>
    )
}