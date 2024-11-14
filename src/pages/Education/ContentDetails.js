import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActivityIndicator } from "../../components/ActivityIndicator/ActivityIndicator";
import { api } from "../../services/api";
import { EpisodeItem } from "./components/EpisodeItem";
import { ContentItem } from "./components/ContentItem";
import { FaPlay, FaShare } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";

export function ContentDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [contentData, setContentData] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [loadingEps, setLoadingEps] = useState(false);
    const [contents, setContents] = useState([]);
    const [loadingPlay, setLoadingPlay] = useState(false);

    useEffect(() => {
        getContentData();
    }, [id]);

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
        getContents();
        setLoading(false);
    }

    async function getContents() {
        const response = await api.get('/content');
        const { contents } = response.data

        setContents(contents);
    }

    async function play() {
        if (loadingPlay) {
            return;
        }
        if (!contentData?.fileServer) {
            return toast.error('Conteúdo indisponível!')
        }
        const controller = new AbortController();

        setLoadingPlay(true);
        axios.get(`http://edevappsserver.ddns.net:5000/teste`, { signal: controller.signal })
            .then(res => {
                navigate(`/content/player/${contentData?.fileServer}`);
                setLoadingPlay(false);
                api.put('/content/play', {
                    contentId: contentData?.id
                })
            })
            .catch(err => {
                toast.warn('Serviço de streaming indisponível no momento. Tente novamente mais tarde!')
                setLoadingPlay(false);
            })

        setTimeout(() => controller.abort(), 15000)
    }

    return (
        <div className='w-full h-screen flex flex-col bg-[#062c01] overflow-y-scroll overflow-x-hidden relative'>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <ActivityIndicator size={180} />
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className='w-full h-[400px] bg-gradient-to-r from-black to-black/40 flex absolute items-center justify-between px-5'>
                        <div className='flex flex-col gap-2 max-w-[50%]'>
                            <h1 className='font-bold text-white text-7xl'>{contentData?.title}</h1>
                            <h2 className='font-bold text-white'>{contentData?.description}</h2>

                            <div className="flex gap-4 mt-5">
                                {contentData?.type === 'movie' && (
                                    <button
                                        className='font-bold w-32 h-10 flex items-center justify-center rounded-md bg-white mt-5 gap-2'
                                        onClick={play}
                                    >
                                        {loadingPlay ? (
                                            <ActivityIndicator size={30} />
                                        ) : (
                                            <>
                                                <FaPlay color='black' size={20} />
                                                Assistir
                                            </>
                                        )}
                                    </button>
                                )}

                                {contentData?.type === 'ebook' && (
                                    <a
                                        className='font-bold w-32 h-10 flex items-center justify-center rounded-md bg-white mt-5 gap-2'
                                        href={contentData?.fileServer}
                                        target="_blank"
                                    >
                                        Ler ebook
                                    </a>
                                )}

                                <button
                                    className='font-bold text-white px-5 w-fit h-10 flex items-center justify-center rounded-md border border-white mt-5 gap-2'
                                    onClick={() => {
                                        navigator.clipboard.writeText(`https://app.sintrop.com/education/content/${contentData?.id}`);
                                        toast.success('Link copiado para área de transferência!')
                                    }}
                                >
                                    <FaShare color='white' size={20}/>
                                    Compartilhar conteúdo
                                </button>
                            </div>
                        </div>

                        <img
                            src={contentData?.postUrl}
                            className="w-[170px] h-[250px] object-cover rounded-md border-2 border-white mr-10"
                        />
                    </div>

                    <div className="flex flex-col mt-[415px]">
                        {contentData?.type === 'serie' ? (
                            <div className="flex flex-col gap-1 items-start pl-5">
                                <p className="font-bold text-white">Episódios</p>
                                {loadingEps && (
                                    <ActivityIndicator size={50} />
                                )}
                                <div className="flex gap-5">
                                    {episodes.map(item => (
                                        <EpisodeItem
                                            key={item.id}
                                            data={item}
                                            contentData={contentData}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>

                            </div>

                        )}

                        {contents.length > 0 && (
                            <div className="mt-5">
                                <p className='font-bold text-white mx-5'>Mais conteúdos</p>

                                <div className='flex gap-3 pl-5'>
                                    {contents.map(item => (
                                        <ContentItem
                                            key={item?.id}
                                            data={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}