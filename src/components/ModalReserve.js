import React, {useEffect, useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from 'react-router';
import { ToastContainer, toast} from 'react-toastify';
import {IoMdCloseCircleOutline} from 'react-icons/io';
import { api } from '../services/api';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';
import emailjs from '@emailjs/browser';

export function ModalReserve({quotes, close}){
    const {walletAddress} = useParams();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [wallet, setWallet] = useState('');
    const [quantQuotes, setQuantQuotes] = useState(1);
    const [maxQuotes, setMaxQuotes] = useState(0);
    const [finished, setFinished] = useState('');

    useEffect(() => {
        setName('');
        setEmail('');
        setTel('');
        setWallet('');
        setQuantQuotes(1);
        setFinished(false);
        setTimeout(() => {
            countQuotes();
        }, 1000)
    },[]);

    function countQuotes(){
        let countAvaliables = 0;
        for(var i = 0; i < quotes.length; i++){
            if(quotes[i].reservedBy === null || quotes[i].reservedBy === ''){
                countAvaliables += 1;
            }
        }
        setMaxQuotes(countAvaliables);
    }

    async function handleCreate(){
        if(loading){
            return;
        }
        if(quantQuotes < 1){
            return;
        }
        if(quantQuotes > maxQuotes){
            return;
        }
        if(!name.trim()){
            return;
        }
        if(!email.trim()){
            return;
        }
        if(!tel.trim()){
            return;
        }
        if(!wallet.trim()){
            return;
        }
        try{
            setLoading(true);
            const investorData = {
                wallet,
                name,
                email,
                tel,
            }
            const updated = await api.put('/quotes/reserve', {
                quantQuote: Number(quantQuotes),
                investorData: JSON.stringify(investorData)
            })

            const templateParams={
                from_name: name,
                email,
                tel,
                message: `Investimento | Wallet do investidor: ${wallet} | Cotas: ${quantQuotes}`
            }
    
            emailjs.send('service_alygxgf', 'template_fr74tuc', templateParams, 'kuy2D_QzG95P7COQI')
            .then(res => {
            })
            setFinished(true);

        }catch(err){
            console.log(err)
            toast.error(`${t('Algo deu errado, tente novamente!')}`)
        }finally{
            setLoading(false)
        }
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-black/60 fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[450px] h-[520px] bg-[#0a4303] rounded-md m-auto inset-0 border-2'>
                <div className='flex items-center w-full justify-between mb-5'>
                    <div className='w-[25px]'/>
                    <Dialog.Title className='font-bold text-white'>{t('Reserve Quot')}</Dialog.Title>
                    <button
                        onClick={close}
                    >
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </button>
                </div>

                {finished ? (
                    <>
                    <div className='flex flex-col items-center'>
                        <p className='font-bold text-white text-2xl text-center'>{t('Congratulations')}!!!</p>
                        <p className=' text-white mt-5 text-center'>{t('You have just reserved an investment quota! Our team will contact you shortly. Thanks for the trust')}.</p>
                        <button
                            className='px-4 py-2 bg-yellow-300 text-green-700 font-bold rounded-md mt-5'
                            onClick={close}
                        >
                            {t('Close')}
                        </button>
                    </div>
                    <div/>
                    </>
                ) : (
                    <>
                    <div className="flex flex-col w-full">
                        <p className="font-bold text-[#ff9900]">{t('Your name')}:</p>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Digite aqui'
                            className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                            maxLength={50}
                        />

                        <p className="font-bold text-[#ff9900] mt-3">{t('Email contact')}:</p>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            placeholder='Digite aqui'
                            className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                        />

                        <p className="font-bold text-[#ff9900] mt-3">{t('Tel. Contact')}:</p>
                        <input
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            placeholder='Digite aqui'
                            type='tel'
                            className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                        />

                        <p className="font-bold text-[#ff9900] mt-3">{t('Wallet of investor')}:</p>
                        <input
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                            placeholder='Digite aqui'
                            type='tel'
                            className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                        />

                        <p className="font-bold text-[#ff9900] mt-3">{t('Number of quotes')}:</p>
                        <input
                            value={quantQuotes}
                            onChange={(e) => setQuantQuotes(e.target.value)}
                            placeholder='Digite aqui'
                            type='number'
                            max={maxQuotes}
                            className='bg-gray-800 rounded-md border-2 px-2 py-2 w-full text-white'
                        />
                        <p className='text-white'>{t('Quots Avaliables')}: {maxQuotes}</p>
                    </div>

                    <div className='flex items-center justify-between w-full'>
                        <Dialog.Close
                            className='p-3 text-white font-bold'
                        >
                            {t('Cancel')}
                        </Dialog.Close>

                        <button
                            className='px-3 py-2 text-white font-bold rounded-md bg-[#ff9900]'
                            onClick={handleCreate}
                        >   
                            {t('Reserve')}
                        </button>
                    </div>
                    </>
                )}
            </Dialog.Content>

            <ToastContainer
                position='top-center'
            />

            {loading && (
                <Loading/>
            )}
        </Dialog.Portal>
    )
}