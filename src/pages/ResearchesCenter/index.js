import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../services/api";
import { ResearcheItem } from "./components/ResearcheItem";
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { useMainContext } from '../../hooks/useMainContext';
import * as Dialog from '@radix-ui/react-dialog';
import { PublishResearch } from "../../services/researchersService";
import { save } from "../../config/infura";
import { LoadingTransaction } from "../../components/LoadingTransaction";
import {TopBar} from '../../components/TopBar';
import { CategorieItem } from "./components/CategorieItem";

export function ResearchesCenter() {
    const { userData, walletConnected, connectionType } = useMainContext();
    const [tabSelected, setTabSelected] = useState('researches');
    const [loading, setLoading] = useState(false);
    const [loadingPublish, setLoadingPublish] = useState(false);
    const [researches, setResearches] = useState([]);
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [pdf, setPdf] = useState(null);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (tabSelected === 'researches') {
            getResearches();
        }
        if (tabSelected === 'isa') getIndices();
        if (tabSelected === 'calculator-itens') getCalculatorItens();
    }, [tabSelected]);

    async function getResearches() {
        setLoading(true);
        const response = await api.get('/web3/researches');
        setResearches(response.data.researches);
        setLoading(false);
    }

    async function getIndices() {
        setLoading(true);
        const response = await api.get('/isa-categories');
        setCategories(response.data.categories);
        setLoading(false);
    }

    async function getCalculatorItens() {
        setLoading(true);
        const response = await api.get('calculator/items')
        setItems(response.data.items)
        setLoading(false);
    }

    async function handlePublish() {
        if(loadingPublish){
            return;
        }

        if(!title.trim()){
            toast.error('Digite um título!');
            return;
        }

        if(!thesis.trim()){
            toast.error('Digite uma tese!');
            return;
        }

        if(!pdf){
            toast.error('É necessário anexar um arquivo da pesquisa!');
            return;
        }

        setLoadingPublish(true);
        const response = await save(pdf);
        
        if(connectionType === 'provider'){
            publishBlockchain(response);
        }else{

        }
    }

    function publishBlockchain(hash){
        setModalTransaction(true);
        setLoadingTransaction(true);
        PublishResearch(walletConnected, title, thesis, hash)
        .then(async(res) => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            });

            if(res.type === 'success'){
                api.post('/publication/new', {
                    userId: userData?.id,
                    type: 'publish-researche',
                    origin: 'platform',
                    additionalData: JSON.stringify({
                        userData,
                        title,
                        thesis, 
                        file: hash
                    }),
                });
            }
            setLoadingPublish(false);
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingPublish(false);
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Only allowed to researchers")){
                setLogTransaction({
                    type: 'error',
                    message: "Only allowed to researchers!",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full pt-32 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    <p className="font-bold text-white text-xl">Centro de pesquisas</p>

                    <div className="flex items-center gap-8 mt-2">
                        <button
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'researches' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('researches')}
                        >
                            Pesquisas
                        </button>

                        <button
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'isa' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('isa')}
                        >
                            Índice de sustentabilidade
                        </button>

                        {userData?.userType === 3 && (
                            <button
                                className={`font-bold py-1 border-b-2 ${tabSelected === 'publish' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                onClick={() => setTabSelected('publish')}
                            >
                                Publicar pesquisa
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <ActivityIndicator size={50} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-5">
                            {tabSelected === 'researches' && (
                                <>
                                    {researches.map(item => (
                                        <ResearcheItem data={item} />
                                    ))}
                                </>
                            )}

                            {tabSelected === 'publish' && (
                                <>
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
                                            aria-multiline={true}
                                        />

                                        <button
                                            className="py-2 w-full rounded-md bg-blue-500 text-white font-bold mt-5"
                                            onClick={handlePublish}
                                        >
                                            {loadingPublish ? (
                                                <ActivityIndicator size={25}/>
                                            ) : (
                                                'Publicar pesquisa'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                            {tabSelected === 'isa' && (
                                <>
                                    {categories.map(item => (
                                        <CategorieItem data={item} />
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Dialog.Root
                open={modalTransaction}
                onOpenChange={(open) => {
                    if (!loadingTransaction) {
                        setModalTransaction(open);
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer/>
        </div>
    )
}