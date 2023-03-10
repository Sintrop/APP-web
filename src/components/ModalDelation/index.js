import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import './modalDelation.css';
import * as Dialog from '@radix-ui/react-dialog';
import {save, get} from '../../config/infura';
import Loading from '../Loading';
import {AddDelation, GetDelation} from '../../services/userService';
import { LoadingTransaction } from '../LoadingTransaction';
import { ToastContainer, toast} from 'react-toastify';
import {api} from '../../services/api';
import { useMainContext } from '../../hooks/useMainContext';
import { useTranslation } from 'react-i18next';

export default function ModalDelation({close, anonymousReport}){
    const {t} = useTranslation();
    const {walletConnected} = useMainContext();
    const navigate = useNavigate();
    const {walletSelected} = useParams();
    const [title, setTitle] = useState('');
    const [testemony, setTestemony] = useState('');
    const [photo, setPhoto] = useState('');
    const [base64, setBase64] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    async function handleReport(e){
        e.preventDefault();
        if(anonymousReport){
            reportAnonymous();
        }else{
            reportBlockchain();
        }
    }

    async function reportAnonymous(){
        if(title === '' || testemony === '' || photo === ''){
            return;
        }
        try{
            setLoading(true);
            await api.post('/delations', {
                reportedUser: walletSelected.toUpperCase(),
                title: title,
                testimony: testemony,
                proofPhoto: photo
            })
            toast.success('Denúncia enviada com sucesso!');
            setTitle('');
            setTestemony('');
            setPhoto('');
            setBase64('');
            setTimeout(() => {
                close();
            }, 2000)
        }catch(err){
            console.log(err);
            toast.error('Algo deu errado, tente novamente!')
        }finally{
            setLoading(false)
        }
    }

    async function reportBlockchain(){
        if(title === '' || testemony === '' || photo === ''){
            return;
        }
        setModalTransaction(true);
        setLoadingTransaction(true);
        AddDelation(
            walletConnected,
            walletSelected,
            title,
            testemony,
            photo
        )
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
            if(message.includes("Caller must be registered")){
                setLogTransaction({
                    type: 'error',
                    message: "You must register on the Sintrop platform before",
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
        const path = await save(file);
        setPhoto(path);
        getBase64(path);
    }

    async function getBase64(path){
        const base64 = await get(path);
        setBase64(base64);
        setLoading(false);
    }

    return(
        <Dialog.Portal className='modal-delation__portal'>
            <Dialog.Overlay className='modal-delation__overlay'/>
            <Dialog.Content className='modal-delation__content'>
                <Dialog.Title className='modal-delation__title'>
                    {t('Delation of user')}
                </Dialog.Title>

                <form onSubmit={handleReport} className='modal-delation__form'>
                    <label htmlFor='title' className='modal-delation__label'>{t('Title of report')}:</label>
                    <input
                        className='modal-delation__input'
                        name='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title of report'
                        required
                    />

                    <label htmlFor='testemony' className='modal-delation__label'>{t('Testimony')}:</label>
                    <textarea
                        style={{resize:'none', height: '100px'}}
                        className='modal-delation__input'
                        name='testimony'
                        type='text'
                        value={testemony}
                        onChange={(e) => setTestemony(e.target.value)}
                        placeholder='Testemony'
                        required
                    />

                    <label htmlFor='photo' className='modal-delation__label'>{t('Proof Photo')}:</label>
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
                    <img
                        src={`data:image/png;base64,${base64}`}
                        className='modal-delation__photo'
                        style={{resizeMode: 'contain'}}
                    />
                </form>

                <div className='modal-delation__area-btn'>
                    <Dialog.Close
                        className='modal-delation__btn-cancel'
                    >
                        {t('Cancel')}
                    </Dialog.Close>
                    <button
                        className='modal-delation__btn-report'
                        onClick={handleReport}
                    >
                        {t('Denounce')}
                    </button>
                </div>

                <Dialog.Root 
                    open={modalTransaction} 
                    onOpenChange={(open) => {
                        if(!loadingTransaction){
                            setModalTransaction(open);
                            setTitle('');
                            setTestemony('');
                            setBase64('');
                            setPhoto('');
                            close()
                        }
                    }}
                >
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>
            </Dialog.Content>

            {loading && (
                <Loading/>
            )}

            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}