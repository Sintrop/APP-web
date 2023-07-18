import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import { TopBarStatus } from '../../components/TopBarStatus';
import { useNavigate } from 'react-router';
import { GetResearches, GetResearchers } from '../../services/researchersService';
import { ResearchItem } from './researcheItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalPublish } from '../../components/Tabs/Researches/ModalPublish';
import {RankingItem} from '../../components/RankingItem';
import {FaChevronLeft} from 'react-icons/fa';

export function ResearchersCenter(){
    const navigate = useNavigate();
    const {walletAddress, typeUser} = useParams();
    const [tabSelected, setTabSelected] = useState('pesquisas');
    const [researches, setResearches] = useState([]);
    const [researchers, setResearchers] = useState([]);
    const [modalPublish, setModalPublish] = useState(false);

    useEffect(() => {
        getResearches();
        getResearchers();
    },[]);

    async function getResearches() {
        const response = await GetResearches();
        setResearches(response)
    }

    async function getResearchers(){
        const response = await GetResearchers();
        setResearchers(response);
    }

    return(
        <div className="w-full h-full flex flex-col bg-centro-pesquisa bg-bottom">
            <TopBarStatus />

            <div className="flex mt-12">
                <div className="flex flex-col w-[350px] h-[93vh] bg-[#00BFE3]">
                    <img
                        src={require('../../assets/logo-cinza.png')}
                        className='w-[150px] object-contain mt-5 ml-5'
                    />

                    <button
                        onClick={() => navigate(`/dashboard/${walletAddress}/network-impact/${typeUser}/main`)}
                        className='flex items-center gap-2 my-3 px-4 text-[#1B7A74] font-bold'
                    >
                        <FaChevronLeft size={25} color='#1B7A74'/>
                        Voltar Para Plataforma
                    </button>

                    <div
                        className='flex items-center justify-center gap-3'
                    >
                        <img
                            className='w-[50px] h-[50px] object-contain'
                            src={require('../../assets/icon-pesquisas2.png')}
                        />
                        <p className='font-bold text-[#1B7A74]'>Centro de Pesquisas</p>
                    </div>

                    <button
                        onClick={() => setTabSelected('pesquisas')}
                        className={`flex items-center justify-center w-full font-bold text-white h-12 ${tabSelected === 'pesquisas' && 'bg-[#1B7A74]'}`}
                    >
                        Pesquisas
                    </button>
                    <button
                        onClick={() => setTabSelected('pesquisadores')}
                        className={`flex items-center justify-center w-full font-bold text-white h-12 ${tabSelected === 'pesquisadores' && 'bg-[#1B7A74]'}`}
                    >
                        Pesquisadores
                    </button>
                    <button
                        onClick={() => setTabSelected('metodos')}
                        className={`flex items-center justify-center w-full font-bold text-white h-12 ${tabSelected === 'metodos' && 'bg-[#1B7A74]'}`}
                    >
                        Métodos
                    </button>
                </div>  

                <div className="w-full flex flex-col">
                    {tabSelected === 'pesquisas' && (
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center justify-between h-16 bg-[#1B7A74] px-5">
                                <div className='flex items-center gap-2'>
                                    <img
                                        src={require('../../assets/icon-pesquisas3.png')}
                                        className='w-[60px] h-[60px] object-contain'
                                    />
                                    <h1 className='font-bold text-white text-lg'>Pesquisas</h1>
                                </div>
                                <button
                                    onClick={() => setModalPublish(true)}
                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                >Publicar Pesquisa</button>
                            </div>

                            <div className="w-full flex h-[80vh] flex-col overflow-auto px-5 mt-3">
                                {researches.length > 0 && (
                                    <>
                                    {researches.map(item => (
                                        <ResearchItem data={item}/>
                                    ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {tabSelected === 'pesquisadores' && (
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center justify-between h-16 bg-[#1B7A74] px-5">
                                <div className='flex items-center gap-2'>
                                    <img
                                        src={require('../../assets/icon-pesquisadores.png')}
                                        className='w-[50px] h-[50px] object-contain'
                                    />
                                    <h1 className='font-bold text-white text-lg'>Pesquisadores</h1>
                                </div>
                                <button
                                    onClick={() => setModalPublish(true)}
                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                >Publicar Pesquisa</button>
                            </div>

                            <div className="w-full flex h-[80vh] flex-col overflow-auto px-5 mt-3">
                                {researchers.length > 0 && (
                                    <>
                                    {researchers.map((item, index) => (
                                        <RankingItem
                                            data={item}
                                            position={index + 1}
                                        />
                                    ))}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {tabSelected === 'metodos' && (
                        <div className="w-full flex flex-col">
                            <div className="w-full flex items-center justify-between h-16 bg-[#1B7A74] px-5">
                                <div className='flex items-center gap-2'>
                                    <img
                                        src={require('../../assets/icon-pesquisadores.png')}
                                        className='w-[50px] h-[50px] object-contain'
                                    />
                                    <h1 className='font-bold text-white text-lg'>Métodos</h1>
                                </div>
                                <button
                                    onClick={() => {}}
                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                >Sugerir Métodos</button>
                            </div>

                            <div className="w-full flex h-[80vh] flex-col overflow-auto px-5 mt-3">
                                Em desenvolvimento
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog.Root
                open={modalPublish}
                onOpenChange={(open) =>  setModalPublish(open)}
            >
                <ModalPublish
                    walletAddress={walletAddress}
                    close={() => setModalPublish(false)}
                />
            </Dialog.Root>
        </div>
    )
}