import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './modalPublish.css';
import Loading from '../../../Loading';
import {LoadingTransaction} from '../../../LoadingTransaction';
import {PublishResearch} from '../../../../services/researchersService';
import {save} from '../../../../config/infura';

export function ModalPublish({walletAddress, close}){
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [thesis, setThesis] = useState('');
    const [file, setFile] = useState('');
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    function handlePublish(e){
        e.preventDefault();
        if(loading){
            return;
        }
        setModalTransaction(true);
        setLoadingTransaction(true);
        PublishResearch(walletAddress, title, thesis, file)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
        })
        .catch(err => {
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

    async function getPath(file){
        setLoading(true);
        const response = await save(file);
        setFile(response);
        setLoading(false);
    }

    return(
        <Dialog.Portal className='modal-publish__portal'>
            <Dialog.Overlay className='modal-publish__overlay'/>
            <Dialog.Content className='modal-publish__content'>
                <Dialog.Title className='modal-publish__title'>
                    Publish research
                </Dialog.Title>

                <form onSubmit={handlePublish} className='modal-publish__form'>
                    <label htmlFor='title' className='modal-publish__label'>Title of report:</label>
                    <input
                        className='modal-publish__input'
                        name='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title of research'
                        required
                    />

                    <label htmlFor='thesis' className='modal-publish__label'>Thesis:</label>
                    <textarea
                        style={{resize:'none', height: '100px'}}
                        className='modal-publish__input'
                        name='thesis'
                        type='text'
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                        placeholder='thesis'
                        required
                    />

                    <label htmlFor='pdf' className='modal-publish__label'>Upload PDF report:</label>
                    <input 
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
                    />
                </form>
                
                <div className='modal-publish__area-btn'>
                    <Dialog.Close
                        className='modal-publish__btn-cancel'
                    >
                        Cancel
                    </Dialog.Close>
                    <button
                        className='modal-publish__btn-report'
                        onClick={handlePublish}
                    >
                        Publish
                    </button>
                </div>

                <Dialog.Root 
                    open={modalTransaction} 
                    onOpenChange={(open) => {
                        if(!loadingTransaction){
                            setModalTransaction(open);
                            setTitle('');
                            setThesis('');
                            close();
                        }
                    }}
                >
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>

            </Dialog.Content>
                {loading && <Loading/>}
        </Dialog.Portal>
    )
}