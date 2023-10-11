import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import { TopBarStatus } from '../../components/TopBarStatus';
import { useNavigate } from 'react-router';
import { GetResearches, GetResearchers } from '../../services/researchersService';
import {GetInspections} from '../../services/manageInspectionsService';
import { ResearchItem } from './researcheItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalPublish } from '../../components/Tabs/Researches/ModalPublish';
import {RankingItem} from '../../components/RankingItem';
import {FaChevronLeft} from 'react-icons/fa';
import { api } from '../../services/api';
import { IndiceItem } from '../indicesControl/indiceItem';
import Loader from '../../components/Loader';
import { InspectionItemResult } from '../accountProducer/inspectionItemResult';
import { useMainContext } from '../../hooks/useMainContext';
import { ModalWelcome } from './ModalWelcome';

import {GetResearchersInfura, GetResearchesInfura} from '../../services/methodsGetInfuraApi';

export function ResearchersCenter(){
    const {viewMode} = useMainContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const {walletAddress, typeUser} = useParams();
    const [tabSelected, setTabSelected] = useState('pesquisas');
    const [researches, setResearches] = useState([]);
    const [researchers, setResearchers] = useState([]);
    const [modalPublish, setModalPublish] = useState(false);
    const [methodSelected, setMethodSelected] = useState('sintrop');
    const [insumos, setInsumos] = useState([]);
    const [arvores, setArvores] = useState([]);
    const [analiseSolo, setAnaliseSolo] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [modalWelcome, setModalWelcome] = useState(false);

    useEffect(() => {
        if(tabSelected === 'pesquisas'){
            getResearches();
        }
        if(tabSelected === 'pesquisadores'){
            getResearchers();
        }
        if(tabSelected === 'metodos'){
            getInsumos();
        }
    },[tabSelected]);

    useEffect(() => {
        verifyWelcome();
    },[]);

    async function getInsumos(){
        setLoading(true);
        const response = await api.get('/subCategories');
        const data = response.data.subCategories;

        const insumos = data.filter(item => item.category !== '2');
        const arvores = data.filter(item => item.category === '2');
        const analiseSolo = data.filter(item => item.id === '14');
        setInsumos(insumos);
        setArvores(arvores);
        setAnaliseSolo(analiseSolo)
        getInspections();
    }

    async function getResearches() {
        setLoading(true);
        let array = [];
        if(viewMode){
            const response = await GetResearchesInfura();
            array = response;
        }else{
            const response = await GetResearches();
            array = response;
        }
        orderRanking(array);
        setLoading(false);
    }

    function orderRanking(data){
        if(data.length > 0){
            let researchesSort = data.map((item) => item ).sort( (a,b) => parseInt(b.createdAtTimeStamp) - parseInt(a.createdAtTimeStamp))
            setResearches(researchesSort)
            //filter(filter, producerSort)
        }
    }

    async function getResearchers(){
        setLoading(true);
        if(viewMode){
            const response = await GetResearchersInfura();
            setResearchers(response);
        }else{
            const response = await GetResearchers();
            setResearchers(response);
        }
        setLoading(false);
    }

    async function getInspections(){
        try{
            setLoading(true);
            const response = await api.get(`/inspections/method/sintrop`);
            //setInspections(response.data.inspections);
        }catch(err){

        }finally{
            setLoading(false);
        }
    }

    async function verifyWelcome(){
        const welcome = await localStorage.getItem('welcome-researcher-center');
        if(welcome){
            setModalWelcome(false);
        }else{
            setModalWelcome(true);
            localStorage.setItem('welcome-researcher-center', 'true');
        }
    }

    return(
        <div className="w-full h-full flex flex-col bg-[#f2f2f2]">
            <TopBarStatus />

            <div className="flex flex-col lg:flex-row lg:mt-12">
                <div className="flex flex-col w-full lg:w-[350px] lg:h-[93vh]">
                    <div className="bg-[#222831] h-full">
                    
                    <div className="flex w-full items-center justify-between mt-3 lg:mt-0">
                        <img
                            src={require('../../assets/logo-branco.png')}
                            className='w-[100px] lg:w-[150px] object-contain lg:mt-5 ml-5'
                        />
                        <div
                            className='flex lg:hidden items-center px-5 gap-3'
                        >
                            {/* <img
                                className='w-[40px] h-[40px] object-contain'
                                src={require('../../assets/icon-pesquisas2.png')}
                            /> */}
                            <p className='font-bold text-[#1B7A74]'>Centro de Pesquisas</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/dashboard/${walletAddress}/network-impact/${typeUser}/main`)}
                        className='items-center gap-2 my-3 px-4 text-white font-bold hidden lg:flex'
                    >
                        <FaChevronLeft size={25} color='white'/>
                        Voltar Para Plataforma
                    </button>

                    <div
                        className='hidden lg:flex items-center px-5 gap-3'
                    >
                        <img
                            className='w-[50px] h-[50px] object-contain'
                            src={require('../../assets/icon-pesquisas2.png')}
                        />
                        <p className='font-bold text-white'>Centro de Pesquisas</p>
                    </div>

                    <div className='flex items-center justify-center lg:flex-col'>
                        <button
                            onClick={() => setTabSelected('pesquisas')}
                            className={`flex items-center px-5 lg:w-full font-bold text-white h-12 ${tabSelected === 'pesquisas' && 'bg-[#1B7A74]'}`}
                        >
                            Pesquisas
                        </button>
                        <button
                            onClick={() => setTabSelected('pesquisadores')}
                            className={`flex items-center px-5 lg:w-full font-bold text-white h-12 ${tabSelected === 'pesquisadores' && 'bg-[#1B7A74]'}`}
                        >
                            Pesquisadores
                        </button>
                        <button
                            onClick={() => setTabSelected('metodos')}
                            className={`flex items-center px-5 lg:w-full font-bold text-white h-12 ${tabSelected === 'metodos' && 'bg-[#1B7A74]'}`}
                        >
                            Métodos
                        </button>
                    </div>

                    </div>
                </div>  

                {loading ? (
                    <div className="flex w-full h-screen items-center justify-center">
                        <Loader
                            type='hash'
                            color='#1B7A74'
                        />
                    </div>
                ) : (
                    <div className="w-full flex flex-col">
                        {tabSelected === 'pesquisas' && (
                            <div className="w-full flex flex-col">
                                <div className="w-full hidden items-center justify-between h-16 bg-[#687372] px-5 lg:flex">
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/icon-pesquisas3.png')}
                                            className='w-[60px] h-[60px] object-contain'
                                        />
                                        <h1 className='font-bold text-white text-lg'>Pesquisas</h1>
                                    </div>

                                    {typeUser === '3' && (
                                        <button
                                            onClick={() => setModalPublish(true)}
                                            className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                        >Publicar Pesquisa</button>
                                    )}
                                </div>

                                <div className="w-full flex h-[83vh] flex-col overflow-auto px-2 lg:px-5 mt-3">
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
                                <div className="hidden w-full lg:flex items-center justify-between h-16 bg-[#687372] px-5">
                                    <div className='flex items-center gap-2'>
                                        
                                        <h1 className='font-bold text-white text-lg'>Pesquisadores</h1>
                                    </div>
                                </div>

                                <div className="w-full flex h-[80vh] flex-wrap overflow-auto px-5 mt-3 justify-center">
                                    {researchers.length > 0 && (
                                        <>
                                        {researchers.map((item, index) => (
                                            <RankingItem
                                                data={item}
                                                position={index + 1}
                                                researchersCenter
                                            />
                                        ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {tabSelected === 'metodos' && (
                            <div className="w-full flex flex-col">
                                <div className="w-full hidden lg:flex items-center justify-between h-16 bg-[#687372] px-5">
                                    <div className='flex items-center gap-2'>
                                        <img
                                            src={require('../../assets/icon-pesquisadores.png')}
                                            className='w-[50px] h-[50px] object-contain'
                                        />
                                        <h1 className='font-bold text-white text-lg'>Métodos</h1>
                                    </div>
                                    <button
                                        onClick={() => setModalPublish(true)}
                                        className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                    >Sugerir Método</button>
                                </div>

                                <div className="w-full flex h-[80vh] flex-col overflow-auto px-5 mt-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            className={`flex items-center justify-center gap-2 rounded-md border-2 font-bold border-[#1b7a74] p-2 ${methodSelected === 'sintrop' ? 'bg-[#1b7a74] text-white' : 'text-[#1b7a74]'}`}
                                            onClick={() => setMethodSelected('sintrop')}
                                        >
                                            <img
                                                src={require('../../assets/token.png')}
                                                className="w-[50px] h-[50px] object-contain border-2 border-white rounded-full"
                                            />
                                            Método Sintrop
                                        </button>
                                        <button
                                            className={`flex items-center justify-center gap-2 rounded-md border-2 font-bold border-[#1b7a74] p-2 ${methodSelected === 'manual' ? 'bg-[#1b7a74] text-white' : 'text-[#1b7a74]'}`}
                                            onClick={() => setMethodSelected('manual')}
                                        >
                                            <img
                                                src={require('../../assets/metodo-manual.png')}
                                                className="w-[50px] h-[50px] object-contain border-2 border-white rounded-full"
                                            />
                                            Método Manual
                                        </button>
                                    </div>

                                    {methodSelected === 'sintrop' && (
                                        <div className='mt-5 lg:w-[900px] gap-4 flex flex-col'>
                                            <div className="flex flex-col bg-[#D2FBD6] rounded">
                                                <div className="flex items-center p-2 border-b-2 border-[#00BFE3]">
                                                    <p className="font-bold text-green-950">Descrição do método</p>
                                                </div>
                                                <div className='p-2'>
                                                    <p>Primeiro método de avaliação criado no Sistema. Esse método é composto por 4 fases: Análise de insumos, contagem e estimativa de árvores, análise de solo e registro da biodiversidade.</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col bg-[#D2FBD6] rounded">
                                                <div className="flex items-center p-2 border-b-2 border-[#00BFE3]">
                                                    <p className="font-bold text-green-950">1. Registro de insumos</p>
                                                </div>
                                                <div className='p-2'>
                                                    <p>Nessa etapa iremos registrar todos insumos provenientes de fora da propriedade. Tudo que vem de fora, de alguma forma possui algum impacto no Planeta e deverá ser contabilizado negativamente. A utilização de insumos químicos deverá inviabilizar o produtor de ter uma nota positiva, não tem como ser regenerativo usando veneno que destrói e mata a biodiversidade. Cada insumo, terá um índice de penalização, o qual deverá ser avaliado e otimizado para melhor coerência. Você poderá propor mudança no índice e também sugerir novos insumos.</p>
                                                </div>
                                            </div>

                                            <p className='font-bold text-[#1b7a74]'>Tabela de insumos</p>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => setModalPublish(true)}
                                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                                >Sugerir Mudanças</button>

                                                <button
                                                    onClick={() => setModalPublish(true)}
                                                    className='px-3 py-2 text-white font-bold rounded-md bg-green-700'
                                                >Propor Novo Insumo</button>
                                            </div>

                                            <div className='flex flex-col w-[900px]'>
                                                <div className='flex w-full border-2 bg-white'>
                                                    <div className='w-12 border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>#ID</p>
                                                    </div>

                                                    <div className='w-[250px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Title</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Carbon Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Water Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Soil Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Bio Value</p>
                                                    </div>
                                                </div>
                                                {insumos.map(item => (
                                                    <IndiceItem
                                                        key={item.id}
                                                        data={item}
                                                        researchersCenter
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex flex-col bg-[#D2FBD6] rounded">
                                                <div className="flex items-center p-2 border-b-2 border-[#00BFE3]">
                                                    <p className="font-bold text-green-950">2. Contagem e estimativa de árvores</p>
                                                </div>
                                                <div className='p-2'>
                                                    <p>Nessa etapa iremos contar e estimar a quantidade de árvores da propriedade. O objetivo é deixar cada vez mais precisa essa avaliação. Iremos estimar quanto de CO2 e de água cada árvore, de acordo com seu tipo e seu diâmetro. O app terá um contador de árvores avulsas, e um sistema de zonas de regeneração, o qual deverá ser registrado as coordenadas dos pontos da zona. Em seguida deverá ser registrado os pontos de uma subzona, uma área menor dentro dela para contagem das árvores, para então ser feita uma extrapolação do resultado final.</p>
                                                </div>
                                            </div>

                                            <p className='font-bold text-[#1b7a74]'>Tabela de árvores</p>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => setModalPublish(true)}
                                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                                >Sugerir Mudanças</button>
                                            </div>

                                            <div className='flex flex-col w-[900px]'>
                                                <div className='flex w-full border-2 bg-white'>
                                                    <div className='w-12 border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>#ID</p>
                                                    </div>

                                                    <div className='w-[250px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Title</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Carbon Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Water Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Soil Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Bio Value</p>
                                                    </div>
                                                </div>
                                                {arvores.map(item => (
                                                    <IndiceItem
                                                        key={item.id}
                                                        data={item}
                                                        researchersCenter
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex flex-col bg-[#D2FBD6] rounded">
                                                <div className="flex items-center p-2 border-b-2 border-[#00BFE3]">
                                                    <p className="font-bold text-green-950">3. Análise de solo</p>
                                                </div>
                                                <div className='p-2'>
                                                    <p>Nessa etapa, deverá ser realizada pesagem e estimativa da biomassa de cobertura de solo da propriedade. Para cada zona de regeneração, o inspetor deverá pesar 5 pontos distintos. Será feita a média e então a extrapolação para a zona total. A quantidade de biomassa entrará como carbono sequestrado. Também será contado a quantidade de insetos visíveis a olho nu encontrados.</p>
                                                </div>
                                            </div>

                                            <p className='font-bold text-[#1b7a74]'>Tabela da analise do solo</p>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => setModalPublish(true)}
                                                    className='px-3 py-2 text-white font-bold rounded-md bg-[#00BFE3]'
                                                >Sugerir Mudanças</button>
                                            </div>

                                            <div className='flex flex-col w-[900px]'>
                                                <div className='flex w-full border-2 bg-white'>
                                                    <div className='w-12 border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>#ID</p>
                                                    </div>

                                                    <div className='w-[250px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Title</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Carbon Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Water Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Soil Value</p>
                                                    </div>

                                                    <div className='w-[150px] border-r-2 h-7 flex items-center justify-center'>
                                                        <p className=''>Bio Value</p>
                                                    </div>
                                                </div>
                                                {analiseSolo.map(item => (
                                                    <IndiceItem
                                                        key={item.id}
                                                        data={item}
                                                        researchersCenter
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex flex-col bg-[#D2FBD6] rounded">
                                                <div className="flex items-center p-2 border-b-2 border-[#00BFE3]">
                                                    <p className="font-bold text-green-950">4. Registro de biodiversidade</p>
                                                </div>
                                                <div className='p-2'>
                                                    <p>Em todas as etapas da inspeção, o inspetor deverá registrar com uma foto toda a biodiversidade encontrada, tanto de plantas quanto de fungos e animais. Cada registro contará 1 unidade de vida.</p>
                                                </div>
                                            </div>

                                            <p className='text-center font-bold text-[#1b7a74]'>Inspeções realizadas com o método</p>
                                            {inspections.map(item => (
                                                <InspectionItemResult
                                                    data={item}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {methodSelected === 'manual' && (
                                        <div>Em desenvolvimento</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
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

            {modalWelcome && (
                <ModalWelcome
                    close={() => setModalWelcome(false)}
                />
            )}
        </div>
    )
}