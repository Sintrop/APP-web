import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { api } from "../../../../services/api";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import { ActivityIndicator } from "../../../../components/ActivityIndicator";
import { useTranslation } from "react-i18next";

export function ModalReserve({ reserved }) {
    const {t} = useTranslation();
    const [input, setInput] = useState('');
    const [credits, setCredits] = useState(0);
    const [loadingBuy, setLoadingBuy] = useState(false);
    const [name, setName] = useState('');
    const [nacionality, setNacionality] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [address, setAddress] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [profession, setProfession] = useState('');
    const [wallet, setWallet] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setCredits((Number(input) / 0.0282).toFixed(0))
    }, [input]);

    async function handleBuy() {
        if(loadingBuy){
            return;
        }

        if (!email.trim() || !tel.trim() || !wallet.trim() || !name.trim() || !cpf.trim() || !rg.trim() || !profession.trim() || !maritalStatus.trim() || credits === '0') {
            toast.error(t('preenchaCampos'));
            return;
        }

        const keySecret = '84uriuUGjged76382Gdsj28ydsajjdb';

        const encryptCPF = CryptoJS.AES.encrypt(cpf, keySecret);
        const encryptRG = CryptoJS.AES.encrypt(rg, keySecret);
        const encryptProfession = CryptoJS.AES.encrypt(profession, keySecret);
        const encryptMarital = CryptoJS.AES.encrypt(maritalStatus, keySecret);
        const encryptTel = CryptoJS.AES.encrypt(tel, keySecret);
        const encryptEmail = CryptoJS.AES.encrypt(email, keySecret);
        const encryptAddress = CryptoJS.AES.encrypt(address, keySecret);

        try {
            setLoadingBuy(true);
            const response = await api.post('/quotes/reserve', {
                wallet,
                name,
                cpf: encryptCPF.toString(),
                rg: encryptRG.toString(),
                profession: encryptProfession.toString(),
                maritalStatus: encryptMarital.toString(),
                tel: encryptTel.toString(),
                email: encryptEmail.toString(),
                value: Number(credits),
                address: encryptAddress.toString(),
            });

            toast.success('Reserva feita com sucesso!');
            reserved(response.data.booking);
        } catch (err) {
            toast.error(t('algoDeuErrado'))
        } finally {
            setLoadingBuy(false);
        }
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0 z-50'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col items-center bg-[#0a4303] h-[400px] rounded-md m-auto inset-0 md:w-[400px] p-5'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-8" />
                    <Dialog.Title className="font-bold text-white">{t('formulario')}</Dialog.Title>
                    <Dialog.Close>
                        <IoMdCloseCircleOutline color='white' size={25} />
                    </Dialog.Close>
                </div>

                <div className="flex flex-col w-full overflow-y-auto mt-3">
                    <div className="flex flex-col w-full p-2 rounded-md bg-green-950">
                        <p className="font-bold text-sm text-blue-500">Quanto você pretende investir?</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="font-bold text-sm text-white">R$</p>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="py-1 border-b bg-transparent px-2 text-white"
                                placeholder="0.00"
                                type='number'
                            />
                        </div>

                        <p className="font-bold mt-3 text-sm text-blue-500">Você vai receber em Créditos de Regeneração (CR)</p>
                        <div className="flex items-center gap-2 mt-1">
                            <img
                                src={require('../../../../assets/token.png')}
                                className="w-7 h-7 object-cover"
                            />

                            <p className="font-bold text-sm text-white">{Intl.NumberFormat('pt-BR').format(credits)} CR</p>
                        </div>
                    </div>

                    <label className="font-bold text-blue-500 mt-2">Sua wallet:</label>
                    <input
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <label className="font-bold text-blue-500 mt-2">Nome:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <label className="font-bold text-blue-500 mt-2">CPF (Sem pontos, hífen.):</label>
                    <input
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                        type="number"
                    />

                    <label className="font-bold text-blue-500 mt-2">Documento de identidade (RG) (Sem pontos, hífen.):</label>
                    <input
                        value={rg}
                        onChange={(e) => setRg(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                        type="number"
                    />

                    <label className="font-bold text-blue-500 mt-2">Celular (Sem pontos, hífen.):</label>
                    <input
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                        type="number"
                    />

                    <label className="font-bold text-blue-500 mt-2">Email:</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <label className="font-bold text-blue-500 mt-2">Endereço:</label>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <label className="font-bold text-blue-500 mt-2">Profissão:</label>
                    <input
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <label className="font-bold text-blue-500 mt-2">Estado civil:</label>
                    <input
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="py-1 border-b bg-green-950 px-2 text-white rounded-md"
                        placeholder="Digite aqui"
                    />

                    <p className="text-white text-center text-xs mt-3">Todos os seus dados serão protegidos com a criptografia end-to-end (Ponta a ponta).</p>

                    <button className="w-full py-2 rounded-md bg-blue-600 font-bold text-white mt-3" onClick={handleBuy}>
                        {loadingBuy ? (
                            <ActivityIndicator size={30}/>
                        ) : (
                            'Entrar na lista de espera'
                        )}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}