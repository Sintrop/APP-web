import React, { useState } from 'react';
import { save, get } from '../../config/infura'
import Loading from '../../components/Loading';
import { LoadingTransaction } from '../../components/LoadingTransaction';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '../../services/api';
import { AddContribution } from '../../services/developersService';
import { useParams } from 'react-router';

export function SendReportDev({ close, walletAddress, userData }) {
    const [loading, setLoading] = useState(false);
    const [pathPDF, setPathPDF] = useState('');
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({}); 

    async function getPath(file) {
        setLoading(true);
        const path = await save(file);
        setPathPDF(path);
        setLoading(false);
    }

    async function handleSend() {
        if(pathPDF === '') return;

        setModalTransaction(true);
        setLoadingTransaction(true);
        AddContribution(walletAddress, pathPDF)
        .then(async (res) => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            });
            
            if(res.type === 'success'){
                await api.post('/publication/new', {
                    userId: userData?.id,
                    type: 'dev-report',
                    origin: 'platform',
                    additionalData: JSON.stringify({
                        report: pathPDF,
                        userData
                    }),
                });
            }
            setLoadingTransaction(false);
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Request OPEN or ACCEPTED")){
                setLogTransaction({
                    type: 'error',
                    message: 'Request OPEN or ACCEPTED',
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
        <div
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 m-auto"
        >
            <div className="flex flex-col items-center justify-between p-5 w-[280px] h-[250px] bg-[#222831] rounded-lg">
                <h3 className='font-bold text-white text-center text-lg'>Relatório de contribuição</h3>

                <div className='w-full'>
                    <label className='text-white'>Escolha um arquivo:</label>
                    <input
                        className='text-white w-full overflow-hidden'
                        type='file'
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                                const arrayBuffer = reader.result
                                const file = new Uint8Array(arrayBuffer);
                                getPath(file);
                            };
                        }}
                        accept='application/pdf'
                    />
                </div>

                <div className='flex items-center justify-between w-full'>
                    <button
                        className='font-bold text-white'
                        onClick={() => close(false)}
                    >
                        Voltar
                    </button>

                    <button
                        className='font-bold text-white px-3 py-2 bg-[#2c96ff] rounded-lg'
                        onClick={handleSend}
                    >
                        Enviar
                    </button>
                </div>
            </div>

            {loading && <Loading />}

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if(!loadingTransaction){
                    setModalTransaction(open)
                    setLoading(false);
                    if(logTransaction.type === 'success'){
                        alert('Relatório enviado com sucesso!');
                        close();
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
        </div>
    )
}