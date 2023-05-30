import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {format} from 'date-fns';
import { api } from '../../services/api';
import { IndiceValueItem } from '../../components/IndiceValueItem';
import { IndiceCalculoItem } from '../../components/IndiceCalculoItem';
import {GetIsa, GetInspection} from '../../services/manageInspectionsService';
import { saveAs } from 'file-saver';

export function InspectionItemResult({data, initialVisible}){
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [openArvores, setOpenArvores] = useState(false);
    const [openBiomassa, setOpenBiomassa] = useState(false);
    const [openInsumosQuimicos, setOpenInsumosQuimicos] = useState(false);
    const [openInsumosBiologicos, setOpenInsumosBiologicos] = useState(false);
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
    const [quantArvores, setQuantArvores] = useState(0);
    const [quantInsumosQuimicos, setQuantInsumosQuimicos] = useState(0);
    const [quantInsumosBiologicos, setQuantInsumosBiologicos] = useState(0);
    const [quantRecursosExternos, setQuantRecursosExternos] = useState(0);
    const [isas, setIsas] = useState([]);

    useEffect(() => {
        getResultIndices();
        getIsaData();
        if(initialVisible){
            setOpen(true)
        }
        
    },[]);

    async function getIsaData(){
        const response = await GetIsa(data.id);
        setIsas(response)
        console.log(response)
    }

    async function getResultIndices() {
        const response = await api.get(`/inspection/${data.id}`)
        setResultIndices(JSON.parse(response.data?.inspection?.resultIdices))
        setResultCategories(JSON.parse(response.data?.inspection?.resultCategories))

        const resCategories = JSON.parse(response.data?.inspection?.resultCategories);
        const resBiodiversity = JSON.parse(response.data?.inspection?.biodversityIndice);
        setResultBiodiversity(resBiodiversity);

        const categoryCoberturaSolo = resCategories.filter(item => item.categoryId === '13')
        const soloRegenerado = Number(categoryCoberturaSolo[0]?.value)
        const biomassa1 = resCategories.filter(item => item.categoryId === '14')
        const biomassa2 = resCategories.filter(item => item.categoryId === '15')
        const biomassa3 = resCategories.filter(item => item.categoryId === '16')
        const biomassa4 = resCategories.filter(item => item.categoryId === '17')
        const biomassa5 = resCategories.filter(item => item.categoryId === '18')
        const calculoBiomassa = ((Number(biomassa1[0]?.value) + Number(biomassa2[0]?.value) + Number(biomassa3[0]?.value) + Number(biomassa4[0]?.value) + Number(biomassa5[0]?.value)) / 5) * soloRegenerado
        const resultIndiceBiomassa = calculoBiomassa * JSON.parse(biomassa1[0].categoryDetails).carbonValue;
        setResultBiomassa(resultIndiceBiomassa);
        setInspectionDataApi(response.data?.inspection);

        const arvoresMudas = resCategories.filter(item => item.categoryId === '9');
        const arvoresJovens = resCategories.filter(item => item.categoryId === '10');
        const arvoresAdultas = resCategories.filter(item => item.categoryId === '11');
        const arvoresAncias = resCategories.filter(item => item.categoryId === '12');
        setQuantArvores(Number(arvoresMudas[0].value) + Number(arvoresJovens[0].value) + Number(arvoresAdultas[0].value) + Number(arvoresAncias[0].value))
    
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
    }

    function handleDownloadPDF(hash, filename){
        saveAs(`https://ipfs.io/ipfs/${hash}`, `${filename}`)
    }

    if(data.status === '2'){
    return(
        <div className='flex flex-col w-full mb-5 rounded-md'>
            <div 
                className='flex items-center justify-between w-full h-20 bg-[#80421A] p-3 rounded-t-md cursor-pointer'
                onClick={() => setOpen(!open)}
            >
                <div className='flex items-center gap-5'>
                    {open ? (
                        <AiFillCaretUp size={30} color='white'/>
                    ) : (
                        <AiFillCaretDown size={30} color='white'/>
                    )}

                    <p className='font-bold text-white'>{t('Result')} {t('Inspection')} #{data.id}</p>     
                </div>
                <div className='hidden lg:flex items-center gap-7'>
                    <div className='flex items-center justify-center lg:w-52 bg-[#0A4303] p-2 rounded-md'>
                        <p className='font-bold text-white'>ISA {t('Score')}: {data?.isaScore}</p>
                    </div>
                    
                </div>
            </div>

            {open && (
                <div className='p-2 bg-[#0a4303] w-full flex flex-col'>
                    <div className='flex w-full justify-center items-center gap-16'>
                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-[#ff9900]'>Carbono</p>
                            <img
                                src={require('../../assets/co2.png')}
                                className='w-[55px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.carbon} kg
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-[#ff9900]'>Solo</p>
                            <img
                                src={require('../../assets/solo.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.solo} m²
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-[#ff9900]'>Água</p>
                            <img
                                src={require('../../assets/agua.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.agua} m³
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-[#ff9900]'>Biodiversidade</p>
                            <img
                                src={require('../../assets/bio.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.bio} uni
                            </p>
                        </div>
                    </div>
                    
                    <p className='font-bold text-[#ff9900] mt-5'>{t('Activist')} {t('Wallet')}: <span className='text-white'>{data.acceptedBy}</span></p>
                    <p className='font-bold text-[#ff9900]'>{t('Created At')}: <span className='text-white'>{format(new Date(Number(data.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                    <p className='font-bold text-[#ff9900]'>{t('Accepted At')}: <span className='text-white'>{format(new Date(Number(data.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>
                    <p className='font-bold text-[#ff9900]'>{t('Inspected At')}: <span className='text-white'>{format(new Date(Number(data.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</span></p>

                    <div className='flex flex-col bg-green-950 p-3 w-full mt-5'>
                        {/* REGENERAÇÃO */}
                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19]'>
                            <h3 className='font-bold text-white text-3xl'>Regeneração</h3>
                        </div>
                        <div className='flex flex-wrap mt-5 gap-4'>
                            <div className={`flex flex-col lg:w-[49%] bg-[#0a4303] pb-2 ${openArvores ? 'h-auto' : 'h-44'}`}>
                                <div className='flex items-center justify-between w-full p-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-bold text-[#ff9900] text-2xl'>Quant. de Árvores</h4>
                                        <p className='font-bold text-white text-2xl'>{quantArvores}</p>
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
                                        <p className='font-bold text-white'>Mostrar Menos</p>
                                    ) : (
                                        <p className='font-bold text-white'>Mostrar Mais</p>
                                    )}
                                </div>

                                {openArvores && (
                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                        {resultCategories.map(item => {
                                            const categoryDetails = JSON.parse(item.categoryDetails)
                                            if(categoryDetails.category === '2'){
                                                return(
                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                        <p className='font-bold text-white w-[200px]'>{item.title}</p>

                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                            <p className='font-bold text-blue-400 text-center'>{item.value}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}

                                        
                                    </div>
                                )}
                            </div>

                            <div className={`flex flex-col lg:w-[49%] bg-[#0a4303] pb-2 ${openBiomassa ? 'h-auto' : 'h-44'}`}>
                                <div className='flex items-center justify-between w-full p-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-bold text-[#ff9900] text-2xl'>Biomassa</h4>
                                        <p className='font-bold text-white text-2xl'>{resultBiomassa.toFixed(0)} Kg</p>
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
                                        <p className='font-bold text-white'>Mostrar Menos</p>
                                    ) : (
                                        <p className='font-bold text-white'>Mostrar Mais</p>
                                    )}
                                </div>

                                {openBiomassa && (
                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                        {resultCategories.map(item => {
                                            const categoryDetails = JSON.parse(item.categoryDetails);
                                            if(categoryDetails.insumoCategory === 'biomassa'){
                                                return(
                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                        <p className='font-bold text-white w-[200px]'>{item.title}</p>

                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                            <p className='font-bold text-blue-400 text-center'>{item.value} {categoryDetails.unity}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}

                                        <div className='flex w-full items-center justify-between'>
                                            <p className='font-bold text-white w-[200px]'>Resultado</p>

                                            <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                <p className='font-bold text-blue-400 text-center'>{resultBiomassa.toFixed(0)} Kg</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* REGENERAÇÃO */}

                        {/* DEGENERAÇÃO */}
                        <div className='flex items-center justify-center h-20 w-full bg-[#783E19] mt-10'>
                            <h3 className='font-bold text-white text-3xl'>Degeneração</h3>
                        </div>
                        <div className='flex flex-wrap mt-5 gap-4'>
                            <div className={`flex flex-col lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosQuimicos ? 'h-auto' : 'h-44'}`}>
                                <div className='flex items-center justify-between w-full p-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-bold text-[#ff9900] text-2xl'>Insumos Químicos</h4>
                                        <p className='font-bold text-white text-2xl'>{quantInsumosQuimicos}</p>
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
                                        <p className='font-bold text-white'>Mostrar Menos</p>
                                    ) : (
                                        <p className='font-bold text-white'>Mostrar Mais</p>
                                    )}
                                </div>

                                {openInsumosQuimicos && (
                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                        {resultCategories.map(item => {
                                            const categoryDetails = JSON.parse(item.categoryDetails);
                                            if(categoryDetails.insumoCategory === 'insumo-quimico'){
                                                return(
                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                        <p className='font-bold text-white w-[200px]'>{item.title}</p>

                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                            <p className='font-bold text-blue-400 text-center'>{item.value} {categoryDetails.unity}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className={`flex flex-col lg:w-[49%] bg-[#0a4303] pb-2 ${openInsumosBiologicos ? 'h-auto' : 'h-44'}`}>
                                <div className='flex items-center justify-between w-full p-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-bold text-[#ff9900] text-2xl'>Insumos Biológicos</h4>
                                        <p className='font-bold text-white text-2xl'>{quantInsumosBiologicos}</p>
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
                                        <p className='font-bold text-white'>Mostrar Menos</p>
                                    ) : (
                                        <p className='font-bold text-white'>Mostrar Mais</p>
                                    )}
                                </div>

                                {openInsumosBiologicos && (
                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                        {resultCategories.map(item => {
                                            const categoryDetails = JSON.parse(item.categoryDetails);
                                            if(categoryDetails.insumoCategory === 'insumo-biologico'){
                                                return(
                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                        <p className='font-bold text-white w-[200px]'>{item.title}</p>

                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                            <p className='font-bold text-blue-400 text-center'>{item.value} {categoryDetails.unity}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className={`flex flex-col lg:w-[49%] bg-[#0a4303] pb-2 ${openRecursosExternos ? 'h-auto' : 'h-44'}`}>
                                <div className='flex items-center justify-between w-full p-3'>
                                    <div className='flex flex-col gap-2'>
                                        <h4 className='font-bold text-[#ff9900] text-2xl'>Recursos Externos</h4>
                                        <p className='font-bold text-white text-2xl'>{quantRecursosExternos}</p>
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
                                        <p className='font-bold text-white'>Mostrar Menos</p>
                                    ) : (
                                        <p className='font-bold text-white'>Mostrar Mais</p>
                                    )}
                                </div>

                                {openRecursosExternos && (
                                    <div className='flex flex-col mx-2 mt-1 bg-[#0D5305] p-3 gap-5'>
                                        {resultCategories.map(item => {
                                            const categoryDetails = JSON.parse(item.categoryDetails);
                                            if(categoryDetails.insumoCategory === 'recurso-externo'){
                                                return(
                                                    <div className='flex w-full items-center justify-between' key={item.categoryId}>
                                                        <p className='font-bold text-white w-[200px]'>{item.title}</p>

                                                        <div className='w-24 py-1 border-2 border-[#ff9900] rounded-md'>
                                                            <p className='font-bold text-blue-400 text-center'>{item.value} {categoryDetails.unity}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })} 
                                    </div>
                                )}
                            </div>
                        </div>

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

                            <p className='font-bold text-white text-4xl'>CARBONO</p>

                            <div className='flex flex-col items-end lg:w-28'>
                                <img
                                    src={require('../../assets/co2.png')}
                                    className='w-[55px] h-[40px] object-contain'
                                />
                                <p className='font-bold text-white text-base flex items-end'>
                                    {resultIndices?.carbon} kg
                                </p>
                            </div>
                        </div>
                        
                        {carbonOpen && (
                            <div className='p-2 w-full flex flex-col'>
                                <p className='text-white text-center'>
                                    Classificação na categoria:
                                    <span className='font-bold text-[#ff9900]'>
                                        {isas[0].isaIndex === '0' && ' Regenerative 3'}
                                        {isas[0].isaIndex === '1' && ' Regenerative 2'}
                                        {isas[0].isaIndex === '2' && ' Regenerative 1'}
                                        {isas[0].isaIndex === '3' && ' Neutro'}
                                        {isas[0].isaIndex === '4' && ' Not Regenerative 1'}
                                        {isas[0].isaIndex === '5' && ' Not Regenerative 2'}
                                        {isas[0].isaIndex === '6' && ' Not Regenerative 3'}
                                    </span> 
                                </p>
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div className='lg:w-[400px]'>
                                        <p className='font-bold text-white'>Degeneração</p>
                                        
                                            {resultCategories.length > 0 && (
                                                <div className="flex flex-col w-full">
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
                                        <div className='lg:w-[400px]'>
                                            <p className='font-bold text-white'>Regeneração</p>
                                            
                                            {resultCategories.length > 0 && (
                                                <div className="flex flex-col w-full">
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
                                            <p className="font-bold text-[#ff9900]">¹Cobertura de solo:</p>
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <a  
                                        target='_blank'
                                        href={`https://ipfs.io/ipfs/${isas[0]?.report}`}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</a>

                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                        onClick={() => handleDownloadPDF(isas[0]?.report, `Carbon Report - Inspection ${data.id}`)}
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

                            <p className='font-bold text-white text-4xl'>ÁGUA</p>

                            <div className='flex flex-col items-end lg:w-28'>
                                <img
                                    src={require('../../assets/agua.png')}
                                    className='w-[40px] h-[40px] object-contain'
                                />
                                <p className='font-bold text-white text-lg flex items-end'>
                                    {resultIndices?.agua} m³
                                </p>
                            </div>
                        </div>
                        
                        {aguaOpen && (
                            <div className='p-2 w-full flex flex-col'>
                                <p className='text-white text-center'>
                                    Classificação na categoria:
                                    <span className='font-bold text-[#ff9900]'>
                                        {isas[2].isaIndex === '0' && ' Regenerative 3'}
                                        {isas[2].isaIndex === '1' && ' Regenerative 2'}
                                        {isas[2].isaIndex === '2' && ' Regenerative 1'}
                                        {isas[2].isaIndex === '3' && ' Neutro'}
                                        {isas[2].isaIndex === '4' && ' Not Regenerative 1'}
                                        {isas[2].isaIndex === '5' && ' Not Regenerative 2'}
                                        {isas[2].isaIndex === '6' && ' Not Regenerative 3'}
                                    </span> 
                                </p>
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                            {resultCategories.length > 0 && (
                                                <div className="flex flex-col w-full">
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
                                        <div className="flex flex-col lg:w-[450px]">
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <a  
                                        target='_blank'
                                        href={`https://ipfs.io/ipfs/${isas[2]?.report}`}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</a>

                                    <button
                                        onClick={() => handleDownloadPDF(isas[2]?.report, `Water Report - Inspection ${data.id}`)}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
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

                            <p className='font-bold text-white text-4xl'>SOLO</p>

                            <div className='flex flex-col items-end lg:w-28'>
                                <img
                                    src={require('../../assets/solo.png')}
                                    className='w-[40px] h-[40px] object-contain'
                                />
                                <p className='font-bold text-white text-lg flex items-end'>
                                    {resultIndices?.solo} m²
                                </p>
                            </div>
                        </div>
                        
                        {soloOpen && (
                            <div className='p-2 w-full flex flex-col'>
                                <p className='text-white text-center'>
                                    Classificação na categoria:
                                    <span className='font-bold text-[#ff9900]'>
                                        {isas[3].isaIndex === '0' && ' Regenerative 3'}
                                        {isas[3].isaIndex === '1' && ' Regenerative 2'}
                                        {isas[3].isaIndex === '2' && ' Regenerative 1'}
                                        {isas[3].isaIndex === '3' && ' Neutro'}
                                        {isas[3].isaIndex === '4' && ' Not Regenerative 1'}
                                        {isas[3].isaIndex === '5' && ' Not Regenerative 2'}
                                        {isas[3].isaIndex === '6' && ' Not Regenerative 3'}
                                    </span> 
                                </p>
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                            {resultCategories.length > 0 && (
                                                <div className="flex flex-col w-full">
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
                                        <div className="flex flex-col lg:w-[450px]">
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <a  
                                        target='_blank'
                                        href={`https://ipfs.io/ipfs/${isas[3]?.report}`}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</a>

                                    <button
                                        onClick={() => handleDownloadPDF(isas[3]?.report, `Solo Report - Inspection ${data.id}`)}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
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

                            <p className='font-bold text-white text-4xl'>BIODIVERSIDADE</p>

                            <div className='flex flex-col items-end lg:w-28'>
                                <img
                                    src={require('../../assets/bio.png')}
                                    className='w-[40px] h-[40px] object-contain'
                                />
                                <p className='font-bold text-white text-lg flex items-end'>
                                    {resultIndices?.bio} uni
                                </p>
                            </div>
                        </div>
                        
                        {bioOpen && (
                            <div className='p-2 w-full flex flex-col'>
                                <p className='text-white text-center'>
                                    Classificação na categoria:
                                    <span className='font-bold text-[#ff9900]'>
                                        {isas[1].isaIndex === '0' && ' Regenerative 3'}
                                        {isas[1].isaIndex === '1' && ' Regenerative 2'}
                                        {isas[1].isaIndex === '2' && ' Regenerative 1'}
                                        {isas[1].isaIndex === '3' && ' Neutro'}
                                        {isas[1].isaIndex === '4' && ' Not Regenerative 1'}
                                        {isas[1].isaIndex === '5' && ' Not Regenerative 2'}
                                        {isas[1].isaIndex === '6' && ' Not Regenerative 3'}
                                    </span> 
                                </p>
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                        <div className="flex flex-col lg:w-[450px]">
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
                                    
                                    <div className="flex flex-col">
                                        <div>
                                            <p className='font-bold text-white'>Regeneração</p>
                                            <div className="flex flex-col lg:w-[450px]">
                                                {resultCategories.length > 0 && (
                                                    <div className="flex flex-col w-full">
                                                        {resultCategories.map(item => (
                                                            <IndiceCalculoItem
                                                                key={item.id}
                                                                data={item}
                                                                type='regeneration'
                                                                indice='bio'
                                                            />
                                                        ))}
                                                        
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <a  
                                        target='_blank'
                                        href={`https://ipfs.io/ipfs/${isas[1]?.report}`}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</a>

                                    <button
                                        onClick={() => handleDownloadPDF(isas[1]?.report, `Biodiversity Report - Inspection ${data.id}`)}
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >Download PDF</button>
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Bio ------------------------------------------------------ */}
                    </div>

                </div>
            )}
        </div>
    )}
}