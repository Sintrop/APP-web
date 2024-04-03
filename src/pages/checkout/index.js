import React, { useEffect, useState } from 'react';
import ConnectWallet from '../../services/connectWallet';
import { api } from '../../services/api';
import Loading from '../../components/Loading';
import Web3 from 'web3';
import { LoadingTransaction } from '../../components/LoadingTransaction';
import * as Dialog from '@radix-ui/react-dialog';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useMainContext } from '../../hooks/useMainContext';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { ConfirmDescart } from './ConfirmDescart';
import { SendReportDev } from './SendReportDev';
import { ToastContainer, toast} from 'react-toastify';
import { ChangePassword } from './ChangePassword';
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCcw } from "react-icons/fi";
import { ModalPublishResearche } from './ModalPublishResearche';
import { TransactionItem } from './TransactionItem';

//Services Web3
import { GetTokensBalance } from '../../services/sacTokenService';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const web3js = new Web3(window.ethereum);

export function Checkout() {
    const { impactPerToken } = useMainContext()
    const [walletAddress, setWalletAddress] = useState('');
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [userData, setUserData] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [userDataApi, setUserDataApi] = useState({});
    const [additionalData, setAdditionalData] = useState({});
    const [imageProfile, setImageProfile] = useState('');
    const [balanceETH, setBalanceETH] = useState(0);
    const [balanceRCT, setBalanceRCT] = useState(0);
    const [modalDescart, setModalDescart] = useState(false);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [modalPublishResearche, setModalPublishResearche] = useState(false);

    useEffect(() => {
        if (walletAddress !== '') {
            getDataWallet();
            getBalanceAccount();
        }
    }, [walletAddress]);

    async function connect() {
        const response = await ConnectWallet();
        console.log(response);
        console.log(process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS);
        if (response.connectedStatus) {
            setWalletAddress(response.address[0]);
        }
    };

    async function getDataWallet() {
        setLoadingData(true);
        const responseUser = await api.get(`/user/${walletAddress}`);
        const responseTransactions = await api.get(`/transactions-open/${walletAddress}`);
        const user = responseUser.data.user;
        const transactions = responseTransactions.data.transactions;

        getImageProfile(user)
        setUserData(user)
        setTransactions([]);
        if (transactions.length > 0) {
            setTransactions(transactions);
        }

        setLoadingData(false);
    }

    async function getImageProfile(user) {
        if (user?.userType === 7) {
            if (user?.imgProfileUrl) {
                const response = await axios.get(`https://ipfs.io/ipfs/${user?.imgProfileUrl}`);

                if (response.data.includes('base64')) {
                    setImageProfile(response.data);
                } else {
                    setImageProfile(`https://ipfs.io/ipfs/${user?.imgProfileUrl}`)
                }
            } else {
                setImageProfile('');
            }
        } else {
            const response = await axios.get(`https://ipfs.io/ipfs/${user?.imgProfileUrl}`);

            if (response.data.includes('base64')) {
                setImageProfile(response.data);
            } else {
                setImageProfile(`https://ipfs.io/ipfs/${user?.imgProfileUrl}`)
            }
        }
    }

    async function getBalanceAccount() {
        const response = await web3js.eth.getBalance(walletAddress);
        setBalanceETH(Number(response / 10 ** 18).toFixed(5));

        const response2 = await GetTokensBalance(walletAddress);
        setBalanceRCT(Number(response2 / 10 ** 18).toFixed(2).replace('.', ','));
    }

    async function handleRequestSepolia() {
        if (loading) return;
        try {
            setLoadingData(true);
            await api.post('/request-faucet', {
                wallet: walletAddress
            })
            alert('Requisição feita com sucesso! Em instantes nossa equipe enviará ETH para você')
            emailjs.send('service_alygxgf', 'template_elsj08i', { walletAddress }, 'kuy2D_QzG95P7COQI')
                .then(() => {
                })
                .catch(() => {

                })
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingData(false);
        }
    }
    return (
        <div className="flex flex-col items-center w-screen min-h-[100vh] bg-[#062C01]">
            {walletAddress === '' ? (
                <>
                    <div className="flex flex-col h-screen w-screen items-center justify-center">
                        <div className="max-w-[350px] w-full h-screen bg-checkout bg-contain bg-no-repeat bg-center flex flex-col justify-between px-3">
                            <div className='mt-10'>
                                <img
                                    src={require('../../assets/logo-branco.png')}
                                    className='w-[180px] object-contain'
                                />
                                <h2 className='font-bold text-xl text-white'>Payment System</h2>
                            </div>

                            <h3 className='w-40 text-white text-3xl font-bold'>Transações simples e seguras</h3>

                            <button
                                className='px-3 py-2 rounded-lg bg-[#3E9EF5] font-bold text-white mt-2 mb-10'
                                onClick={connect}
                            >
                                Sincronizar wallet
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="p-3 w-full max-w-[320px] flex flex-col">
                        <img
                            src={require('../../assets/logo-branco.png')}
                            className='w-[100px] object-contain mt-3'
                        />

                        <div className='flex items-center justify-between my-3'>
                            <div>
                                <p className='font-bold text-white text-sm'>Olá, {userData?.name}</p>
                                <p className='text-gray-200 text-xs' onClick={() => { }}>Acompanhe aqui suas transações</p>
                                <button
                                    className='font-bold text-red-500 text-xs'
                                    onClick={() => setWalletAddress('')}
                                >
                                    Trocar wallet
                                </button>
                            </div>

                            <img
                                src={imageProfile}
                                className='w-[50px] h-[50px] rounded-full object-cover border-2'
                            />
                        </div>

                        {balanceETH < 0.01 && (
                            <button
                                onClick={handleRequestSepolia}
                                className='font-bold text-white text-center text-xs border-2 rounded-lg p-2'
                            >Solicitar ETH</button>
                        )}

                        {userData?.userType === 4 && (
                            <button
                                onClick={() => setModalDevReport(true)}
                                className='font-bold text-white text-center text-xs border-2 rounded-lg p-2'
                            >Relatório de contribuição</button>
                        )}

                        {userData?.userType === 3 && (
                            <button
                                onClick={() => setModalPublishResearche(true)}
                                className='font-bold text-white text-center text-xs border-2 rounded-lg p-2'
                            >Publicar pesquisa</button>
                        )}

                        <button
                            onClick={() => setModalChangePassword(true)}
                            className='font-bold text-white text-center text-xs border-2 rounded-lg p-2 mt-2'
                        >Alterar senha do app</button>

                        <div className="w-full h-[200px] flex flex-col justify-center p-2 bg-card bg-contain bg-center bg-no-repeat">
                            <div className="flex flex-col">
                                <p className="text-white font-bold text-sm max-w-[40ch] text-ellipsis overflow-hidden">{walletAddress}</p>
                                <p className="text-sm text-white">wallet</p>
                            </div>

                            <div className="flex items-center gap-5 mt-2">
                                <div className="flex flex-col">
                                    <p className="text-white font-bold text-sm max-w-[40ch] text-ellipsis overflow-hidden">{balanceETH}</p>
                                    <p className="text-white text-sm">ETH</p>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-white font-bold text-sm max-w-[40ch] text-ellipsis overflow-hidden">{balanceRCT}</p>
                                    <p className="text-white text-sm">RCT</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='text-white'>Transações em aberto</p>

                            <button
                                onClick={() => getDataWallet()}
                            >
                                <FiRefreshCcw size={20} color='white'/>
                            </button>
                        </div>

                        {transactions.length === 0 ? (
                            <p className='font-bold text-center text-white mt-2'>Essa wallet não possui nenhuma transação em aberto</p>
                        ) : (
                            <>
                                {transactions.map(item => (
                                    <TransactionItem
                                        transaction={item}
                                        walletAddress={walletAddress}
                                        userData={userData}
                                        attTransactions={() => {
                                            getDataWallet();
                                        }}
                                    />
                                ))}
                                {/* <div className='flex flex-col p-2 rounded-md w-full max-w-[320px] bg-[#0a4303]'>
                                    <p className='font-bold text-sm flex gap-1 text-white'>
                                        Tipo da transação:

                                        <p className='font-normal'>
                                            {transactions[0].type === 'register' && 'Cadastro'}
                                            {transactions[0].type === 'request-inspection' && 'Solicitação de inspeção'}
                                            {transactions[0].type === 'accept-inspection' && 'Aceitar inspeção'}
                                            {transactions[0].type === 'realize-inspection' && 'Finalizar inspeção'}
                                            {transactions[0].type === 'buy-tokens' && 'Compra de RCT'}
                                            {transactions[0].type === 'burn-tokens' && 'Contribuição'}
                                            {transactions[0].type === 'invalidate-inspection' && 'Invalidar inspeção'}
                                            {transactions[0].type === 'dev-report' && 'Relatório de contribuição'}
                                            {transactions[0].type === 'withdraw-tokens' && 'Sacar tokens'}
                                            {transactions[0].type === 'invalidate-user' && 'Invalidar usuário'}
                                        </p>
                                    </p>

                                    <button
                                        className="w-full rounded-lg py-2 bg-[#3E9EF5] font-bold text-white mt-5"
                                        onClick={executeTransaction}
                                    >
                                        Finalizar transação
                                    </button>

                                    <button
                                        className="w-full rounded-md py-2 font-bold text-gray-500"
                                        onClick={async () => setModalDescart(true)}
                                    >
                                        Descartar transação
                                    </button>
                                </div> */}
                            </>
                        )}
                    </div>
                </>
            )}

            {loadingData && (
                <Loading />
            )}

            {loading && (
                <Loading/>
            )}

            {modalDescart && (
                <>
                    <ConfirmDescart
                        close={async (confirm) => {
                            if (confirm) {
                                setModalDescart(false);
                                await api.put('/transactions-open/finish', { id: transactions[0].id });
                                setTransactions([]);
                                getDataWallet();
                            } else {
                                setModalDescart(false);
                            }
                        }}
                    />
                </>
            )}

            {modalDevReport && (
                <SendReportDev
                    close={() => setModalDevReport(false)}
                    walletAddress={walletAddress}
                    userData={userData}
                />
            )}

            {modalChangePassword && (
                <ChangePassword
                    walletAddress={walletAddress}
                    close={(success) => {
                        if(success){
                            setModalChangePassword(false);
                            toast.success('Senha alterada com sucesso!')
                        }else{
                            setModalChangePassword(false);
                        }
                    }}
                />
            )}

            <Dialog.Root open={modalPublishResearche} onOpenChange={(open) => setModalPublishResearche(open)}>
                <ModalPublishResearche 
                    close={() => setModalPublishResearche(false)}
                    walletAddress={walletAddress}
                />
            </Dialog.Root>

            <div className="absolute z-50">
                <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                    if (!loadingTransaction) {
                        setModalTransaction(open)
                        setLoading(false);
                        if (logTransaction.type === 'success') {
                            setTransactions([]);
                            getDataWallet();
                        }
                    }
                }}>
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>
            </div>

            <ToastContainer position='top-center'/>
        </div>
    )
}