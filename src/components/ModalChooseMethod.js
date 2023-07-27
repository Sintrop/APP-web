import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Warning} from '../components/Warning'; 
import {save} from '../config/infura';
import Loading from './Loading';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';

export function ModalChooseMethod({finishInspection, finishManual}){
    const [step, setStep] = useState(1);
    const [method, setMethod] = useState('');
    const [loading, setLoading] = useState(false);

    const [carbon, setCarbon] = useState('');
    const [water, setWater] = useState('');
    const [bio, setBio] = useState('');
    const [soil, setSoil] = useState('');
    const [carbonPdf, setCarbonPdf] = useState('');
    const [waterPdf, setWaterPdf] = useState('');
    const [bioPdf, setBioPdf] = useState('');
    const [soilPdf, setSoilPdf] = useState('');

    function validateData(){
        if(!carbon.trim() || !water.trim() || !bio.trim() || !soil.trim() || !carbonPdf.trim() || !waterPdf.trim() || !bioPdf.trim() || !soilPdf.trim()){
            toast.error('Preencha todos os dados!')
            return;
        }

        const resultIndices = {
            carbon,
            agua: water,
            bio,
            solo: soil
        }

        const data = {
            resultIndices,
            pdfBioHash: bioPdf,
            pdfAguaHash: waterPdf,
            pdfCarbonHash: carbonPdf,
            pdfSoloHash: soilPdf
        }

        finishManual(data, 'manual');
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-green-950 rounded-md m-auto inset-0 border-2 border-[#ff9900]'>
                <div className='flex items-center w-full justify-between'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>Método de inspeção</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>

                {step === 1 && (
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-white text-2xl text-center">Qual método gostaria de usar na inspeção?</h1>

                        <div className="flex mt-10 flex-wrap gap-5">
                            <div className="flex flex-col items-center gap- rounded-md border-2 p-2 w-[200px] bg-[#0a4303]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={require('../assets/token.png')}
                                        className="w-[80px] h-[80px] object-contain border-2 border-white rounded-full"
                                    />

                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-white text-center">Método Phoenix</p>
                                        <button
                                            onClick={() => {
                                                setMethod('phoenix')
                                                setStep(2)
                                            }}
                                            className='px-2 py-1 border-2 rounded-md border-[#ff9900] font-bold text-[#ff9900] '
                                        >
                                            Escolher
                                        </button>
                                    </div>
                                </div>

                                <div className="flex w-full items-center justify-center bg-green-700 rounded-md mt-2">
                                    <p className="font-bold text-white">Recomendado</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 rounded-md border-2 p-2 w-[200px] bg-[#0a4303]">
                                <img
                                    src={require('../assets/token.png')}
                                    className="w-[80px] h-[80px] object-contain border-2 border-white rounded-full"
                                />

                                <div className="flex flex-col gap-1">
                                    <p className="font-bold text-white text-center">Método Manual</p>
                                    <button
                                        onClick={() => {
                                            setMethod('manual')
                                            setStep(2)
                                        }}
                                        className='px-2 py-1 border-2 rounded-md border-[#ff9900] font-bold text-[#ff9900] '
                                    >
                                        Escolher
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-[#ff9900] text-2xl text-center">Instruções</h1>

                        {method === 'phoenix' ? (
                            <div className="flex flex-col lg:w-[320px] gap-2 mt-5">
                                <p className='text-white'>1º | Baixe nosso app no seu celular;</p>
                                <p className='text-white'>2º | Faça login com sua carteira e senha;</p>
                                <p className='text-white'>3º | Localize a inspeção e salve em seu dispositivo;</p>
                                <p className='text-white'>4º | Vá até a propriedade do produtor, preencha todas as informações e finalize a inspeção no celular;</p>
                                <p className='text-white'>5º | Em um local com internet, salve as informações do seu celular em nosso servidor;</p>
                                <p className='text-white'>6º | Volte aqui na plataforma e finalize a inspeção, clicando no botão abaixo:</p>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full gap-2 mt-5">
                                <Warning
                                    width={490}
                                    message='O método manual só é indicado para pesquisadores'
                                />
                                <div className='flex justify-center w-full'>
                                    <p 
                                        className="border-b-2 border-blue-500 text-blue-500 cursor-pointer text-center"
                                        onClick={() => setMethod('phoenix')}
                                    >
                                        Clique aqui para selecionar o método Sintrop
                                    </p>
                                </div>

                                <p className="text-justify text-white">1º | Baixe o modelo do documento, para preenchimento dos dados. É necessário justificar todas as respostas.</p>

                                <button className='px-2 py-1 bg-blue-600 text-white font-bold rounded-md'>
                                    Baixar modelo
                                </button>

                                <p className="text-justify text-white">2º | Registre todas as informações no documento, e na etapa seguinte registre os dados encontrados, aqui na plataforma.</p>
                                <p className="mt-2 text-justify text-white">Nota: Todos os documentos deverão ser salvos em formato PDF, para que possam ser salvos na plataforma</p>
                            </div>
                        )}

                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-wrap w-full gap-2 mt-5">
                            <div className='flex flex-col w-[230px] border-2 p-2 rounded-md bg-[#0a4303]'>
                                <p className="font-bold text-[#ff9900] text-sm">Saldo de Co²:</p>
                                <input
                                    type='number'
                                    placeholder='Quantidade (Em kg)'
                                    value={carbon}
                                    onChange={(e) => setCarbon(e.target.value)}
                                    className='h-8 bg-green-950 rounded-md text-white px-1'
                                />

                                <p className="font-bold text-[#ff9900] text-sm">Anexe o PDF Report do carbono:</p>
                                <input 
                                    type='file' 
                                    accept='.pdf'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new window.FileReader();
                                        reader.readAsArrayBuffer(file);
                                        reader.onload = async () => {
                                            setLoading(true);
                                            const arrayBuffer = reader.result
                                            const file = new Uint8Array(arrayBuffer);
                                            const path = await save(file);
                                            setCarbonPdf(path)
                                            setLoading(false)
                                        };
                                    }}
                                />
                            </div>

                            <div className='flex flex-col w-[230px] border-2 p-2 rounded-md bg-[#0a4303]'>
                                <p className="font-bold text-[#ff9900] text-sm">Saldo de Água:</p>
                                <input
                                    type='number'
                                    placeholder='Quantidade (Em m²)'
                                    value={water}
                                    onChange={(e) => setWater(e.target.value)}
                                    className='h-8 bg-green-950 rounded-md text-white px-1'
                                />

                                <p className="font-bold text-[#ff9900] text-sm">Anexe o PDF Report da água:</p>
                                <input 
                                    type='file' 
                                    accept='.pdf'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new window.FileReader();
                                        reader.readAsArrayBuffer(file);
                                        reader.onload = async () => {
                                            setLoading(true);
                                            const arrayBuffer = reader.result
                                            const file = new Uint8Array(arrayBuffer);
                                            const path = await save(file);
                                            setWaterPdf(path)
                                            setLoading(false)
                                        };
                                    }}
                                />
                            </div>

                            <div className='flex flex-col w-[230px] border-2 p-2 rounded-md bg-[#0a4303]'>
                                <p className="font-bold text-[#ff9900] text-sm">Saldo de Biodiversidade:</p>
                                <input
                                    type='number'
                                    placeholder='Quantidade'
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className='h-8 bg-green-950 rounded-md text-white px-1'
                                />

                                <p className="font-bold text-[#ff9900] text-sm">Anexe o PDF Report da biodiversidade:</p>
                                <input 
                                    type='file' 
                                    accept='.pdf'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new window.FileReader();
                                        reader.readAsArrayBuffer(file);
                                        reader.onload = async () => {
                                            setLoading(true);
                                            const arrayBuffer = reader.result
                                            const file = new Uint8Array(arrayBuffer);
                                            const path = await save(file);
                                            setBioPdf(path)
                                            setLoading(false)
                                        };
                                    }}
                                />
                            </div>

                            <div className='flex flex-col w-[230px] border-2 p-2 rounded-md bg-[#0a4303]'>
                                <p className="font-bold text-[#ff9900] text-sm">Saldo de Solo:</p>
                                <input
                                    type='number'
                                    placeholder='Quantidade'
                                    value={soil}
                                    onChange={(e) => setSoil(e.target.value)}
                                    className='h-8 bg-green-950 rounded-md text-white px-1'
                                />

                                <p className="font-bold text-[#ff9900] text-sm">Anexe o PDF Report do solo:</p>
                                <input 
                                    type='file' 
                                    accept='.pdf'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new window.FileReader();
                                        reader.readAsArrayBuffer(file);
                                        reader.onload = async () => {
                                            setLoading(true);
                                            const arrayBuffer = reader.result
                                            const file = new Uint8Array(arrayBuffer);
                                            const path = await save(file);
                                            setSoilPdf(path)
                                            setLoading(false)
                                        };
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex items-center gap-3'>
                    {step !== 1 && (
                        <button 
                            onClick={() => {
                                if(step > 1){
                                    setStep(step - 1)
                                }
                            }}
                            className="px-4 py-2 font-bold text-white rounded-md bg-[#ff9900]"
                        >
                            Voltar
                        </button>
                    )}
                    {step > 1 && (
                        <button 
                            className="px-4 py-2 font-bold text-white rounded-md bg-[#ff9900]"
                            onClick={() => {
                                if(method === 'phoenix' && step === 2){
                                    finishInspection()
                                }
                                if(method === 'manual' && step === 2){
                                    setStep(3)
                                }
                                if(method === 'manual' && step === 3){
                                    validateData()
                                }
                            }}
                        >
                            {method === 'phoenix' && step === 2 && 'Finalizar inspeção'}
                            {method === 'manual' && step === 2 && 'Prosseguir'}
                            {method === 'manual' && step === 3 && 'Finalizar inspeção'}
                        </button>
                    )}
                </div>


                <ToastContainer
                    position='top-center'
                    />
            </Dialog.Content>
                    {loading && (
                        <Loading/>
                    )}
        </Dialog.Portal>
    )
}