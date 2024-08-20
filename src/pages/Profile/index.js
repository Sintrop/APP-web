import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { useMainContext } from "../../hooks/useMainContext";
import { FaUser, FaListAlt, FaList, FaChevronRight, FaQrcode, FaMobile, FaMapMarkedAlt } from "react-icons/fa";
import { MdHelpOutline, MdInfo } from "react-icons/md";
import { SiReadthedocs } from 'react-icons/si';
import { getImage } from "../../services/getImage";
import { TopBar } from '../../components/TopBar';
import { ProducerCertificate } from '../../components/Certificates/ProducerCertificate';
import { ContributeCertificate } from '../../components/Certificates/ContributeCertificate';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdLogout } from "react-icons/md";
import { ModalLogout } from '../Home/components/ModalLogout';
import { Item } from "../ImpactCalculator/components/Item";
import { ModalEditProfile } from "./components/ModalEditProfile";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../components/ModalConnectAccount/index.js";
import { Feedback } from "../../components/Feedback";
import { ProducerGraphics } from "../../components/ProducerGraphics";
import { ModalSignOut } from "../../components/ModalSignOut";
import { api } from "../../services/api";
import { getProportionallity } from "../../services/getProportionality";
import { addResearcher } from "../../services/researchersService";
import { addInspector } from "../../services/registerService";
import { addActivist } from "../../services/activistService";
import { LoadingTransaction } from "../../components/LoadingTransaction";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import { RegenerationZoneProfile } from "./components/RegenerationZoneProfile.js";
import QRCode from "react-qr-code";
import { ShortPubli } from "./components/ShortPubli/index.js";
import { Chat } from "../../components/Chat/index.js";
import { useTranslation } from "react-i18next";

