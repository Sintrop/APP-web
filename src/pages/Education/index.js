import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../services/api';
import Loading from '../../components/Loading';
import { ToastContainer, toast } from 'react-toastify';
import { get, save } from '../../config/infura';

export function Education() {
    const [wallet, setWallet] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (user) {
            getContents();
        }
        getConfig();
    }, [user]);

    async function getConfig() {
        const response = await api.get('/config_app');
        setConfig(response.data.config);
    }

    async function handleLogin() {
        if (!wallet.trim()) {
            return;
        }
        if (!wallet.trim()) {
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/login', { wallet, password });
            if (response.data) {
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                getUserData();
            }
        } catch (err) {
            if (err.response?.data?.message === 'User not found') {
                toast.error('Usuário não cadastrado');
            }
            if (err.response?.data?.message === 'Password incorrect') {
                toast.error('Senha incorreta');
            }
            setLoading(false)
        } finally {

        }
    }

    async function getUserData() {
        const response = await api.get('/me');
        setUser(response.data.user)
        setLoading(false);
    }

    async function getContents() {
        const response = await api.get(`/contents/user/${user.id}`);
        setContents(response.data.contents);
    }

    if (user) {
        return (
            <div className='flex flex-col items-center bg-[#062c01] h-screen'>

                <div className='w-full p-2 overflow-auto'>
                    <h1 className='font-bold text-white'>Olá, {user?.name}</h1>

                    <h2 className="mt-2 text-white">Seus conteúdos</h2>

                    {contents.map(item => (
                        <ContentItem item={item} user={user} config={config} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='w-full h-screen flex flex-col bg-[#062c01] items-center justify-center'>
            <div className='flex flex-col'>
                <img
                    src={require('../../assets/sintrop-educ.png')}
                    className='w-[100px] object-contain mb-4'
                />
                <label className='font-bold text-white'>Wallet:</label>
                <input
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder='Digite aqui'
                    className='w-[280px] h-10 bg-[#0a4303] rounded-lg mt-1 px-2 text-white'
                />

                <label className='font-bold text-white mt-3'>Senha:</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Digite aqui'
                    className='w-[280px] h-10 bg-[#0a4303] rounded-lg mt-1 px-2 text-white'
                    type='password'
                />

                <button
                    onClick={handleLogin}
                    className='w-full bg-[#2066cf] h-10 mt-5 rounded-md font-bold text-white'
                >
                    Entrar
                </button>
            </div>

            {loading && (
                <Loading

                />
            )}

            <ToastContainer position='top-center' />
        </div>
    )
}

function ContentItem({ item, user, config }) {
    const [moreDetails, setMoreDetails] = useState(false);
    const [video, setVideo] = useState(null);
    const [movieUploaded, setMovieUploaded] = useState(false);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ebookUploaded, setEbookUploaded] = useState(false);
    const [pdf, setPdf] = useState(null);

    useEffect(() => {
        if (item.fileServer) {
            if (item.type === 'movie') {
                setMovieUploaded(true);
            }
            if (item.type === 'ebook') {
                setEbookUploaded(true);
            }
        } else {
            if (item.type === 'movie') {
                setMovieUploaded(false);
            }
            if (item.type === 'ebook') {
                setEbookUploaded(false);
            }
        }

        if (item.type === 'serie') {
            getEpisodes();
        }
    }, []);

    function handleVideo(e) {
        console.log(e.target.files)
        setVideo(e.target.files[0]);
    }

    async function upload() {
        if (!video) {
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', video);

        const response = await axios.post(`${config?.urlStreamingServer}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        updateInfoContent(response.data.idServer)
    }

    async function updateInfoContent(nameServer) {
        await api.put('/content/file-server', {
            contentId: item.id,
            fileServerName: nameServer,
            totalMiliseconds: 0
        })

        if(item.type === 'movie'){
            if (!movieUploaded) {
                publiFeed();
            }
        }

        if(item.type === 'ebook'){
            if (!ebookUploaded) {
                publiFeed();
            }
        }

        setVideo(null);
        setLoading(false)
        setMovieUploaded(true);
        setEbookUploaded(true);
        setMoreDetails(false);
    }

    async function uploadPDF() {
        if(!pdf){
            return;
        }

        setLoading(true);
        const path = await save(pdf);
        updateInfoContent(path)
        setLoading(false);
    }

    async function getEpisodes() {
        const response = await api.get(`/content/episodes/${item.id}`);
        setEpisodes(response.data.episodes);
    }

    async function publiFeed() {
        const addData = {
            content: item,
            userData: user
        }

        await api.post('/publication/new', {
            userId: user?.id,
            type: 'new-content',
            origin: 'platform',
            additionalData: JSON.stringify(addData),
        })
    }

    return (
        <div className='flex flex-col bg-[#0a4303] mb-3 rounded-md'>
            <div key={item.id} className='flex items-cente rounded-md p-2 hover:cursor-pointer'>
                <img
                    src={item?.postUrl}
                    className='w-[90px] h-[120px] object-cover'
                />

                <div className='ml-2'>
                    <p className='font-bold text-white'>{item?.title} (
                        {item.type === 'movie' && 'Filme'}
                        {item.type === 'serie' && 'Serie'}
                        {item.type === 'ebook' && 'Ebook'}
                        )</p>
                    <p className='text-sm text-white'>{item?.description}</p>

                    {item.type === 'movie' && (
                        <>
                            <p className='text-[#2066cf] font-bold text-sm'>Arquivo de vídeo:</p>
                            <p className={`${movieUploaded ? 'text-green-700' : 'text-red-500'} text-xs`}>{movieUploaded ? 'Arquivo de vídeo anexado' : 'Nenhum arquivo de vídeo anexado'}</p>
                        </>
                    )}

                    {item.type === 'ebook' && (
                        <>
                            <p className='text-[#2066cf] font-bold text-sm'>Arquivo PDF:</p>
                            <p className={`${ebookUploaded ? 'text-green-700' : 'text-red-500'} text-xs`}>{ebookUploaded ? 'Arquivo PDF anexado' : 'Nenhum arquivo PDF anexado'}</p>
                        </>
                    )}

                    <button
                        onClick={() => setMoreDetails(true)}
                        className="px-2 py-1 text-xs rounded-md text-white font-bold bg-green-500"
                    >
                        Editar conteúdo
                    </button>
                </div>
            </div>

            {moreDetails && (
                <div className='flex flex-col px-2'>
                    {item.type === 'movie' && (
                        <>
                            <label className='font-bold text-white'>Selecione um arquivo de video:</label>
                            <input type='file' accept='video/mp4' onChange={handleVideo} />
                            <button
                                onClick={upload}
                                className="px-2 py-2 text-xs rounded-md text-white font-bold bg-green-500 mt-3"
                            >
                                Enviar vídeo
                            </button>
                        </>
                    )}

                    {item.type === 'serie' && (
                        <>
                            <p className='text-white'>Episódios</p>
                            {episodes.map((ep, index) => (
                                <EpItem
                                    ep={ep}
                                    user={user}
                                    content={item}
                                    index={index}
                                    config={config}
                                />
                            ))}
                        </>
                    )}

                    {item.type === 'ebook' && (
                        <>
                            <label className='font-bold text-white'>Selecione um arquivo PDF:</label>
                            <input
                                className='text-white w-full overflow-hidden'
                                type='file'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    const reader = new window.FileReader();
                                    reader.readAsArrayBuffer(file);
                                    reader.onload = () => {
                                        const arrayBuffer = reader.result
                                        const file = new Uint8Array(arrayBuffer);
                                        setPdf(file);
                                    };
                                }}
                                accept='application/pdf'
                            />
                            <button
                                onClick={uploadPDF}
                                className="px-2 py-2 text-xs rounded-md text-white font-bold bg-green-500 mt-3"
                            >
                                Enviar vídeo
                            </button>
                        </>
                    )}
                </div>
            )}

            {loading && (
                <Loading
                    text="Fazendo o upload do vídeo, não saia dessa tela"
                />
            )}
        </div>
    )
}

function EpItem({ ep, content, user, index, config }) {
    const [epUploaded, setEpUploaded] = useState(false);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ep.fileServer) {
            setEpUploaded(true);
        } else {
            setEpUploaded(false);
        }
    }, []);

    function handleVideo(e) {
        setVideo(e.target.files[0]);
    }

    async function upload() {
        if (!video) {
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', video);

        const response = await axios.post(`${config?.urlStreamingServer}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        updateInfoContent(response.data.idServer)
    }

    async function updateInfoContent(nameServer) {
        await api.put('/content/episode/file-server', {
            episodeId: ep.id,
            fileServerName: nameServer,
            totalMiliseconds: 0
        })

        if (index === 0 && !epUploaded) {
            publiFeed();
        }
        setVideo(null);
        setEpUploaded(true);
        setLoading(false);
    }

    async function publiFeed() {
        const addData = {
            content: content,
            userData: user
        }

        await api.post('/publication/new', {
            userId: user?.id,
            type: 'new-content',
            origin: 'platform',
            additionalData: JSON.stringify(addData),
        })
    }

    return (
        <div className="p-2 border-2 border-[#062c01] rounded-md mb-3">
            <p className='font-bold text-white'>{ep.numberEp} - {ep.title}</p>
            <p className='text-sm text-white'>{ep.description}</p>
            <p className={`${epUploaded ? 'text-green-700' : 'text-red-500'} text-sm font-bold`}>{epUploaded ? 'Arquivo de vídeo anexado' : 'Nenhum arquivo de vídeo anexado'}</p>

            <div className="flex flex-col mt-3">
                <label className='font-bold text-white text-sm'>Selecione um arquivo de video:</label>
                <input type='file' accept='video/mp4' onChange={handleVideo} />

                <button
                    onClick={upload}
                    className="px-2 py-2 text-xs rounded-md text-white font-bold bg-green-500 mt-3"
                >Enviar vídeo</button>
            </div>

            {loading && (
                <Loading
                    text="Fazendo o upload do vídeo, não saia dessa tela"
                />
            )}
        </div>
    )
}