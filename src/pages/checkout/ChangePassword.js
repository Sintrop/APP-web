import React, { useState } from 'react';
import Loading from '../../components/Loading';
import { api } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export function ChangePassword({ close, walletAddress }) {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    async function handleChangePassword() {
        if (password.length < 6) {
            toast.error('A senha deve conter pelo menos 6 caracteres');
            return
        }

        if (!password.trim() || !confirmPassword.trim()) {
            toast.error('Preencha todos os campos');
            return
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não conferem!')
            return;
        }

        try {
            setLoading(true);
            await api.put('/auth/update-password', {
                wallet: walletAddress,
                password
            })
            setPassword('');
            setConfirmPassword('');
            close(true);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 m-auto"
        >
            <div className="flex flex-col items-center justify-between p-5 w-[280px] h-[250px] bg-[#222831] rounded-lg">
                <h3 className='font-bold text-white text-center text-lg'>Alterar senha do app</h3>

                <div className="w-[250px] flex flex-col">
                    <p className='font-bold text-[#ff9900]'>Nova senha:</p>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='h-10 bg-gray-600 px-2 rounded-md text-white'
                        placeholder='Digite a nova senha'
                    />

                    <p className='font-bold text-[#ff9900] mt-3'>Confirme a nova senha:</p>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='h-10 bg-gray-600 px-2 rounded-md text-white'
                        placeholder='Confirme a nova senha'
                    />
                </div>

                <div className='flex items-center justify-between w-full mt-3'>
                    <button
                        className='font-bold text-white'
                        onClick={() => close(false)}
                    >
                        Cancelar
                    </button>

                    <button
                        className='font-bold text-white px-3 py-2 bg-[#2c96ff] rounded-lg'
                        onClick={handleChangePassword}
                    >
                        Alterar
                    </button>
                </div>
            </div>
            {loading && <Loading />}

            <ToastContainer
                position='top-center'
            />
        </div>
    )
}