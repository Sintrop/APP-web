import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../services/api';
import Loading from '../../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import { ActivityIndicator } from '../../components/ActivityIndicator/ActivityIndicator';
import { FaPlay } from 'react-icons/fa'
import { ContentItem } from './components/ContentItem';
import { useNavigate } from 'react-router';

export function Education() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [contents, setContents] = useState([]);
    const [contentsTrainning, setContentsTranning] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [emphasi, setEmphasi] = useState(null);
    const [modalCreateContent, setModalCreateContent] = useState(false);
    const [mostSeen, setMostSeen] = useState([]);
    const [ebooks, setEbooks] = useState([]);
    const [top10, setTop10] = useState([]);
    const [loadingPlay, setLoadingPlay] = useState(false);

    useEffect(() => {
        getContents();
    }, []);

    async function getContents() {
        const response = await api.get('/content');
        const { contents, trainings, mostSeen, ebooks, top10 } = response.data

        for (var i = 0; i < contents.length; i++) {
            if (contents[i].emphasis) {
                setEmphasi(contents[i]);
            }
        }

        setContentsTranning(trainings);
        setContents(contents);
        setMostSeen(mostSeen);
        setEbooks(ebooks);
        setTop10(top10);
        setLoaded(true);
    }

    async function play() {
        if (loadingPlay) {
            return;
        }
        if(emphasi.type === 'serie'){
            navigate(`/content/${emphasi?.id}`);
            return;
        }

        if (!emphasi?.fileServer) {
            return toast.error('Conteúdo indisponível!')
        }
        const controller = new AbortController();

        setLoadingPlay(true);
        axios.get(`http://edevappsserver.ddns.net:5000/teste`, { signal: controller.signal })
            .then(res => {
                navigate(`/content/player/${emphasi?.fileServer}`);
                setLoadingPlay(false);
                api.put('/content/play', {
                    contentId: emphasi?.id
                })
            })
            .catch(err => {
                toast.warn('Serviço de streaming indisponível no momento. Tente novamente mais tarde!')
                setLoadingPlay(false);
            })

        setTimeout(() => controller.abort(), 15000)
    }

    if (contents.length === 0) {
        return (
            <div className='w-full h-screen flex gap-1 flex-col bg-[#062c01] items-center justify-center'>
                <img
                    src={require('../../assets/sintrop-educ.png')}
                    className='w-32 h-28 object-contain'
                />

                <ActivityIndicator size={50} />

                <p className='font-bold text-white'>Carregando conteúdo</p>
            </div>
        )
    }

    return (
        <div className='w-full h-screen flex flex-col bg-[#062c01] overflow-y-scroll overflow-x-hidden'>
            <div className='flex flex-col relative'>
                <img
                    src={emphasi?.postUrl}
                    className='w-full h-[500px] object-cover'
                />
                <div className='w-full h-[500px] bg-gradient-to-r from-black to-black/40 flex absolute items-center px-5'>
                    <div className='flex flex-col gap-1 max-w-[50%]'>
                        <h1 className='font-bold text-white text-7xl'>{emphasi?.title}</h1>
                        <h2 className='font-bold text-white mt-2'>{emphasi?.description}</h2>

                        {emphasi.type !== 'ebook' && (
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

                        {emphasi?.type === 'ebook' && (
                            <a
                                className='font-bold w-32 h-10 flex items-center justify-center rounded-md bg-white mt-5 gap-2'
                                href={emphasi?.fileServer}
                                target="_blank"
                            >
                                Ler ebook
                            </a>
                        )}
                    </div>
                </div>

                <div className='flex flex-col gap-9 mt-5 pb-10'>
                    {mostSeen.length > 0 && (
                        <div>
                            <p className='font-bold text-white mx-5'>Mais vistos</p>

                            <div className='flex gap-3 pl-5'>
                                {mostSeen.map(item => (
                                    <ContentItem
                                        key={item?.id}
                                        data={item}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {top10.length > 0 && (
                        <div>
                            <p className='font-bold text-white mx-5'>Top 10 da semana</p>

                            <div className='flex gap-[130px] pl-5 overflow-x-auto overflow-y-hidden'>
                                {top10.map((item, index) => (
                                    <ContentItem
                                        key={item?.id}
                                        data={item}
                                        type='top-10'
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {contentsTrainning.length > 0 && (
                        <div>
                            <p className='font-bold text-white mx-5'>Treinamentos</p>

                            <div className='flex gap-3 pl-5 overflow-x-auto overflow-y-hidden'>
                                {contentsTrainning.map(item => (
                                    <ContentItem
                                        key={item?.id}
                                        data={item}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {ebooks.length > 0 && (
                        <div>
                            <p className='font-bold text-white mx-5'>Ebooks</p>

                            <div className='flex gap-3 pl-5 overflow-x-auto overflow-y-hidden'>
                                {ebooks.map(item => (
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
            {loading && (
                <Loading

                />
            )}

            <ToastContainer position='top-center' />
        </div>
    )
}