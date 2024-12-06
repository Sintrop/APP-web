import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { toast } from "react-toastify";
import { save } from "../../../../../config/infura";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";

interface Props{
    close: () => void;
}
export function PublishResearche({close}: Props) {
    const {t} = useTranslation();
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [pdf, setPdf] = useState('');
    const [loadingPublish, setLoadingPublish] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);

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

        setShowModalWhereExecuteTransaction(true)
    }

    function successPublish(type: string){
        if(type === 'blockchain'){
            toast.success('Pesquisa publicada com sucesso!');
            close();
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label className="text-white font-bold">{t('titulo')}</label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('digiteAqui') as string}
                className="w-full rounded-md px-3 text-white bg-container-secondary h-10"
            />

            <label className="text-white font-bold mt-3">{t('tese')}</label>
            <input
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder={t('digiteAqui') as string}
                className="w-full rounded-md px-3 text-white bg-container-secondary h-10"
            />

            <label className="text-white font-bold mt-3">{t('arquivoPDF')}</label>
            <input
                className='text-sm text-white'
                type='file'
                accept="application/pdf"
                onChange={(e) => {
                    const file = e.target.files;
                    if(file){
                        const reader = new window.FileReader();
                        reader.readAsArrayBuffer(file[0]);
                        reader.onload = async () => {
                            setLoadingPublish(true);
                            const arrayBuffer = reader.result
                            const file = new Uint8Array(arrayBuffer as ArrayBuffer);
                            const hash = await save(file)
                            setPdf(hash as string);
                            setLoadingPublish(false);
                        };
                    }
                }}
            />

            <button
                className="py-2 w-full rounded-md bg-blue-500 text-white font-bold mt-5"
                onClick={handlePublish}
                disabled={loadingPublish}
            >
                {loadingPublish ? (
                    <ActivityIndicator size={25} />
                ) : (
                    t('publicarPesquisa')
                )}
            </button>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successPublish}
                    transactionType="publishResearche"
                    additionalData={JSON.stringify({
                        title,
                        thesis,
                        hashPdf: pdf
                    })}
                />
            )}
        </div>
    )
}