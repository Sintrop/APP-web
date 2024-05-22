import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { api } from "../../services/api";
import { EpisodeItem } from "./components/EpisodeItem";

export function ContentDetails({ }) {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [contentData, setContentData] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [loadingEps, setLoadingEps] = useState(false);

    useEffect(() => {
        getContentData();
    }, []);

    useEffect(() => {
        if (contentData?.title) {
            if (contentData?.type === 'serie') {
                getEpisodes();
            }
        }
    }, [contentData]);

    async function getEpisodes() {
        setLoadingEps(true);
        const response = await api.get(`/content/episodes/${contentData?.id}`)
        const eps = response.data.episodes;
        setEpisodes(eps.filter(item => item.fileServer !== null));
        setLoadingEps(false);
    }

    async function getContentData() {
        setLoading(true);
        const response = await api.get(`/content/${id}`);
        setContentData(response.data);
        setLoading(false);
    }

    return (
        <div className='w-full h-screen flex flex-col bg-[#062c01] overflow-y-scroll overflow-x-hidden'>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <ActivityIndicator size={180} />
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className='w-full h-[400px] bg-gradient-to-r from-black to-black/40 flex absolute items-center justify-between px-5'>
                        <div className='flex flex-col gap-1 max-w-[50%]'>
                            <h1 className='font-bold text-white text-7xl'>{contentData?.title}</h1>
                            <h2 className='font-bold text-white'>{contentData?.description}</h2>
                        </div>

                        <img
                            src={contentData?.postUrl}
                            className="w-[170px] h-[250px] object-cover rounded-md border-2 border-white mr-10"
                        />
                    </div>

                    <div className="flex flex-col mt-[415px] px-5">
                        {contentData?.type === 'serie' ? (
                            <div className="flex flex-col gap-1 items-start">
                                <p className="font-bold text-white">Episódios</p>
                                {loadingEps && (
                                    <ActivityIndicator size={50}/>
                                )}
                                <div className="flex gap-5">
                                    {episodes.map(item => (
                                        <EpisodeItem
                                            key={item.id}
                                            data={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                Filme
                            </div>

                        )}

                    </div>
                </div>
            )}
        </div>
    )
}