import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {format} from 'date-fns';
import { api } from '../../services/api';
import { IndiceCalculoItem } from '../../components/IndiceCalculoItem';
import {GetIsa} from '../../services/accountProducerService';
import { saveAs } from 'file-saver';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalViewPhoto } from '../../components/ModalViewPhoto';
import { InsumoItem } from '../../components/InsumoItem';
import { PhotoBiodiversityItem } from '../../components/PhotoBiodiversityItem';
import { ZoneItem } from '../../components/ZoneItem';

export function InspectionItemResult({data, initialVisible}){
    const navigate = useNavigate();
    const {walletAddress} = useParams();
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [openArvores, setOpenArvores] = useState(false);
    const [openBiomassa, setOpenBiomassa] = useState(false);
    const [openInsumosQuimicos, setOpenInsumosQuimicos] = useState(false);
    const [openInsumosBiologicos, setOpenInsumosBiologicos] = useState(false);
    const [openInsumosMinerais, setOpenInsumosMinerais] = useState(false);
    const [openRecursosExternos, setOpenRecursosExternos] = useState(false);
    const [carbonOpen, setCarbonOpen] = useState(false);
    const [aguaOpen, setAguaOpen] = useState(false);
    const [soloOpen, setSoloOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [resultIndices, setResultIndices] = useState({});
    const [inspectionDataApi, setInspectionDataApi] = useState({});
    const [resultCategories, setResultCategories] = useState([]);
    const [resultBiodiversity, setResultBiodiversity] = useState([]);
    const [resultBiomassa, setResultBiomassa] = useState(0);
    const [resultBioInsetos, setResultBioInsetos] = useState(0);
    const [quantArvores, setQuantArvores] = useState(0);
    const [bioArvores, setBioArvores] = useState({});
    const [quantInsumosQuimicos, setQuantInsumosQuimicos] = useState(0);
    const [quantInsumosBiologicos, setQuantInsumosBiologicos] = useState(0);
    const [quantInsumosMinerais, setQuantInsumosMinerais] = useState(0);
    const [quantRecursosExternos, setQuantRecursosExternos] = useState(0);
    const [isas, setIsas] = useState([]);
    const [isaCarbon, setIsaCarbon] = useState({});
    const [isaBio, setIsaBio] = useState({});
    const [isaWater, setIsaWater] = useState({});
    const [isaSoil, setIsaSoil] = useState({});
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');
    const [modalViewPhoto, setModalViewPhoto] = useState(false);
    const [hashSelected, setHashSelected] = useState('');
    const [method, setMethod] = useState('manual');

    //States nova versão do app do ativista com zoneamentos
    const [newVersion, setNewVersion] = useState(false);
    const [zones, setZones] = useState([]);
    const [arvores, setArvores] = useState([]);
    const [bioSolo, setBioSolo] = useState(0);
    const [openZones, setOpenZones] = useState(false);

    useEffect(() => {
        getResultIndices();
        getIsaData();
        if(initialVisible){
            setOpen(true);
        }
        
    },[]);

    async function getIsaData(){
        const response = await GetIsa(data.id);
        setIsas(response)
        for(var i = 0; i < response.length; i++){
            if(response[i].categoryId === '1'){
                setIsaCarbon(response[i])
            }
            if(response[i].categoryId === '2'){
                setIsaBio(response[i])
            }
            if(response[i].categoryId === '3'){
                setIsaWater(response[i])
            }
            if(response[i].categoryId === '4'){
                setIsaSoil(response[i])
            }
        }
    }

    async function getProofPhoto(hash){
        try{
            const resProofPhoto = await axios.get(`https://ipfs.io/ipfs/${hash}`);
            setProofPhotoBase64(resProofPhoto.data);
        }catch(e){
            console.log('sem foto');
        }
    }

    async function calculateArea(coords){
        let coordsUTM = [];
        for(var i = 0; i < coords.length; i++){
            let object = {}
            const response = await axios.get(`https://epsg.io/srs/transform/${coords[i].lng},${coords[i].lat}.json?key=default&s_srs=4326&t_srs=3857`)
            object = response.data.results[0]
            coordsUTM.push(object);
        }

        let areaX = 0;
        let areaY = 0;
        for(var i = 1; i < coordsUTM.length; i++){
            let product1 = coordsUTM[i-1].y * coordsUTM[i].x;
            areaX += product1
        }
        for(var i = 1; i < coordsUTM.length; i++){
            let product2 = coordsUTM[i-1].x * coordsUTM[i].y;
            areaY += product2
        }

        let repeatX = coordsUTM[coordsUTM.length - 1].y * coordsUTM[0].x; 
        let repeatY = coordsUTM[coordsUTM.length - 1].x * coordsUTM[0].y; 

        areaX += repeatX;
        areaY += repeatY;

        let D = areaX - areaY;
        let areaM2 = 0.5 * D;

        return Math.abs(areaM2) 
    }

    async function getResultIndices() {
        const response = await api.get(`/inspection/${data.id}`)
        setInspectionDataApi(response.data.inspection);
        
        if(response.data.inspection.resultCategories === null){
            setMethod('manual');
            if(response.data.inspection.resultCategories === ''){
                setMethod('manual');
            }
            return;
        }else{
            setMethod('sintrop');
        }
        
        if(response.data.inspection.zones === null){
            setNewVersion(false);
        }else{
            setNewVersion(true);
        }

        getProofPhoto(response.data?.inspection?.proofPhoto)
        setResultIndices(JSON.parse(response.data?.inspection?.resultIdices));
        setResultCategories(JSON.parse(response.data?.inspection?.resultCategories));
        setInspectionDataApi(response.data?.inspection);

        const resCategories = JSON.parse(response.data?.inspection?.resultCategories);
        const resBiodiversity = JSON.parse(response.data?.inspection?.biodversityIndice);
        setResultBiodiversity(resBiodiversity);

        if(response.data.inspection.zones !== null){
            const resultZones = JSON.parse(response.data.inspection.zones);
            setZones(resultZones);
            let biomassaSolo = 0;
            let biodiversidadeArvores = 0;
            let mudas = 0;
            let jovens = 0;
            let adultas = 0;
            let ancias = 0;

            for(var i = 0; i < resultZones.length; i++){
                const path = resultZones[i].path;
                const analiseSolo = resultZones[i].analiseSolo;
                const arvores = resultZones[i].arvores;
                const subZone = resultZones[i].subZone;

                //Pega os valores dos indices de cada categoria do sistema
                const responseIndices = await api.get('/subCategories');
                const indices = responseIndices.data.subCategories;
                const indiceAnaliseSolo = indices.filter(item => item.id === '14');
                const indiceArvoreMuda = indices.filter(item => item.id === '9');
                const indiceArvoreJovem = indices.filter(item => item.id === '10');
                const indiceArvoreAdulta = indices.filter(item => item.id === '11');
                const indiceArvoreAncia = indices.filter(item => item.id === '12');
    
                //Filtra no array os dados da analise das arvores
                const arvoresMudas = arvores.filter(item => item.id === 1);
                const arvoresJovens = arvores.filter(item => item.id === 2);
                const arvoresAdultas = arvores.filter(item => item.id === 3);
                const arvoresAncias = arvores.filter(item => item.id === 4);
                const arvoresBio = arvores.filter(item => item.id === 5);
                biodiversidadeArvores += Number(arvoresBio[0].value);
    
                //Calcula as áreas em m² das zonas
                const areaZone = await calculateArea(path);
                const areaSubZone = await calculateArea(subZone);
            
                //regenerationSoil += areaZone;
    
                //Faz o calculo de quantas ávores existem aproximadamente na zona com base na subzona
                const estimatedMudas = ((Number(arvoresMudas[0].value) / areaSubZone) * areaZone).toFixed(0);
                const estimatedJovens = ((Number(arvoresJovens[0].value) / areaSubZone) * areaZone).toFixed(0);
                const estimatedAdultas = ((Number(arvoresAdultas[0].value) / areaSubZone) * areaZone).toFixed(0);
                const estimatedAncias = ((Number(arvoresAncias[0].value) / areaSubZone) * areaZone).toFixed(0);
                mudas += Number(estimatedMudas);
                jovens += Number(estimatedJovens);
                adultas += Number(estimatedAdultas);
                ancias += Number(estimatedAncias);
    
                //Calcula a biomassa das 4 analises de solo
                const calculoBiomassaSolo = (((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) * areaZone) * Number(indiceAnaliseSolo[0].carbonValue);
                biomassaSolo += Number(calculoBiomassaSolo);
            }

            setResultBiomassa(biomassaSolo);
            setArvores({
                mudas,
                jovens,
                adultas,
                ancias,
                total: mudas + jovens + adultas + ancias
            })
        }else{
            const categoryCoberturaSolo = resCategories.filter(item => item.categoryId === '13');
            const soloRegenerado = Number(categoryCoberturaSolo[0]?.value);
            const analiseSolo1 = resCategories.filter(item => item.categoryId === '14');
            const analiseSolo2 = resCategories.filter(item => item.categoryId === '15');
            const analiseSolo3 = resCategories.filter(item => item.categoryId === '16');
            const analiseSolo4 = resCategories.filter(item => item.categoryId === '17');
            const analiseSolo5 = resCategories.filter(item => item.categoryId === '18');
            const calculoBiomassa = ((Number(analiseSolo1[0]?.value) + Number(analiseSolo2[0]?.value) + Number(analiseSolo3[0]?.value) + Number(analiseSolo4[0]?.value) + Number(analiseSolo5[0]?.value)) / 5) * soloRegenerado
            const resultIndiceBiomassa = calculoBiomassa * JSON.parse(analiseSolo1[0].categoryDetails).carbonValue;
    
            const calculoBioInsetos = ((Number(analiseSolo1[0]?.value2) + Number(analiseSolo2[0]?.value2) + Number(analiseSolo3[0]?.value2) + Number(analiseSolo4[0]?.value2) + Number(analiseSolo5[0]?.value2)) / 5) * soloRegenerado   
            
            setResultBioInsetos(calculoBioInsetos);
            setResultBiomassa(resultIndiceBiomassa);
    
            const arvoresMudas = resCategories.filter(item => item.categoryId === '9');
            const arvoresJovens = resCategories.filter(item => item.categoryId === '10');
            const arvoresAdultas = resCategories.filter(item => item.categoryId === '11');
            const arvoresAncias = resCategories.filter(item => item.categoryId === '12');
            const bioArvores = resCategories.filter(item => item.categoryId === '23');
            setBioArvores(bioArvores[0])
            
            setQuantArvores(Number(arvoresMudas[0].value) + Number(arvoresJovens[0].value) + Number(arvoresAdultas[0].value) + Number(arvoresAncias[0].value))
        }

    
        //separa os insumos quimicos e faz a contagem do total utilizado
        const arrayInsumosQuimicos = resCategories.filter(item => JSON.parse(item.categoryDetails).insumoCategory === 'insumo-quimico');
        let totalInsumosQuimicos = 0;
        for(var i = 0; i < arrayInsumosQuimicos.length; i++){
            const value = Number(arrayInsumosQuimicos[i].value);
            totalInsumosQuimicos += value
        }
        setQuantInsumosQuimicos(totalInsumosQuimicos);

        //separa os insumos biologicos e faz a contagem do total utilizado
        const arrayInsumosBiologicos = resCategories.filter(item => JSON.parse(item.categoryDetails).insumoCategory === 'insumo-biologico');
        let totalInsumosBiologicos = 0;
        for(var i = 0; i < arrayInsumosBiologicos.length; i++){
            const value = Number(arrayInsumosBiologicos[i].value);
            totalInsumosBiologicos += value
        }
        setQuantInsumosBiologicos(totalInsumosBiologicos);

        //separa os recursos externos e faz a contagem do total utilizado
        const arrayRecursosExternos = resCategories.filter(item => JSON.parse(item.categoryDetails).insumoCategory === 'recurso-externo');
        let totalRecursosExternos = 0;
        for(var i = 0; i < arrayRecursosExternos.length; i++){
            const value = Number(arrayRecursosExternos[i].value);
            totalRecursosExternos += value
        }
        setQuantRecursosExternos(totalRecursosExternos);
        
        //separa os insumos minerais e faz a contagem do total utilizado
        const arrayInsumosMinerais = resCategories.filter(item => JSON.parse(item.categoryDetails).insumoCategory === 'insumo-mineral');
        let totalInsumosMinerais = 0;
        for(var i = 0; i < arrayInsumosMinerais.length; i++){
            const value = Number(arrayInsumosMinerais[i].value);
            totalInsumosMinerais += value
        }
        setQuantInsumosMinerais(totalInsumosMinerais);
    }

    function handleDownloadPDF(hash, filename){
        saveAs(`https://ipfs.io/ipfs/${hash}`, `${filename}`)
    }

    if(data.status === '2'){

        if(newVersion){
            return(
                <div className='flex flex-col w-full mb-5 rounded-md'>
                    <div 
                        className='flex flex-col lg:flex-row items-center justify-between w-full h-22 bg-[#80421A] p-3 rounded-t-md cursor-pointer'
                        onClick={() => {
                            if(!initialVisible){
                                setOpen(!open)
                            }
                        }}
                    >
                        <div className='flex items-center gap-5'>
                            {!initialVisible && (
                                <>
                                {open ? (
                                    <AiFillCaretUp size={30} color='white'/>
                                ) : (
                                    <AiFillCaretDown size={30} color='white'/>
                                )}
                                </>
                            )}
        
                            <p className='font-bold text-white'>{t('Result')} {t('Inspection')} #{data.id}</p>     
                        </div>
                        <div className='flex items-center gap-7'>
                            <div className='flex items-center justify-center lg:w-52 bg-[#0A4303] p-2 rounded-md'>
                                <p className='font-bold text-white'>ISA {t('Score')}: {data?.isaScore}</p>
                            </div>
                            
                        </div>
                    </div>
        
                    {open && (
                        <div className='p-2 bg-[#0a4303] w-full flex flex-col'>
                            <div className='w-full items-center justify-center'>
                                <div className='flex justify-center'>
                                    <div className='flex gap-2 items-center justify-center'>
                                        {method === 'sintrop' ? (
                                            <img
                                                src={require('../../assets/metodo-sintrop.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        ) : (
                                            <img
                                                src={require('../../assets/metodo-manual.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        )}
                                        <p className='text-white font-bold'>
                                            Método {method === 'sintrop' ? 'Sintrop' : 'Manual'}
                                        </p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="flex flex-col lg:flex-row items-center w-full">
                                <div className="flex flex-col items-center gap-3 w-[50%]">
                                    <p className="font-bold text-white">{t('Proof Photo')}</p>
                                    {proofPhotoBase64 === '' ? (
                                        <div className="w-[200px] h-[250px] rounded-md border-4 border-[#ff9900] flex items-center justify-center bg-gray-500">
                                            <p className="font-bold text-white text-center">{t('No Photo')}</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={proofPhotoBase64}
                                            className="w-[200px] h-[250px] object-cover rounded-md border-4 border-[#ff9900] cursor-pointer"
                                            onClick={() => {
                                                setHashSelected(inspectionDataApi.proofPhoto);
                                                setModalViewPhoto(true)
                                            }}
                                        />
                                    )}
                                </div>
                                <div className='flex flex-wrap w-[50%] justify-center items-center gap-5 mt-5 lg:mt-0 lg:px-16'>
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Carbon')}</p>
                                            <img
                                                src={require('../../assets/co2.png')}
                                                className='w-[55px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {(Number(isaCarbon?.indicator) / 1000).toFixed(1)} t/era
                                            </p>
                                        </div>
                
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Soil')}</p>
                                            <img
                                                src={require('../../assets/solo.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaSoil?.indicator).toFixed(0)} m²/era
                                            </p>
                                        </div>
                                    </div>
                                            
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Water')}</p>
                                            <img
                                                src={require('../../assets/agua.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaWater?.indicator).toFixed()} m³/era
                                            </p>
                                        </div>
        
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Biodiversity')}</p>
                                            <img
                                                src={require('../../assets/bio.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaBio?.indicator).toFixed(0)} uni/era
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row mt-2">
                                <p className='font-bold text-sm lg:text-normal text-[#ff9900]'>{t('Activist')} {t('Wallet')}:</p>
                                <p          
                                    className='text-blue-500 border-b-2 border-blue-500 lg:ml-1 cursor-pointer max-w-[95%] overflow-hidden text-ellipsis'
                                    onClick={() => {
                                        navigate(`/dashboard/${walletAddress}/user-details/2/${data.acceptedBy}`)
                                    }}
                                >
                                    {data.acceptedBy}
                                </p>
                            </div>
        
                            <div className="flex flex-col lg:flex-row mt-2">
                                <p className='font-bold text-sm lg:text-normal text-[#ff9900]'>{t('Producer')} {t('Wallet')}:</p>
                                <p          
                                    className='text-blue-500 border-b-2 border-blue-500 lg:ml-1 cursor-pointer max-w-[95%] overflow-hidden text-ellipsis'
                                    onClick={() => {
                                        navigate(`/dashboard/${walletAddress}/user-details/1/${data.createdBy}`)
                                    }}
                                >
                                    {data.createdBy}
                                </p>
                            </div>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Created At')}: <span className='text-white'>{format(new Date(Number(data.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Accepted At')}: <span className='text-white'>{format(new Date(Number(data.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Inspected At')}: <span className='text-white'>{format(new Date(Number(data.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
        
                            <div className='flex flex-col bg-green-950 p-3 w-full mt-5'>
                                {method === 'sintrop' && (
                                    <>
                                        {/* REGENERAÇÃO */}
                                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19]'>
                                            <h3 className='font-bold text-white text-lg lg:text-3xl'>{t('Regeneration')}</h3>
                                        </div>
                                        <div className='flex flex-wrap mt-5 gap-4'>

                                            {/* Lista as arvores */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openArvores ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Total Trees')}</h4>
                                                        <p className='font-bold text-white text-lg lg:text-2xl'>{arvores?.total}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/arvore-branca.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenArvores(!openArvores)}
                                                >
                                                    {openArvores ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openArvores ? (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openArvores && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        
                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-sm lg:text-normal text-white lg:w-[200px]'>Mudas</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-sm lg:text-normal text-blue-400 text-center'>{arvores?.mudas}</p>
                                                            </div>
                                                        </div>

                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-sm lg:text-normal text-white lg:w-[200px]'>Jovens</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-sm lg:text-normal text-blue-400 text-center'>{arvores?.jovens}</p>
                                                            </div>
                                                        </div>

                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-sm lg:text-normal text-white lg:w-[200px]'>Adultas</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-sm lg:text-normal text-blue-400 text-center'>{arvores?.adultas}</p>
                                                            </div>
                                                        </div>

                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-sm lg:text-normal text-white lg:w-[200px]'>Anciâs</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-sm lg:text-normal text-blue-400 text-center'>{arvores?.ancias}</p>
                                                            </div>
                                                        </div>
                                            
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Mostra o resultado da biodiversidade */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openBiomassa ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] text-lg lg:text-2xl'>{t('Biomass')}</h4>
                                                        <p className='font-bold text-white text-lg lg:text-2xl'>{resultBiomassa.toFixed(0)} Kg</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/fertilizante-orgânico.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenBiomassa(!openBiomassa)}
                                                >
                                                    {openBiomassa ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openBiomassa ? (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openBiomassa && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='biomassa'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
        
                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-white lg:w-[200px]'>Resultado</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-blue-400 text-center'>{resultBiomassa.toFixed(0)} Kg</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Carrosel de imagens da biodiversidade */}
                                            <div className="flex flex-col w-full">
                                                <p className="font-bold text-white mb-1">{t('Biodiversity Registry')}</p>
                                                <div className="flex items-center gap-3 overflow-auto">
                                                    {resultBiodiversity.length > 0 && (
                                                        <>
                                                        {resultBiodiversity.map(item => (
                                                            <PhotoBiodiversityItem
                                                                data={item}
                                                                click={(hash) => {
                                                                    setHashSelected(hash);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Exibe as zonas cadastradas no app mobile */}
                                            <div className={`flex flex-col w-full lg:w-[100%] bg-[#0a4303] pb-2`}>
                                                <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {zones.map(item => (
                                                            <ZoneItem
                                                                data={item}
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}   
                                                </div>
                                            </div>
                                        </div>
                                        {/* REGENERAÇÃO */}
        
                                        {/* DEGENERAÇÃO */}
                                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19] mt-10'>
                                            <h3 className='font-bold text-white text-lg lg:text-3xl'>{t('Degeneration')}</h3>
                                        </div>
        
                                        <div className='flex flex-wrap mt-5 gap-4'>

                                            {/* Insumos Químicos */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosQuimicos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Chemical Supplies')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosQuimicos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/caveira.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosQuimicos(!openInsumosQuimicos)}
                                                >
                                                    {openInsumosQuimicos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosQuimicos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosQuimicos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-quimico'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Insumos biologicos */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosBiologicos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Biological Inputs')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosBiologicos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/vaso.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosBiologicos(!openInsumosBiologicos)}
                                                >
                                                    {openInsumosBiologicos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosBiologicos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosBiologicos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-biologico'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Insumos Minerais */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosMinerais ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Mineral Inputs')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosMinerais} kg</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/vaso.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosMinerais(!openInsumosMinerais)}
                                                >
                                                    {openInsumosMinerais ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosMinerais ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosMinerais && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-mineral'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Lista os recursos externos */}
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openRecursosExternos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('External Resources')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantRecursosExternos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/torre.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenRecursosExternos(!openRecursosExternos)}
                                                >
                                                    {openRecursosExternos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openRecursosExternos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openRecursosExternos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='recurso-externo'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))} 
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* DEGENERAÇÃO */}
                                    </>
                                )}
        
                            {/* Carbono ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setCarbonOpen(!carbonOpen)}
                                >
                                    <div className="lg:w-28">
                                        {carbonOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('CARBON')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/co2.png')}
                                            className='w-[55px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-base flex items-end'>
                                            {(Number(isaCarbon?.indicator) / 1000).toFixed(1)} t/era
                                        </p>
                                    </div>
                                </div>
                                
                                {carbonOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaCarbon.isaIndex === '0' && ' Regenerative 3'}
                                                {isaCarbon.isaIndex === '1' && ' Regenerative 2'}
                                                {isaCarbon.isaIndex === '2' && ' Regenerative 1'}
                                                {isaCarbon.isaIndex === '3' && ' Neutro'}
                                                {isaCarbon.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaCarbon.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaCarbon.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
                                        {method === 'sintrop' && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div className='lg:w-[440px]'>
                                                    <p className='font-bold text-white'>{t('Degeneration')}</p>
                                                    
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='carbon'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
                                                
                                                <div className="flex flex-col">
                                                    <div className='lg:w-[440px]'>
                                                        <p className='font-bold text-white'>{t('Regeneration')}</p>
                                                        
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='carbon'
                                                                    />
                                                                ))}
                                                                    
                                                            </div>
                                                        )}
                                                        
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900]">¹Biomassa de solo:</p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold text-white mx-1">=</p>
                                                            <p className="font-bold mx-2 text-green-400">{resultBiomassa.toFixed(0)} Kg Co²</p>
                                                        </div>
                                                    </div>
                                                </div>
        
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaCarbon?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                                onClick={() => handleDownloadPDF(isaCarbon?.report, `Carbon Report - Inspection ${data.id}`)}
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Carbono ------------------------------------------------------ */}
        
                            {/* Água ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setAguaOpen(!aguaOpen)}
                                >
                                    <div className="lg:w-28">
                                        {aguaOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('WATER')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/agua.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaWater?.indicator).toFixed(0)} m³
                                        </p>
                                    </div>
                                </div>
                                
                                {aguaOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaWater.isaIndex === '0' && ' Regenerative 3'}
                                                {isaWater.isaIndex === '1' && ' Regenerative 2'}
                                                {isaWater.isaIndex === '2' && ' Regenerative 1'}
                                                {isaWater.isaIndex === '3' && ' Neutro'}
                                                {isaWater.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaWater.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaWater.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='agua'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
        
                                                <div>
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='agua'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaWater?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaWater?.report, `Water Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Água ------------------------------------------------------ */}
        
                            {/* Solo ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setSoloOpen(!soloOpen)}
                                >
                                    <div className="lg:w-28">
                                        {soloOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('SOIL')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/solo.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaSoil?.indicator).toFixed(0)} m²
                                        </p>
                                    </div>
                                </div>
                                
                                {soloOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaSoil.isaIndex === '0' && ' Regenerative 3'}
                                                {isaSoil.isaIndex === '1' && ' Regenerative 2'}
                                                {isaSoil.isaIndex === '2' && ' Regenerative 1'}
                                                {isaSoil.isaIndex === '3' && ' Neutro'}
                                                {isaSoil.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaSoil.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaSoil.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='solo'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
        
                                                <div>
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='solo'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaSoil?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaSoil?.report, `Solo Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Solo ------------------------------------------------------ */}
        
                            {/* Bio ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setBioOpen(!bioOpen)}
                                >
                                    <div className="lg:w-28">
                                        {bioOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('BIODIVERSITY')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/bio.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaBio?.indicator).toFixed(0)} uni
                                        </p>
                                    </div>
                                </div>
                                
                                {bioOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaBio.isaIndex === '0' && ' Regenerative 3'}
                                                {isaBio.isaIndex === '1' && ' Regenerative 2'}
                                                {isaBio.isaIndex === '2' && ' Regenerative 1'}
                                                {isaBio.isaIndex === '3' && ' Neutro'}
                                                {isaBio.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaBio.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaBio.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='bio'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col lg:w-[440px]">
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">Registro de biodiversidade: </p>
                                                        <div className="flex items-center">
            
                                                            <p className="font-bold mx-2 text-red-500"> {resultBiodiversity.length}</p>
                                                            <p className="font-bold text-white mx-1">x</p>
                                                            <p className="font-bold mx-2 text-blue-500">1</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <p className="font-bold text-white mx-1">=</p>
                                                        <p className="font-bold  mx-2 text-green-400">{Number(Number(resultBiodiversity.length) * 1).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">Biodiversidade de árvores: </p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold mx-2 text-red-500"> {bioArvores?.value}</p>
                                                            <p className="font-bold text-white mx-1">x</p>
                                                            <p className="font-bold mx-2 text-blue-500">1</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <p className="font-bold text-white mx-1">=</p>
                                                        <p className="font-bold  mx-2 text-green-400">{bioArvores.value}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900]">¹Biodiversidade de insetos:</p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold text-white mx-1">=</p>
                                                            <p className="font-bold mx-2 text-green-400">{resultBioInsetos.toFixed(0)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="font-bold text-white mt-5 mb-1">{t('Biodiversity Registry')}</p>
                                            <div className="flex items-center gap-3 overflow-auto">
                                                {resultBiodiversity.length > 0 && (
                                                    <>
                                                    {resultBiodiversity.map(item => (
                                                        <PhotoBiodiversityItem
                                                            data={item}
                                                            click={(hash) => {
                                                                setHashSelected(hash);
                                                                setModalViewPhoto(true);
                                                            }}
                                                        />
                                                    ))}
                                                    </>
                                                )}
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaBio?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaBio?.report, `Biodiversity Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Bio ------------------------------------------------------ */}
                            </div>
        
                        </div>
                    )}
        
                    <Dialog.Root
                        open={modalViewPhoto}
                        onOpenChange={(open) => setModalViewPhoto(open)}
                    >
                        <ModalViewPhoto
                            close={() => setModalViewPhoto(false)}
                            hash={hashSelected}
                        />
                    </Dialog.Root>
                </div>
            )
        }else{
            return(
                <div className='flex flex-col w-full mb-5 rounded-md'>
                    <div 
                        className='flex flex-col lg:flex-row items-center justify-between w-full h-22 bg-[#80421A] p-3 rounded-t-md cursor-pointer'
                        onClick={() => {
                            if(!initialVisible){
                                setOpen(!open)
                            }
                        }}
                    >
                        <div className='flex items-center gap-5'>
                            {!initialVisible && (
                                <>
                                {open ? (
                                    <AiFillCaretUp size={30} color='white'/>
                                ) : (
                                    <AiFillCaretDown size={30} color='white'/>
                                )}
                                </>
                            )}
        
                            <p className='font-bold text-white'>{t('Result')} {t('Inspection')} #{data.id}</p>     
                        </div>
                        <div className='flex items-center gap-7'>
                            <div className='flex items-center justify-center lg:w-52 bg-[#0A4303] p-2 rounded-md'>
                                <p className='font-bold text-white'>ISA {t('Score')}: {data?.isaScore}</p>
                            </div>
                            
                        </div>
                    </div>
        
                    {open && (
                        <div className='p-2 bg-[#0a4303] w-full flex flex-col'>
                            <div className='w-full items-center justify-center'>
                                <div className='flex justify-center'>
                                    <div className='flex gap-2 items-center justify-center'>
                                        {method === 'sintrop' ? (
                                            <img
                                                src={require('../../assets/metodo-sintrop.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        ) : (
                                            <img
                                                src={require('../../assets/metodo-manual.png')}
                                                className='w-[30px] object-contain'
                                            />
                                        )}
                                        <p className='text-white font-bold'>
                                            Método {method === 'sintrop' ? 'Sintrop' : 'Manual'}
                                        </p>
                                    </div>
                                </div>
                            </div>
        
                            <div className="flex flex-col lg:flex-row items-center w-full">
                                <div className="flex flex-col items-center gap-3 w-[50%]">
                                    <p className="font-bold text-white">{t('Proof Photo')}</p>
                                    {proofPhotoBase64 === '' ? (
                                        <div className="w-[200px] h-[250px] rounded-md border-4 border-[#ff9900] flex items-center justify-center bg-gray-500">
                                            <p className="font-bold text-white text-center">{t('No Photo')}</p>
                                        </div>
                                    ) : (
                                        <img
                                            src={proofPhotoBase64}
                                            className="w-[200px] h-[250px] object-cover rounded-md border-4 border-[#ff9900] cursor-pointer"
                                            onClick={() => {
                                                setHashSelected(inspectionDataApi.proofPhoto);
                                                setModalViewPhoto(true)
                                            }}
                                        />
                                    )}
                                </div>
                                <div className='flex flex-wrap w-[50%] justify-center items-center gap-5 mt-5 lg:mt-0 lg:px-16'>
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Carbon')}</p>
                                            <img
                                                src={require('../../assets/co2.png')}
                                                className='w-[55px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {(Number(isaCarbon?.indicator) / 1000).toFixed(1)} t/era
                                            </p>
                                        </div>
                
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Soil')}</p>
                                            <img
                                                src={require('../../assets/solo.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaSoil?.indicator).toFixed(0)} m²/era
                                            </p>
                                        </div>
                                    </div>
                                            
                                    <div className='flex items-center gap-5'>
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Water')}</p>
                                            <img
                                                src={require('../../assets/agua.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaWater?.indicator).toFixed()} m³/era
                                            </p>
                                        </div>
        
                                        <div className='flex flex-col items-center bg-green-950 p-3 rounded-md w-36 lg:w-40'>
                                            <p className='font-bold text-[#ff9900]'>{t('Biodiversity')}</p>
                                            <img
                                                src={require('../../assets/bio.png')}
                                                className='w-[40px] h-[40px] object-contain'
                                            />
                                            <p className='font-bold text-white lg:text-lg flex items-end'>
                                                {Number(isaBio?.indicator).toFixed(0)} uni/era
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row mt-2">
                                <p className='font-bold text-sm lg:text-normal text-[#ff9900]'>{t('Activist')} {t('Wallet')}:</p>
                                <p          
                                    className='text-blue-500 border-b-2 border-blue-500 lg:ml-1 cursor-pointer max-w-[95%] overflow-hidden text-ellipsis'
                                    onClick={() => {
                                        navigate(`/dashboard/${walletAddress}/user-details/2/${data.acceptedBy}`)
                                    }}
                                >
                                    {data.acceptedBy}
                                </p>
                            </div>
        
                            <div className="flex flex-col lg:flex-row mt-2">
                                <p className='font-bold text-sm lg:text-normal text-[#ff9900]'>{t('Producer')} {t('Wallet')}:</p>
                                <p          
                                    className='text-blue-500 border-b-2 border-blue-500 lg:ml-1 cursor-pointer max-w-[95%] overflow-hidden text-ellipsis'
                                    onClick={() => {
                                        navigate(`/dashboard/${walletAddress}/user-details/1/${data.createdBy}`)
                                    }}
                                >
                                    {data.createdBy}
                                </p>
                            </div>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Created At')}: <span className='text-white'>{format(new Date(Number(data.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Accepted At')}: <span className='text-white'>{format(new Date(Number(data.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                            <p className='font-bold text-sm lg:text-normal text-[#ff9900] mt-1'>{t('Inspected At')}: <span className='text-white'>{format(new Date(Number(data.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
        
                            <div className='flex flex-col bg-green-950 p-3 w-full mt-5'>
                                {method === 'sintrop' && (
                                    <>
                                        {/* REGENERAÇÃO */}
                                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19]'>
                                            <h3 className='font-bold text-white text-lg lg:text-3xl'>{t('Regeneration')}</h3>
                                        </div>
                                        <div className='flex flex-wrap mt-5 gap-4'>
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openArvores ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Total Trees')}</h4>
                                                        <p className='font-bold text-white text-lg lg:text-2xl'>{quantArvores}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/arvore-branca.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenArvores(!openArvores)}
                                                >
                                                    {openArvores ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openArvores ? (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openArvores && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => {
                                                            const categoryDetails = JSON.parse(item.categoryDetails)
                                                            if(categoryDetails.category === '2'){
                                                                return(
                                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                                        <p className='font-bold text-sm lg:text-normal text-white lg:w-[200px]'>{item.title}</p>
        
                                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                            <p className='font-bold text-sm lg:text-normal text-blue-400 text-center'>{item.value}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        })}
        
                                                        
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openBiomassa ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] text-lg lg:text-2xl'>{t('Biomass')}</h4>
                                                        <p className='font-bold text-white text-lg lg:text-2xl'>{resultBiomassa.toFixed(0)} Kg</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/fertilizante-orgânico.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenBiomassa(!openBiomassa)}
                                                >
                                                    {openBiomassa ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openBiomassa ? (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-sm lg:text-normal text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openBiomassa && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='biomassa'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
        
                                                        <div className='flex w-full items-center justify-between'>
                                                            <p className='font-bold text-white lg:w-[200px]'>Resultado</p>
        
                                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                                <p className='font-bold text-blue-400 text-center'>{resultBiomassa.toFixed(0)} Kg</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className="flex flex-col w-full">
                                                <p className="font-bold text-white mb-1">{t('Biodiversity Registry')}</p>
                                                <div className="flex items-center gap-3 overflow-auto">
                                                    {resultBiodiversity.length > 0 && (
                                                        <>
                                                        {resultBiodiversity.map(item => (
                                                            <PhotoBiodiversityItem
                                                                data={item}
                                                                click={(hash) => {
                                                                    setHashSelected(hash);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* REGENERAÇÃO */}
        
                                        {/* DEGENERAÇÃO */}
                                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19] mt-10'>
                                            <h3 className='font-bold text-white text-lg lg:text-3xl'>{('Degeneration')}</h3>
                                        </div>
        
                                        <div className='flex flex-wrap mt-5 gap-4'>
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosQuimicos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Chemical Supplies')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosQuimicos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/caveira.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosQuimicos(!openInsumosQuimicos)}
                                                >
                                                    {openInsumosQuimicos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosQuimicos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosQuimicos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-quimico'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosBiologicos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Biological Inputs')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosBiologicos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/vaso.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosBiologicos(!openInsumosBiologicos)}
                                                >
                                                    {openInsumosBiologicos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosBiologicos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosBiologicos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-biologico'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosMinerais ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('Mineral Inputs')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantInsumosMinerais} kg</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/vaso.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenInsumosMinerais(!openInsumosMinerais)}
                                                >
                                                    {openInsumosMinerais ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openInsumosMinerais ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openInsumosMinerais && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='insumo-mineral'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
        
                                            <div className={`flex flex-col w-full lg:w-[49%] bg-[#0a4303] pb-2 ${openRecursosExternos ? 'h-auto' : 'h-44'}`}>
                                                <div className='flex items-center justify-between w-full p-3'>
                                                    <div className='flex flex-col gap-2'>
                                                        <h4 className='font-bold text-[#ff9900] lg:text-2xl'>{t('External Resources')}</h4>
                                                        <p className='font-bold text-white lg:text-2xl'>{quantRecursosExternos}</p>
                                                    </div>
        
                                                    <img 
                                                        src={require('../../assets/torre.png')}
                                                        className='w-24 h-28 object-contain'
                                                    />
                                                </div>
                                                <div 
                                                    className='bg-[#0D5305] mx-2 h-8 flex items-center gap-3 px-2 cursor-pointer'
                                                    onClick={() => setOpenRecursosExternos(!openRecursosExternos)}
                                                >
                                                    {openRecursosExternos ? (
                                                        <AiFillCaretUp size={20} color='white'/>
                                                    ) : (
                                                        <AiFillCaretDown size={20} color='white'/>
                                                    )}
        
                                                    {openRecursosExternos ? (
                                                        <p className='font-bold text-white'>{t('Show Less')}</p>
                                                    ) : (
                                                        <p className='font-bold text-white'>{t('Show More')}</p>
                                                    )}
                                                </div>
        
                                                {openRecursosExternos && (
                                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                                        {resultCategories.map(item => (
                                                            <InsumoItem
                                                                data={item}
                                                                typeInsumo='recurso-externo'
                                                                viewPhoto={(hash) => {
                                                                    setHashSelected(hash, item);
                                                                    setModalViewPhoto(true);
                                                                }}
                                                            />
                                                        ))} 
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* DEGENERAÇÃO */}
                                    </>
                                )}
        
                            {/* Carbono ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setCarbonOpen(!carbonOpen)}
                                >
                                    <div className="lg:w-28">
                                        {carbonOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('CARBON')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/co2.png')}
                                            className='w-[55px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-base flex items-end'>
                                            {(Number(isaCarbon?.indicator) / 1000).toFixed(1)} t/era
                                        </p>
                                    </div>
                                </div>
                                
                                {carbonOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaCarbon.isaIndex === '0' && ' Regenerative 3'}
                                                {isaCarbon.isaIndex === '1' && ' Regenerative 2'}
                                                {isaCarbon.isaIndex === '2' && ' Regenerative 1'}
                                                {isaCarbon.isaIndex === '3' && ' Neutro'}
                                                {isaCarbon.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaCarbon.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaCarbon.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
                                        {method === 'sintrop' && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div className='lg:w-[440px]'>
                                                    <p className='font-bold text-white'>t{('Degeneration')}</p>
                                                    
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='carbon'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
                                                
                                                <div className="flex flex-col">
                                                    <div className='lg:w-[440px]'>
                                                        <p className='font-bold text-white'>t{('Regeneration')}</p>
                                                        
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='carbon'
                                                                    />
                                                                ))}
                                                                    
                                                            </div>
                                                        )}
                                                        
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900]">¹Biomassa de solo:</p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold text-white mx-1">=</p>
                                                            <p className="font-bold mx-2 text-green-400">{resultBiomassa.toFixed(0)} Kg Co²</p>
                                                        </div>
                                                    </div>
                                                </div>
        
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaCarbon?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                                onClick={() => handleDownloadPDF(isaCarbon?.report, `Carbon Report - Inspection ${data.id}`)}
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Carbono ------------------------------------------------------ */}
        
                            {/* Água ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setAguaOpen(!aguaOpen)}
                                >
                                    <div className="lg:w-28">
                                        {aguaOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('WATER')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/agua.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaWater?.indicator).toFixed(0)} m³
                                        </p>
                                    </div>
                                </div>
                                
                                {aguaOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaWater.isaIndex === '0' && ' Regenerative 3'}
                                                {isaWater.isaIndex === '1' && ' Regenerative 2'}
                                                {isaWater.isaIndex === '2' && ' Regenerative 1'}
                                                {isaWater.isaIndex === '3' && ' Neutro'}
                                                {isaWater.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaWater.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaWater.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='agua'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
        
                                                <div>
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='agua'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaWater?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaWater?.report, `Water Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Água ------------------------------------------------------ */}
        
                            {/* Solo ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setSoloOpen(!soloOpen)}
                                >
                                    <div className="lg:w-28">
                                        {soloOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('SOIL')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/solo.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaSoil?.indicator).toFixed(0)} m²
                                        </p>
                                    </div>
                                </div>
                                
                                {soloOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaSoil.isaIndex === '0' && ' Regenerative 3'}
                                                {isaSoil.isaIndex === '1' && ' Regenerative 2'}
                                                {isaSoil.isaIndex === '2' && ' Regenerative 1'}
                                                {isaSoil.isaIndex === '3' && ' Neutro'}
                                                {isaSoil.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaSoil.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaSoil.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full lg:w-[440px]">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='solo'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                </div>
        
                                                <div>
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='regeneration'
                                                                        indice='solo'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaSoil?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaSoil?.report, `Solo Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Solo ------------------------------------------------------ */}
        
                            {/* Bio ------------------------------------------------------ */}
                            <div className='flex flex-col w-full mt-10'>
                                <div 
                                    className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
                                    onClick={() => setBioOpen(!bioOpen)}
                                >
                                    <div className="lg:w-28">
                                        {bioOpen ? (
                                            <AiFillCaretUp size={30} color='white'/>
                                        ) : (
                                            <AiFillCaretDown size={30} color='white'/>
                                        )}
                                    </div>
        
                                    <p className='font-bold text-white text-xl lg:text-4xl'>{t('BIODIVERSITY')}</p>
        
                                    <div className='flex flex-col items-end lg:w-28'>
                                        <img
                                            src={require('../../assets/bio.png')}
                                            className='w-[40px] h-[40px] object-contain'
                                        />
                                        <p className='font-bold text-white text-lg flex items-end'>
                                            {Number(isaBio?.indicator).toFixed(0)} uni
                                        </p>
                                    </div>
                                </div>
                                
                                {bioOpen && (
                                    <div className='p-2 w-full flex flex-col'>
                                        <p className='text-white text-center'>
                                            Classificação na categoria:
                                            <span className='font-bold text-[#ff9900]'>
                                                {isaBio.isaIndex === '0' && ' Regenerative 3'}
                                                {isaBio.isaIndex === '1' && ' Regenerative 2'}
                                                {isaBio.isaIndex === '2' && ' Regenerative 1'}
                                                {isaBio.isaIndex === '3' && ' Neutro'}
                                                {isaBio.isaIndex === '4' && ' Not Regenerative 1'}
                                                {isaBio.isaIndex === '5' && ' Not Regenerative 2'}
                                                {isaBio.isaIndex === '6' && ' Not Regenerative 3'}
                                            </span> 
                                        </p>
        
                                        {resultCategories.length > 0 && (
                                            <>
                                            <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                                <div>
                                                    <p className='font-bold text-white'>Degeneração</p>
                                                    <div className="flex flex-col lg:w-[440px]">
                                                        {resultCategories.length > 0 && (
                                                            <div className="flex flex-col w-full">
                                                                {resultCategories.map(item => (
                                                                    <IndiceCalculoItem
                                                                        key={item.id}
                                                                        data={item}
                                                                        type='degeneration'
                                                                        indice='bio'
                                                                    />
                                                                ))}
                                                                
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col lg:w-[440px]">
                                                    <p className='font-bold text-white'>Regeneração</p>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">Registro de biodiversidade: </p>
                                                        <div className="flex items-center">
            
                                                            <p className="font-bold mx-2 text-red-500"> {resultBiodiversity.length}</p>
                                                            <p className="font-bold text-white mx-1">x</p>
                                                            <p className="font-bold mx-2 text-blue-500">1</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <p className="font-bold text-white mx-1">=</p>
                                                        <p className="font-bold  mx-2 text-green-400">{Number(Number(resultBiodiversity.length) * 1).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900] text-center lg:w-[150px]">Biodiversidade de árvores: </p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold mx-2 text-red-500"> {bioArvores?.value}</p>
                                                            <p className="font-bold text-white mx-1">x</p>
                                                            <p className="font-bold mx-2 text-blue-500">1</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                        <p className="font-bold text-white mx-1">=</p>
                                                        <p className="font-bold  mx-2 text-green-400">{bioArvores.value}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between border-2 px-2 py-1 mb-3 rounded-md bg-[#0a4303]">
                                                        <p className="font-bold text-[#ff9900]">¹Biodiversidade de insetos:</p>
                                                        <div className="flex items-center">
                                                            <p className="font-bold text-white mx-1">=</p>
                                                            <p className="font-bold mx-2 text-green-400">{resultBioInsetos.toFixed(0)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="font-bold text-white mt-5 mb-1">{t('Biodiversity Registry')}</p>
                                            <div className="flex items-center gap-3 overflow-auto">
                                                {resultBiodiversity.length > 0 && (
                                                    <>
                                                    {resultBiodiversity.map(item => (
                                                        <PhotoBiodiversityItem
                                                            data={item}
                                                            click={(hash) => {
                                                                setHashSelected(hash);
                                                                setModalViewPhoto(true);
                                                            }}
                                                        />
                                                    ))}
                                                    </>
                                                )}
                                            </div>
        
                                            <div className='flex flex-col gap-1'>
                                                <p className='text-white'>Legenda</p>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900] text-sm'>ABC</p>
                                                    <p className=' text-white text-sm'> - Insumo inspecionado na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-red-500'/>
                                                    <p className=' text-white text-sm'> - Quantidade encontrada na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-blue-500'/>
                                                    <p className=' text-white text-sm'> - Valor do impacto no meio ambiente</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='border-2 w-7 border-green-400'/>
                                                    <p className=' text-white text-sm'> - Valor total do impacto na propriedade</p>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-bold text-[#ff9900]'>¹</p>
                                                    <p className=' text-white text-sm'> - Para ver o cálculo detalhado acesse o PDF</p>
                                                </div>
                                            </div>
                                            </>
                                        )}
        
                                        <div className='flex items-center mt-5 gap-2'>
                                            <a  
                                                target='_blank'
                                                href={`https://ipfs.io/ipfs/${isaBio?.report}`}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >View PDF</a>
        
                                            <button
                                                onClick={() => handleDownloadPDF(isaBio?.report, `Biodiversity Report - Inspection ${data.id}`)}
                                                className='w-32 text-center py-2 font-bold bg-[#ff9900] rounded-md'
                                            >Download PDF</button>
                                        </div>
                                    </div>
                                )}
        
                            </div>
                            {/* Bio ------------------------------------------------------ */}
                            </div>
        
                        </div>
                    )}
        
                    <Dialog.Root
                        open={modalViewPhoto}
                        onOpenChange={(open) => setModalViewPhoto(open)}
                    >
                        <ModalViewPhoto
                            close={() => setModalViewPhoto(false)}
                            hash={hashSelected}
                        />
                    </Dialog.Root>
                </div>
            )
        }
    }
}