import React, {useEffect, useState} from 'react';
import { api } from '../../../services/api';
import CryptoJS from 'crypto-js';

export function ViewBooking(){
    const [pass, setPass] = useState('123456');
    const [loged, setLoged] = useState(false);
    const [input, setInput] = useState('');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        getBookings();
    }, []);

    async function getBookings(){
        const response = await api.get('/quotes');
        setBookings(response.data.quotes);
    }

    if(!loged){
        return(
            <div className='flex flex-col items-center justify-center p-3'>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Senha'
                    className='bg-gray-200 p-2 rounded-md'
                />

                <button
                    className='mt-3'
                    onClick={() => {
                        if(input === pass){
                            setLoged(true);
                        }else{
                            alert('Senha incorreta!')
                        }
                    }}
                >
                    Acessar
                </button>
            </div>
        )
    }

    return(
        <div className='flex flex-col p-3 items-center gap-2'>
            {bookings.map(item => {
                const keySecret = '84uriuUGjged76382Gdsj28ydsajjdb';

                const cpf = CryptoJS.AES.decrypt(item?.cpf, keySecret); 
                const rg = CryptoJS.AES.decrypt(item?.rg, keySecret);
                const email = CryptoJS.AES.decrypt(item?.email, keySecret);
                const tel = CryptoJS.AES.decrypt(item?.tel, keySecret);
                const profession = CryptoJS.AES.decrypt(item?.profession, keySecret);
                const maritalStatus = CryptoJS.AES.decrypt(item?.maritalStatus, keySecret);

                return(
                    <div 
                        key={item.id}
                        className='flex flex-col p-2 rounded-md border-2 w-[700px]'
                    >
                        <p>Wallet: <span className='font-bold'>{item.reservedBy} - {Intl.NumberFormat('pt-BR').format(item?.value)} RC</span></p>
                        <p>Nome: {item?.name}</p>
                        <p>CPF: {cpf.toString(CryptoJS.enc.Utf8)}</p>
                        <p>RG: {rg.toString(CryptoJS.enc.Utf8)}</p>
                        <p>Email: {email.toString(CryptoJS.enc.Utf8)}</p>
                        <p>Celular: {tel.toString(CryptoJS.enc.Utf8)}</p>
                        <p>Profissão: {profession.toString(CryptoJS.enc.Utf8)}</p>
                        <p>Estado civil: {maritalStatus.toString(CryptoJS.enc.Utf8)}</p>
                    </div>
                )
            })}
        </div>
    )
}