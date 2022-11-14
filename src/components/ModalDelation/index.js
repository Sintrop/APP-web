import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import './modalDelation.css';
import * as Dialog from '@radix-ui/react-dialog';
import {save, get} from '../../config/infura';
import Loading from '../Loading';
import {AddDelation, GetDelation} from '../../services/userService';

export default function ModalDelation({reportedWallet}){
    const {walletAddress} = useParams();
    const [title, setTitle] = useState('');
    const [testemony, setTestemony] = useState('');
    const [photo, setPhoto] = useState('');
    const [base64, setBase64] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleReport(e){
        e.preventDefault();
        if(title === '' || testemony === '' || photo === ''){
            return;
        }
        setLoading(true);
        await AddDelation(
            walletAddress,
            reportedWallet,
            title,
            testemony,
            photo
        )
        setLoading(false);
        
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
                    Delation of user
                </Dialog.Title>

                <form onSubmit={handleReport} className='modal-delation__form'>
                    <label htmlFor='title' className='modal-delation__label'>Title of report:</label>
                    <input
                        className='modal-delation__input'
                        name='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Title of report'
                        required
                    />

                    <label htmlFor='testemony' className='modal-delation__label'>Testimony:</label>
                    <textarea
                        style={{resize:'none', height: '100px'}}
                        className='modal-delation__input'
                        name='testemony'
                        type='text'
                        value={testemony}
                        onChange={(e) => setTestemony(e.target.value)}
                        placeholder='Testemony'
                        required
                    />

                    <label htmlFor='photo' className='modal-delation__label'>Photo:</label>
                    <input 
                        type='file' 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                                const arrayBuffer = reader.result
                                const file = new Uint8Array(arrayBuffer);
                                console.log(reader)
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
                        Cancel
                    </Dialog.Close>
                    <button
                        className='modal-delation__btn-report'
                        onClick={handleReport}
                    >
                        Report
                    </button>
                </div>
            </Dialog.Content>

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}