import React, {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import {format} from 'date-fns';
import { api } from '../../services/api';
import { IndiceValueItem } from '../../components/IndiceValueItem';
import { IndiceCalculoItem } from '../../components/IndiceCalculoItem';

export function InspectionItemResult({data}){
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [carbonOpen, setCarbonOpen] = useState(false);
    const [aguaOpen, setAguaOpen] = useState(false);
    const [soloOpen, setSoloOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [resultIndices, setResultIndices] = useState({});
    const [inspectionDataApi, setInspectionDataApi] = useState({});
    const [resultCategories, setResultCategories] = useState([]);
    const [resultBiodiversity, setResultBiodiversity] = useState([]);
    const [resultBiomassa, setResultBiomassa] = useState(0);

    useEffect(() => {
        getResultIndices();
    },[])

    async function getResultIndices() {
        const response = await api.get(`/inspection/${data.id}`)
        setResultIndices(JSON.parse(response.data?.inspection?.resultIdices))
        setResultCategories(JSON.parse(response.data?.inspection?.resultCategories))

        const resCategories = JSON.parse(response.data?.inspection?.resultCategories);
        if(response.data?.inspection?.biodiversityIndice){
            const resBiodiversity = JSON.parse(response.data?.inspection?.biodiversityIndice);
            setResultBiodiversity(resBiodiversity);
        }

        const categoryCoberturaSolo = resCategories.filter(item => item.categoryId === '13')
        const soloRegenerado = Number(categoryCoberturaSolo[0]?.value)
        const biomassa1 = resCategories.filter(item => item.categoryId === '14')
        const biomassa2 = resCategories.filter(item => item.categoryId === '15')
        const calculoBiomassa = ((Number(biomassa1[0]?.value) + Number(biomassa2[0]?.value)) / 2) * soloRegenerado
        const resultIndiceBiomassa = calculoBiomassa * JSON.parse(biomassa1[0].categoryDetails).carbonValue;
        setResultBiomassa(resultIndiceBiomassa);
        setInspectionDataApi(response.data?.inspection);
    }

    return(
        <div className='flex flex-col w-full mb-5'>
            <div 
                className='flex items-center justify-between w-full h-20 bg-gradient-to-r from-[#FFD875] to-[#461D03] p-3 rounded-t-md cursor-pointer'
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
                    <div className='flex items-center gap-10'>
                        <div className='flex flex-col items-center'>
                            <img
                                src={require('../../assets/co2.png')}
                                className='w-[55px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.carbon} kg
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <img
                                src={require('../../assets/solo.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.solo} m²
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <img
                                src={require('../../assets/agua.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.agua} m³
                            </p>
                        </div>

                        <div className='flex flex-col items-center'>
                            <img
                                src={require('../../assets/bio.png')}
                                className='w-[40px] h-[40px] object-contain'
                            />
                            <p className='font-bold text-white text-lg flex items-end'>
                                {resultIndices?.bio} uni
                            </p>
                        </div>
                    </div>
                    
                    <p className='font-bold text-black'>{t('Activist')} {t('Wallet')}:</p>
                    <p className=' text-black'>{data.acceptedBy}</p>
                    <p className='font-bold text-black mt-2'>{t('Created At')}: <span className='font-normal'>{data.createdAtTimestamp}</span></p>
                    <p className='font-bold text-black'>{t('Accepted At')}: <span className='font-normal'>{data.acceptedAtTimestamp}</span></p>
                    <p className='font-bold text-black'>{t('Inspected At')}: <span className='font-normal'>{data.inspectedAtTimestamp}</span></p>

                    <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                        <div>
                            <p className='font-bold text-white'>Degeneração</p>
                            <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                <div className="flex items-center w-full bg-[#A75722]">
                                    <div className="w-[60%] px-3 py-2">
                                        <p className='font-bold text-white'>Insumos</p>
                                    </div>
                                    <div className="w-[40%] px-3 py-2">
                                        <p className='font-bold text-white'>Valor</p>
                                    </div>
                                </div>
                                {resultCategories.length > 0 && (
                                    <div className="flex flex-col w-full">
                                        {resultCategories.map(item => (
                                            <IndiceValueItem
                                                key={item.id}
                                                data={item}
                                                type='degeneration'
                                            />
                                        ))}
                                        
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className='font-bold text-white'>Regeneração</p>
                            <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                <div className="flex items-center w-full bg-green-950">
                                    <div className="w-[60%] px-3 py-2">
                                        <p className='font-bold text-white'>Insumos</p>
                                    </div>
                                    <div className="w-[40%] px-3 py-2">
                                        <p className='font-bold text-white'>Valor</p>
                                    </div>
                                </div>
                                {resultCategories.length > 0 && (
                                    <div className="flex flex-col w-full">
                                        {resultCategories.map(item => (
                                            <IndiceValueItem
                                                key={item.id}
                                                data={item}
                                                type='regeneration'
                                            />
                                        ))}
                                        
                                    </div>
                                )}
                            </div>
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
                                            <p className="font-bold text-[#ff9900]">¹Registro de Biomassa:</p>
                                            <div className="flex items-center">
                                                <p className="font-bold text-white mx-1">=</p>
                                                <p className="font-bold text-white mx-2 border-b-4 border-green-400">{resultBiomassa}</p>
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
                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</button>

                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
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
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                        <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                            <div className="flex items-center w-full bg-[#A75722]">
                                                <div className="w-[40%] px-3 py-2">
                                                    <p className='font-bold text-white'>Insumos</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Impacto</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Valor</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Resultado</p>
                                                </div>
                                            </div>
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
                                    </div>

                                    <div>
                                        <p className='font-bold text-white'>Regeneração</p>
                                        <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                            <div className="flex items-center w-full bg-green-950">
                                                <div className="w-[40%] px-3 py-2">
                                                    <p className='font-bold text-white'>Insumos</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Impacto</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Valor</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Resultado</p>
                                                </div>
                                            </div>
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</button>

                                    <button
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
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                        <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                            <div className="flex items-center w-full bg-[#A75722]">
                                                <div className="w-[40%] px-3 py-2">
                                                    <p className='font-bold text-white'>Insumos</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Impacto</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Valor</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Resultado</p>
                                                </div>
                                            </div>
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
                                    </div>

                                    <div>
                                        <p className='font-bold text-white'>Regeneração</p>
                                        <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                            <div className="flex items-center w-full bg-green-950">
                                                <div className="w-[40%] px-3 py-2">
                                                    <p className='font-bold text-white'>Insumos</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Impacto</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Valor</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Resultado</p>
                                                </div>
                                            </div>
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

                                <div className='flex items-center mt-5 gap-2'>
                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</button>

                                    <button
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
                                <div className='flex flex-col lg:flex-row mt-5 flex-wrap gap-5'>
                                    <div>
                                        <p className='font-bold text-white'>Degeneração</p>
                                        <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                            <div className="flex items-center w-full bg-[#A75722]">
                                                <div className="w-[40%] px-3 py-2">
                                                    <p className='font-bold text-white'>Insumos</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Impacto</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Valor</p>
                                                </div>
                                                <div className="w-[20%] px-3 py-2">
                                                    <p className='font-bold text-white'>Resultado</p>
                                                </div>
                                            </div>
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
                                            <div className="flex flex-col border-2 border-[#3e9ef5] lg:w-[450px]">
                                                <div className="flex items-center w-full bg-green-950">
                                                    <div className="w-[40%] px-3 py-2">
                                                        <p className='font-bold text-white'>Insumos</p>
                                                    </div>
                                                    <div className="w-[20%] px-3 py-2">
                                                        <p className='font-bold text-white'>Impacto</p>
                                                    </div>
                                                    <div className="w-[20%] px-3 py-2">
                                                        <p className='font-bold text-white'>Valor</p>
                                                    </div>
                                                    <div className="w-[20%] px-3 py-2">
                                                        <p className='font-bold text-white'>Resultado</p>
                                                    </div>
                                                </div>
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
                                        <div className="flex border-2 rounded-sm border-[#3e9ef5] bg-[#0a4303] p-3 mt-3">
                                            <p className="font-bold text-white">Registro de Biodiversidade: {resultBiodiversity.length} uni</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center mt-5 gap-2'>
                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >View PDF</button>

                                    <button
                                        className='px-5 py-2 font-bold bg-[#ff9900] rounded-md'
                                    >Download PDF</button>
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Bio ------------------------------------------------------ */}
                </div>
            )}
        </div>
    )
}