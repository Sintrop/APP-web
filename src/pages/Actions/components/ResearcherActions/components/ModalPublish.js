import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import {FaChevronLeft} from 'react-icons/fa';
import { useTranslation } from "react-i18next";

export function ModalPublish({close, loadingPublish, publish, publishType}) {
    const {t} = useTranslation();
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [pdf, setPdf] = useState(null);

    function handlePublish(){
        if(!title.trim()){
            toast.error(t('digiteTitulo'));
            return;
        }

        if(!thesis.trim()){
            toast.error(t('digiteTese'));
            return;
        }

        if(!pdf){
            toast.error(t('AnexePDF'));
            return;
        }

        if(publishType === 'calculator'){
            publish(`Sugestão Calculadora - ${title}`, thesis, pdf);
            return;
        }

        if(publishType === 'method'){
            publish(`Sugestão Novo Método - ${title}`, thesis, pdf);
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
                        {publishType === 'normal' && t('publicarPesquisa')}
                        {publishType === 'calculator' && t('sugerirItemCalc')}
                        {publishType === 'method' && t('sugerirMetodo')}
                    </p>
                    <div className="w-10"/>
                </div>
                <div className="p-2 rounded-md flex flex-col bg-[#0a4303] w-full">
                    <label className="text-white font-bold">{t('titulo')}</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('digiteAqui')}
                        className="w-full rounded-md px-3 text-white bg-green-950 h-10"
                    />

                    <label className="text-white font-bold mt-3">{t('tese')}</label>
                    <input
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                        placeholder={t('digiteAqui')}
                        className="w-full rounded-md px-3 text-white bg-green-950 h-10"
                    />

                    <label className="text-white font-bold mt-3">{t('arquivoPDF')}</label>
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
                            t('publicarPesquisa')
                        )}
                    </button>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}