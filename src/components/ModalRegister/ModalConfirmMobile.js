import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router';
import { addProducer } from '../../services/registerService';
import { api } from '../../services/api';

export function ModalConfirmMobile({close}){
    const {t} = useTranslation();
    const {walletAddress} = useParams();
    const {chooseModalRegister, getUserDataApi} = useMainContext();
    const navigate = useNavigate();
    const [confirmation, setConfirmation] = useState(true);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    async function register(){
        setModalTransaction(true);
        setLoadingTransaction(true);

        const response = await api.get(`/user/${walletAddress}`);
        const user = response.data.user;
        const address = JSON.parse(user?.address);
        
        if(!user || !address) {
            setLoadingTransaction(false);
            return;
        }
        
        addProducer(walletAddress, user?.name, user?.imgProfileUrl, user?.geoLocation, String(address?.areaProperty))
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                await api.put('/user/on-blockchain', {userWallet: walletAddress})
                setLoadingTransaction(false);
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This producer already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This producer already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
    }

    return(
        <div 
            className="flex fixed top-0 left-0 w-screen h-screen items-center justify-center bg-black/90 z-10 m-auto"
        >
            <div className="flex flex-col items-center justify-center w-full p-5 lg:w-[500px] h-[500px] bg-green-950 rounded-lg">
                {confirmation ? (
                    <>
                        <h1 className='font-bold text-white text-xl text-center'>{t('Você está acessando nossa plataforma pelo Metamask Mobile')}?</h1>

                        <div className="flex w-[150px] items-center justify-between mt-5">
                            <button
                                onClick={close}
                                className='px-5 h-10 border-2 border-[#C66828] font-bold text-[#c66828] rounded-md'
                            >
                                {t('No')}
                            </button>
                            <button
                                onClick={() => setConfirmation(false)}
                                className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                            >
                                {t('Yes')}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                    <p className="text-white text-center">{t('O metamask mobile tem algumas limitações que impedem que o cadastro seja feito aqui dentro')}.</p>
                    <p className="text-white text-center mt-3">{t('Toque no botão abaixo (Copiar link de cadastro), e depois utilize o navegador padrão do seu dispositivo')}.</p>

                    <CopyToClipboard text={`${window.location.host}/register/${walletAddress}`}>
                        <button
                            onClick={() => alert('Link copiado para a área de transferência')}
                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md mt-2'
                        >
                            {t('Copiar link de cadastro')}
                        </button>
                    </CopyToClipboard>

                    <p className="text-white text-center mt-3">{t('Depois de ter se cadastrado em seu navegador padrão, volte aqui para o Metamask Mobile e toque em (Finalizar cadastro)')}.</p>

                    <button
                        onClick={register}
                        className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md mt-2'
                    >
                        {t('Finalizar cadastro')}
                    </button>
                    </>
                )}
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if(!loadingTransaction){
                    setModalTransaction(open)
                    if(logTransaction.type === 'success'){
                        getUserDataApi();
                        navigate(`/dashboard/${walletAddress}/my-account/1/${walletAddress}`)
                        chooseModalRegister();
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                    action='register'
                />
            </Dialog.Root>
        </div>
    )
}