export function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userData, walletConnected, blockchainData, getUserDataApi } = useMainContext();
    const [imageProfile, setImageProfile] = useState(null);
    const [tabSelected, setTabSelected] = useState('certificates');
    const [loading, setLoading] = useState(false);
    const [proofPhoto, setProofPhoto] = useState('');
    const [pathProperty, setPathProperty] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [modalLogout, setModalLogout] = useState(false);
    const [itemsToReduce, setItemsToReduce] = useState([]);
    const [editProfile, setEditProfile] = useState(false);
    const [modalConnect, setModalConnect] = useState(false);
    const [modalSignOut, setModalSignOut] = useState(false);
    const [accountStatus, setAccountStatus] = useState('pending');
    const [vacancyAvaliable, setVacancyAvaliable] = useState(true);
    const [amountVacancy, setAmountVacancy] = useState(null);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [inviteData, setInviteData] = useState(null);
    const [zones, setZones] = useState([]);
    const [invoicesThisYear, setInvoicesThisYear] = useState([]);
    const [publications, setPublications] = useState([]);
    const [loadingPubli, setLoadingPubli] = useState(false);

    useEffect(() => {
        if (userData) {
            getImageProfile(userData?.imgProfileUrl);
            getInvoices(userData?.id);
        }

        if (userData?.itemsToReduce) {
            setItemsToReduce(JSON.parse(userData?.itemsToReduce));
        }

        if (userData?.accountStatus) {
            setAccountStatus(userData?.accountStatus);
        }

        if (userData?.zones) {
            setZones(JSON.parse(userData?.zones))
        }

        if (userData?.id !== 'anonimous') {
            if (userData?.accountStatus !== 'blockchain') {
                checkInvite();
                getProportion();
            }
        } else {
            checkInvite();
        }

    }, [userData]);

    useEffect(() => {
        if (blockchainData) {
            getProofPhoto(blockchainData?.proofPhoto);
        }
    }, [blockchainData]);

    useEffect(() => {
        if (tabSelected === 'publis') getPublications();
    }, [tabSelected]);

    async function getPublications() {
        setLoadingPubli(true);
        const response = await api.get(`/publications/${userData.id}`);
        setPublications(response.data.publications);
        setLoadingPubli(false);
    }

    async function getProofPhoto(hash) {
        const response = await getImage(hash);
        setProofPhoto(response);
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    async function checkInvite() {
        const response = await api.get(`/invites/${userData?.wallet}`)
        const invite = response.data.invite;

        if (invite?.invited === '0x0000000000000000000000000000000000000000') {
            setAccountStatus('pending');
        }
        if (String(invite?.invited).toLowerCase() === String(userData?.wallet).toLowerCase()) {
            setAccountStatus('guest');
            setInviteData(invite);
            if (accountStatus === 'pending') {
                api.put('/user/account-status', {
                    userWallet: userData?.wallet,
                    status: 'guest',
                })
            }
        }
    }

    async function getProportion() {
        if (userData?.userType === 1) {
            return;
        }
        const response = await getProportionallity(userData?.userType);
        setVacancyAvaliable(response.availableVacancy);
        setAmountVacancy(response.amountVacancy);
    }

    async function registerBlockchain() {
        if (userData.userType === 2) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addInspector(walletConnected, userData?.name, userData?.imgProfileUrl, 'geolocation')
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' });
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'new-user',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                hash: res?.hashTransaction
                            }),
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        setLoading(false)
                        setLoadingTransaction(false);
                    }
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Not allowed user")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Not allowed user',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("This activist already exist")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'This activist already exist',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("User already exists")) {
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

        if (userData.userType === 3) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addResearcher(walletConnected, userData?.name, userData.imgProfileUrl)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' });
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'new-user',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                hash: res?.hashTransaction
                            }),
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        setLoading(false)
                        setLoadingTransaction(false);
                    }
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Not allowed user")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Not allowed user',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("This activist already exist")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'This activist already exist',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("User already exists")) {
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

        if (userData.userType === 6) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addActivist(walletConnected, userData?.name, userData?.imgProfileUrl)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' });
                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'new-user',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                hash: res?.hashTransaction
                            }),
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        setLoading(false)
                        setLoadingTransaction(false);
                    }
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Not allowed user")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Not allowed user',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("This supporter already exist")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'This supporter already exist',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("User already exists")) {
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
    }

    async function getInvoices(userId) {
        const atualYear = new Date().getFullYear();
        const response = await api.get(`/invoices/${userId}/${atualYear}`);
        setInvoicesThisYear(response.data.invoices);
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/profile`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive='profile' />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 px-2 lg:px-0">
                    {loading ? (
                        <div className="flex justify-center h-[90vh]">
                            <ActivityIndicator size={180} />
                        </div>
                    ) : (
                        <>
                            {userData ? (
                                <>
                                    {userData?.id === 'anonimous' && (
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-white">{t('voceNaoCadastroSistema')}</p>

                                            <button
                                                className="w-fit py-1 px-5 bg-blue-500 rounded-md text-white font-bold mt-1"
                                                onClick={() => setModalSignOut(true)}
                                            >
                                                {t('cadastre-se')}
                                            </button>

                                            {inviteData && (
                                                <div className="flex flex-col mt-3 w-fit p-3 rounded-md border border-white">
                                                    <p className="text-white">{t('voceRecebeuConviteComo')}:</p>
                                                    <p className="font-bold text-green-600 text-2xl">
                                                        {inviteData?.userType === 1 && t('textProdutor')}
                                                        {inviteData?.userType === 2 && t('textInspetor')}
                                                        {inviteData?.userType === 3 && t('textPesquisador')}
                                                        {inviteData?.userType === 4 && t('textDesenvolvedor')}
                                                        {inviteData?.userType === 5 && t('textContribuidor')}
                                                        {inviteData?.userType === 6 && t('textAtivista')}
                                                        {inviteData?.userType === 7 && t('textApoiador')}
                                                        {inviteData?.userType === 8 && t('textValidador')}
                                                    </p>

                                                    <p className="text-white mt-3">{t('voceFoiConvidadoPor')}:</p>
                                                    <p className="font-bold text-green-600">{inviteData?.inviter}</p>
                                                </div>
                                            )}

                                            <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-5">
                                                <div className="flex items-center gap-2">
                                                    <MdHelpOutline color='white' size={25} />
                                                    <p className="font-semibold text-white">{t('ajuda')}</p>
                                                </div>

                                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                                    <a
                                                        href='https://docs.sintrop.com'
                                                        target="_blank"
                                                        className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                                    >
                                                        <SiReadthedocs size={25} color='white' />
                                                        <p className="font-bold text-white text-sm">{t('documentacao')}</p>
                                                    </a>

                                                    <a
                                                        href='https://www.sintrop.com/app'
                                                        target="_blank"
                                                        className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                                    >
                                                        <FaMobile size={25} color='white' />
                                                        <p className="font-bold text-white text-sm">App mobile</p>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {accountStatus === 'blockchain' ? (
                                        <div>
                                            <p className="font-bold text-white">{t('seuPerfil')}</p>
                                            <div className="w-full flex flex-col bg-[#03364B] p-3 rounded">
                                                <div className="bg-florest w-full h-[230px] bg-center bg-cover bg-no-repeat rounded-t-md">
                                                    {userData?.bannerUrl && (
                                                        <img
                                                            src={userData?.bannerUrl}
                                                            className="w-full h-full object-cover rounded-t-md"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col bg-[#012939] p-3 rounded">
                                                    <div className="w-28 h-28 rounded-full bg-gray-400 border-4 border-white mt-[-90px]">
                                                        {imageProfile ? (
                                                            <img
                                                                src={imageProfile}
                                                                className="rounded-full object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <>
                                                                {userData?.userType === 7 && (
                                                                    <img
                                                                        src={require('../../assets/icon-validator.png')}
                                                                        className="rounded-full object-cover w-full h-full"
                                                                    />
                                                                )}

                                                                {userData?.userType === 8 && (
                                                                    <img
                                                                        src={require('../../assets/icon-validator.png')}
                                                                        className="rounded-full object-cover w-full h-full"
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <p className="font-bold text-white mt-3">{userData?.name}</p>
                                                    <p className="text-gray-300 text-sm">
                                                        {userData?.userType === 1 && t('textProdutor')}
                                                        {userData?.userType === 2 && t('textInspetor')}
                                                        {userData?.userType === 3 && t('textPesquisador')}
                                                        {userData?.userType === 4 && t('textDesenvolvedor')}
                                                        {userData?.userType === 5 && t('textContribuidor')}
                                                        {userData?.userType === 6 && t('textAtivista')}
                                                        {userData?.userType === 7 && t('textApoiador')}
                                                        {userData?.userType === 8 && t('textValidador')}
                                                    </p>

                                                    {userData?.bio && (
                                                        <p className="text-sm text-white">{userData?.bio}</p>
                                                    )}
                                                    <div className="p-1 bg-[#03364B] border-2 border-green-500 rounded-md w-fit mt-1">
                                                        <p className="text-white text-xs lg:text-base">Wallet: {walletConnected}</p>
                                                    </div>

                                                    <div className="flex gap-3 mt-2 ">
                                                        <button
                                                            className="flex items-center gap-2 text-white font-semibold text-sm p-1 border rounded-md w-fit"
                                                            onClick={() => setEditProfile(true)}
                                                        >
                                                            <MdEdit size={20} color='white' />
                                                            {t('editarPerfil')}
                                                        </button>

                                                        <button
                                                            className="flex items-center gap-2 text-[#ff0000] font-semibold text-sm p-1 border rounded-md w-fit"
                                                            onClick={() => setModalLogout(true)}
                                                        >
                                                            <MdLogout size={20} color='#ff0000' />
                                                            {t('desconectar')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 mt-2 overflow-x-auto">
                                                <button
                                                    className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                    onClick={() => setTabSelected('certificates')}
                                                >
                                                    <FaQrcode size={18} color={tabSelected === 'certificates' ? 'green' : 'white'} />
                                                    {t('certificados')}
                                                </button>

                                                <button
                                                    className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                    onClick={() => setTabSelected('data')}
                                                >
                                                    <FaUser size={18} color={tabSelected === 'data' ? 'green' : 'white'} />
                                                    {t('dados')}
                                                </button>

                                                <button
                                                    className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                    onClick={() => setTabSelected('publis')}
                                                >
                                                    <FaListAlt size={18} color={tabSelected === 'publis' ? 'green' : 'white'} />
                                                    {t('publicacoes')}
                                                </button>

                                                {userData?.userType === 1 && (
                                                    <>
                                                        <button
                                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                            onClick={() => setTabSelected('inspections')}
                                                        >
                                                            <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                            {t('isps')}
                                                        </button>

                                                        <button
                                                            className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'zones' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                                                            onClick={() => setTabSelected('zones')}
                                                        >
                                                            <FaMapMarkedAlt size={18} color={tabSelected === 'zones' ? 'green' : 'white'} />
                                                            {t('zonasDeRegeneracao')}
                                                        </button>
                                                    </>
                                                )}

                                                {userData?.userType === 2 && (
                                                    <button
                                                        className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                        onClick={() => setTabSelected('inspections')}
                                                    >
                                                        <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                        {t('isps')}
                                                    </button>
                                                )}
                                            </div>

                                            {tabSelected === 'data' && (
                                                <>
                                                    {userData?.userType === 1 && (
                                                        <div className='flex flex-col w-full gap-5 mt-5 lg:gap-5 lg:px-30 bg-[#03364B] rounded-md p-3'>
                                                            <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>{t('statsProdutor')}</h3>

                                                            <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                                                                <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                                    <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.producer?.totalInspections} </p>
                                                                    <p className='text-white text-xs lg:text-base'>{t('ispsRecebidas')}</p>
                                                                </div>

                                                                <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                                    <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.producer?.isa?.isaScore}</p>
                                                                    <p className='text-white text-xs lg:text-base'>{t('pts')}</p>
                                                                </div>

                                                                <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                                    <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(blockchainData?.producer?.isa?.isaScore / blockchainData?.producer?.totalInspections)}</p>
                                                                    <p className='text-white text-xs lg:text-base'>{t('media')}</p>
                                                                </div>

                                                                <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                                                                    <p className='font-bold text-white text-xl lg:text-3xl'>0</p>
                                                                    <p className='text-red-500 text-xs lg:text-base'>{t('denunciasRecebidas')}</p>
                                                                </div>
                                                            </div>

                                                            <ProducerGraphics inspections={inspections} />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center flex-col gap-4 mt-2">
                                                        <div className="p-2 rounded-md flex flex-col bg-[#03364B] gap-2 w-full lg:flex-row">
                                                            <div className="flex flex-col">
                                                                <div className="w-[200px] h-[200px] rounded-md bg-gray-400">
                                                                    {proofPhoto && (
                                                                        <img
                                                                            src={proofPhoto}
                                                                            className="w-[200px] h-[200px] rounded-md object-cover border-2 border-white"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-center text-gray-400 mb-1">{t('fotoProva')}</p>
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-white font-bold text-sm">{t('entrouComunidade')}: <span className="font-normal">{format(new Date(userData?.createdAt), 'dd/MM/yyyy')}</span></p>

                                                                {userData?.userType === 1 && (
                                                                    <>
                                                                        <p className="text-white font-bold text-sm">{t('areaPropriedade')}:
                                                                            <span className="font-normal"> {Intl.NumberFormat('pt-BR').format(Number(blockchainData?.producer?.certifiedArea).toFixed(0))} m²</span>
                                                                        </p>
                                                                        <p className="text-white font-bold text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.producer?.totalInspections}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('ptsRegen')}: <span className="font-normal">{blockchainData?.producer?.isa?.isaScore} pts</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.producer?.pool?.currentEra}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.producer?.proofPhoto}</span></p>
                                                                        <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.producer?.userType}</span></p>
                                                                    </>
                                                                )}

                                                                {userData?.userType === 2 && (
                                                                    <>
                                                                        <p className="text-white font-bold text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.inspector?.totalInspections}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('desistencias')}: <span className="font-normal">{blockchainData?.inspector?.giveUps}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.inspector?.pool?.currentEra}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.inspector?.proofPhoto}</span></p>
                                                                        <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.inspector?.userType}</span></p>
                                                                    </>
                                                                )}

                                                                {userData?.userType === 3 && (
                                                                    <>
                                                                        <p className="text-white font-bold text-sm">{t('pesquisasPublicadas')}: <span className="font-normal">{blockchainData?.researcher?.publishedWorks}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.researcher?.pool?.currentEra}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.researcher?.proofPhoto}</span></p>
                                                                        <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.researcher?.userType}</span></p>
                                                                    </>
                                                                )}

                                                                {userData?.userType === 4 && (
                                                                    <>
                                                                        <p className="text-white font-bold text-sm">{t('nivel')}: <span className="font-normal">{blockchainData?.developer?.pool?.level}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.developer?.pool?.currentEra}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.developer?.proofPhoto}</span></p>
                                                                        <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.developer?.userType}</span></p>
                                                                    </>
                                                                )}

                                                                {userData?.userType === 6 && (
                                                                    <>
                                                                        <p className="text-white font-bold text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.activist?.pool?.currentEra}</span></p>
                                                                        <p className="text-white font-bold text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.activist?.proofPhoto}</span></p>
                                                                        <p className="text-white font-bold text-sm">User type: <span className="font-normal">{blockchainData?.activist?.userType}</span></p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {tabSelected === 'inspections' && (
                                                <>
                                                    <div className="flex flex-col mt-5 gap-4">
                                                        {inspections.map(item => (
                                                            <button
                                                                key={item.id}
                                                                className="w-full p-3 rounded-md flex items-center justify-between bg-[#03364B]"
                                                                onClick={() => navigate(`/result-inspection/${item.id}`)}
                                                            >
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="font-bold text-white text-sm">{t('isp')} #{item.id}</p>
                                                                </div>

                                                                <FaChevronRight color='white' size={20} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {tabSelected === 'certificates' && (
                                                <div className="mt-5 gap-5 flex flex-col">
                                                    {userData?.userType === 1 && (
                                                        <>
                                                            <ProducerCertificate
                                                                certificateType='new-long'
                                                                userData={userData}
                                                                blockchainData={blockchainData}
                                                                imageProfile={imageProfile}
                                                            />

                                                            <ProducerCertificate
                                                                certificateType='short'
                                                                userData={userData}
                                                                blockchainData={blockchainData}
                                                            />
                                                        </>
                                                    )}

                                                    <div className="w-full flex flex-col bg-[#03364B] rounded-md p-3">
                                                        <h3 className="font-bold text-white">{t('certificadoContribuicao')}</h3>
                                                        <ContributeCertificate wallet={walletConnected} user={userData} />
                                                    </div>

                                                    <div className="w-full flex flex-col bg-[#03364B] rounded-md p-3">
                                                        <h3 className="font-bold text-white mb-1">{t('compromissoReducao')}</h3>
                                                        {itemsToReduce.length === 0 && (
                                                            <p className="text-white text-center mt-4 mb-8">{t('nenhumItemNaListaDeReducao')}</p>
                                                        )}
                                                        <div className="flex flex-wrap gap-3">
                                                            {itemsToReduce.map(item => (
                                                                <Item
                                                                    key={item?.id}
                                                                    data={item}
                                                                    type='consumption-graph'
                                                                    userId={userData?.id}
                                                                    invoices={invoicesThisYear}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {tabSelected === 'zones' && (
                                                <div className="mt-5 gap-5 flex flex-col items-center w-full">
                                                    {zones.length === 0 ? (
                                                        <>
                                                            <p className="text-white text-center">{t('nenhumaZonaCadastrada')}</p>

                                                            <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-2">
                                                                <p className="font-semibold text-white">{t('paraCadastrarZona')}</p>
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <FaMobile color='white' size={25} />
                                                                    <p className="font-semibold text-white">{t('baixeNossoApp')}</p>
                                                                </div>

                                                                <div className="flex mt-5 items-center gap-8">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <QRCode
                                                                            value='https://www.sintrop.com/app'
                                                                            size={120}
                                                                            qrStyle="dots"
                                                                            logoPadding={2}
                                                                            logoPaddingStyle="square"
                                                                            logoWidth={30}
                                                                            removeQrCodeBehindLogo
                                                                            eyeColor='#03364B'
                                                                        />

                                                                        <p className="text-sm text-gray-300">{t('leiaQRCode')}</p>
                                                                    </div>

                                                                    <p className="text-sm text-gray-300">{t('ou')}</p>

                                                                    <a
                                                                        className="py-1 px-5 rounded-md text-white font-semibold bg-blue-500"
                                                                        href="https://www.sintrop.com/app"
                                                                        target="_blank"
                                                                    >
                                                                        {t('cliqueAquiParaAcessar')}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {zones.map(item => (
                                                                <RegenerationZoneProfile
                                                                    key={item?.title}
                                                                    data={item}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {tabSelected === 'publis' && (
                                                <div className="mt-5 gap-4 flex flex-wrap justify-center w-full lg:justify-start">
                                                    {loadingPubli ? (
                                                        <div className="flex w-full justify-center mt-5">
                                                            <ActivityIndicator size={50} />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {publications.map(item => (
                                                                <ShortPubli
                                                                    key={item.id}
                                                                    data={item}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {userData?.id !== 'anonimous' && (
                                                <div className="flex flex-col items-center">
                                                    <p className="font-bold text-white">{t('cadastroPendente')}</p>
                                                    <div className="w-28 h-28 rounded-full bg-gray-400 border-4 border-white mt-5">
                                                        {imageProfile ? (
                                                            <img
                                                                src={imageProfile}
                                                                className="rounded-full object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <>
                                                                {userData?.userType === 7 && (
                                                                    <img
                                                                        src={require('../../assets/icon-validator.png')}
                                                                        className="rounded-full object-cover w-full h-full"
                                                                    />
                                                                )}

                                                                {userData?.userType === 8 && (
                                                                    <img
                                                                        src={require('../../assets/icon-validator.png')}
                                                                        className="rounded-full object-cover w-full h-full"
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-white mt-1">{userData?.name}</p>
                                                    <p className="text-gray-300 text-sm">
                                                        {userData?.userType === 1 && t('textProdutor')}
                                                        {userData?.userType === 2 && t('textInspetor')}
                                                        {userData?.userType === 3 && t('textPesquisador')}
                                                        {userData?.userType === 4 && t('textDesenvolvedor')}
                                                        {userData?.userType === 5 && t('textContribuidor')}
                                                        {userData?.userType === 6 && t('textAtivista')}
                                                        {userData?.userType === 7 && t('textApoiador')}
                                                        {userData?.userType === 8 && t('textValidador')}
                                                    </p>

                                                    <div className="flex flex-col w-[320px] p-2 rounded-md bg-[#03364B] mt-3 lg:w-[720px]">
                                                        <p className="text-gray-200 text-sm text-center">{t('statusConvite')}</p>
                                                        <p className="font-bold text-green-600 text-4xl text-center">
                                                            {accountStatus === 'pending' ? t('aguardandoConvite') : t('conviteRecebido')}
                                                        </p>

                                                        {accountStatus === 'pending' && (
                                                            <div className="flex mt-5 items-center justify-center gap-2">
                                                                <MdInfo size={20} color='#ddd' />
                                                                <p className="text-[#ddd] text-sm">
                                                                    {userData?.userType === 1 && t('paraEntrarAtivista')}
                                                                    {userData?.userType === 2 && t('paraEntrarAtivista')}
                                                                    {userData?.userType === 3 && t('paraEntrarPesquisador')}
                                                                    {userData?.userType === 4 && t('paraEntrarDesenvolvedor')}
                                                                    {userData?.userType === 6 && t('paraEntrarAtivista')}
                                                                    {userData?.userType === 8 && t('paraEntrarValidador')}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {accountStatus === 'guest' && (
                                                        <div className="flex flex-col w-[320px] p-2 rounded-md bg-[#03364B] mt-10 lg:w-[720px]">
                                                            <p className="text-gray-200 text-sm text-center">{t('vagasDisponiveis')}</p>
                                                            <p className="font-bold text-green-600 text-4xl text-center">
                                                                {vacancyAvaliable ? t('vagaDisponivel') : t('naoHaVaga')}
                                                            </p>
                                                            <p className="text-white text-center">
                                                                {vacancyAvaliable ?
                                                                    `Há ${amountVacancy} ${t('vagasDisponivel')}`
                                                                    :
                                                                    `${t('precisaDeMais')} ${amountVacancy} ${t('produtoresParaVagas')}`
                                                                }
                                                            </p>

                                                            {vacancyAvaliable && (
                                                                <button
                                                                    className="mt-5 bg-blue-500 rounded-md text-white font-semibold px-5 h-10"
                                                                    onClick={() => {
                                                                        if (window.ethereum) {
                                                                            registerBlockchain();
                                                                        } else {
                                                                            toast.error(t('necessitaProvedor'))
                                                                        }
                                                                    }}
                                                                >
                                                                    {t('efetivarCadastro')}
                                                                </button>
                                                            )}

                                                            {accountStatus === 'pending' && (
                                                                <div className="flex mt-5 items-center justify-center gap-2">
                                                                    <MdInfo size={20} color='#ddd' />
                                                                    <p className="text-[#ddd] text-sm max-w-[90%]">
                                                                        {t('infoVagas')}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="mt-3 flex flex-col w-full">
                                    <p className="font-semibold text-white">{t('voceNaoConectado')}</p>
                                    <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                                        <Dialog.Trigger
                                            className="w-fit py-2 px-5 bg-blue-500 rounded-md text-white font-bold mt-1"
                                        >
                                            {t('conectar')}
                                        </Dialog.Trigger>

                                        <ModalConnectAccount close={() => setModalConnect(false)} />
                                    </Dialog.Root>

                                    <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-5">
                                        <div className="flex items-center gap-2">
                                            <MdHelpOutline color='white' size={25} />
                                            <p className="font-semibold text-white">{t('ajuda')}</p>
                                        </div>

                                        <div className="flex items-center flex-wrap gap-2 mt-1">
                                            <a
                                                href='https://docs.sintrop.com'
                                                target="_blank"
                                                className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                            >
                                                <SiReadthedocs size={25} color='white' />
                                                <p className="font-bold text-white text-sm">{t('documentacao')}</p>
                                            </a>

                                            <a
                                                href='https://www.sintrop.com/app'
                                                target="_blank"
                                                className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                            >
                                                <FaMobile size={25} color='white' />
                                                <p className="font-bold text-white text-sm">App mobile</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {modalLogout && (
                <ModalLogout
                    close={() => setModalLogout(false)}
                />
            )}

            {editProfile && (
                <ModalEditProfile
                    close={() => setEditProfile(false)}
                    imageProfile={imageProfile}
                />
            )}

            {modalSignOut && (
                <ModalSignOut
                    close={() => setModalSignOut(false)}
                    success={() => { }}
                />
            )}

            <div className="hidden lg:flex">
                <Feedback />
                <Chat />
            </div>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if (!loadingTransaction) {
                    setModalTransaction(open)
                    setLoading(false);
                    if (logTransaction.type === 'success') {
                        getUserDataApi();
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>

            <ToastContainer />
        </div>
    );
}