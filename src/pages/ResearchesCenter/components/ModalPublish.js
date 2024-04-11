import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import {FaChevronLeft} from 'react-icons/fa';

export function ModalPublish({close, loadingPublish, publish, publishType}) {
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [pdf, setPdf] = useState(null);

    function handlePublish(){
        if(!title.trim()){
            toast.error('Digite um título!');
            return;
        }

        if(!thesis.trim()){
            toast.error('DIgite uma tese!');
            return;
        }

        if(!pdf){
            toast.error('Anexe um PDF!');
            return;
        }

        if(publishType === 'calculator'){
            publish(`Sugestão Calculadora - ${title}`, thesis, pdf);
            return;
        }

        publish(title, thesis, pdf);
    }

    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[500px] lg:h-[350px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <div className="flex items-center justify-between w-full mb-3">
                    <button onClick={close}>
                        <FaChevronLeft size={20} color='white'/>
                    </button>
                    <p className="font-bold text-white text-center">
                        {publishType === 'normal' && 'Publicar pesquisa'}
                        {publishType === 'calculator' && 'Sugerir item calculadora'}
                        {publishType === 'metodologia' && 'Sugerir nova metodologia'}
                    </p>
                    <div className="w-10"/>
                </div>
                <div className="p-2 rounded-md flex flex-col bg-[#0a4303] w-full">
                    <label className="text-white font-bold">Título</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Digite aqui"
                        className="w-full rounded-md px-3 text-white bg-green-950 h-10"
                    />

                    <label className="text-white font-bold mt-3">Tese</label>
                    <input
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                        placeholder="Digite aqui"
                        className="w-full rounded-md px-3 text-white bg-green-950 h-10"
                    />

                    <label className="text-white font-bold mt-3">Arquivo PDF</label>
                    <input
                        className='text-sm text-white'
                        type='file'
                        accept="application/pdf"
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
                    />

                    <button
                        className="py-2 w-full rounded-md bg-blue-500 text-white font-bold mt-5"
                        onClick={handlePublish}
                    >
                        {loadingPublish ? (
                            <ActivityIndicator size={25} />
                        ) : (
                            'Publicar pesquisa'
                        )}
                    </button>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}