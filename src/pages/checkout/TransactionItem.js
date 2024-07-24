import React, { sueEffect, useEffect, useState } from 'react';
import { api } from '../../services/api';
import Loading from '../../components/Loading';
import Web3 from 'web3';
import { LoadingTransaction } from '../../components/LoadingTransaction';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { save } from '../../config/infura';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useMainContext } from '../../hooks/useMainContext';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { ConfirmDescart } from './ConfirmDescart';
import { SendReportDev } from './SendReportDev';
import { ToastContainer, toast } from 'react-toastify';
import { ChangePassword } from './ChangePassword';
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCcw } from "react-icons/fi";
import { ModalPublishResearche } from './ModalPublishResearche';


//Services Web3
import { addProducer, addInspector, addDeveloper } from '../../services/registerService';
import { AcceptInspection, RealizeInspection, RequestInspection } from '../../services/manageInspectionsService';
import { GetTokensBalance, BuyRCT, BurnTokens } from '../../services/sacTokenService';
import { addSupporter, BurnTokens as BurnRCSupporter } from '../../services/supporterService';
import { addResearcher, WithdrawTokens as WithdrawResearcher } from '../../services/researchersService';
import { GetProducer, WithdrawTokens as WithdrawProducer } from '../../services/producerService';
import { WithdrawTokens as WithdrawDeveloper } from '../../services/developersService';
import { WithdrawTokens as WithdrawInspector } from '../../services/inspectorService';
import { GetInspection, GetIsa, InvalidateInspection } from '../../services/sintropService';
import { addActivist } from '../../services/activistService';
import { addValidation } from '../../services/validatorService';
import { Invite } from '../../services/invitationService';
import { addValidator } from '../../services/validatorService';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function TransactionItem({ transaction, attTransactions, walletAddress, userData }) {
    const { impactToken, impactPerToken } = useMainContext();
    const [loadingData, setLoadingData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [additionalData, setAdditionalData] = useState({});
    const [modalDescart, setModalDescart] = useState(false);
    const [modalDevReport, setModalDevReport] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [modalPublishResearche, setModalPublishResearche] = useState(false);

    useEffect(() => {
        if (transaction?.additionalData) {
            setAdditionalData(JSON.parse(transaction?.additionalData))
            console.log(JSON.parse(transaction?.additionalData))
        }
    }, []);

    async function executeTransaction() {
        if (transaction?.type === 'register') {
            register();
        }
        if (transaction?.type === 'accept-inspection') {
            acceptInspection()
        }
        if (transaction?.type === 'realize-inspection') {
            finishNewVersion();
        }
        if (transaction?.type === 'request-inspection') {
            requestInspection();
        }
        if (transaction?.type === 'buy-tokens') {
            buyTokens();
        }
        if (transaction?.type === 'burn-tokens') {
            burnTokens();
        }
        if (transaction?.type === 'invalidate-inspection') {
            invalidateInspection();
        }
        if (transaction?.type === 'dev-report') {
            sendDevReport();
        }
        if (transaction?.type === 'withdraw-tokens') {
            withdraw();
        }
        if (transaction?.type === 'invalidate-user') {
            invalidateUser();
        }
        if (transaction?.type === 'invite-user') {
            inviteUser();
        }
    }

    //Register
    async function register() {
        const response = await api.get(`/user/${transaction?.wallet}`);
        const userData = response.data.user;

        if (userData.userType === 1) {
            const addressData = JSON.parse(userData.address);

            setLoading(true);
            const addressPdf = await pdfMake.createPdf(generateAddressPdf(addressData, walletAddress, userData));

            addressPdf.getBuffer(async (res) => {
                const hash = await save(res);
                setLoading(false);

                setModalTransaction(true);
                setLoadingTransaction(true);
                addProducer(walletAddress, userData.name, userData.imgProfileUrl, hash, addressData.areaProperty)
                    .then(async (res) => {
                        setLogTransaction({
                            type: res.type,
                            message: res.message,
                            hash: res.hashTransaction
                        })
                        try {
                            setLoading(true);
                            await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                            await api.put('/transactions-open/finish', { id: transaction?.id });
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
                        if (message.includes("Not allowed user")) {
                            setLogTransaction({
                                type: 'error',
                                message: 'Not allowed user',
                                hash: ''
                            })
                            return;
                        }
                        if (message.includes("This producer already exist")) {
                            setLogTransaction({
                                type: 'error',
                                message: 'This producer already exist',
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
            })


        }

        if (userData.userType === 2) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addInspector(walletAddress, userData?.name, userData.imgProfileUrl, 'geolocation')
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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
                    const message = String(err?.message);
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
            addResearcher(walletAddress, userData?.name, userData.imgProfileUrl)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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

        if (userData.userType === 4) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addDeveloper(walletAddress, userData?.name, userData.imgProfileUrl)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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
                    if (message.includes("Not allowed user")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Not allowed user',
                            hash: ''
                        })
                        return;
                    }
                    if (message.includes("This developer already exist")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'This developer already exist',
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
            addActivist(walletAddress, userData?.name, userData?.imgProfileUrl)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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

        if (userData.userType === 7) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addSupporter(walletAddress, userData?.name)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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

        if (userData.userType === 8) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            addValidator(walletAddress)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    })
                    try {
                        setLoading(true);
                        await api.put('/user/account-status', { userWallet: walletAddress, status: 'blockchain' });
                        await api.put('/transactions-open/finish', { id: transaction?.id });
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

    function generateAddressPdf(addressData, walletAddress, userData) {
        const location = JSON.parse(userData?.geoLocation);
        const propertyPath = JSON.parse(userData?.propertyGeolocation);

        let arrayPathProperty = [];
        for (var i = 0; i < propertyPath.length; i++) {
            const rowTable = [
                `Ponto ${i + 1}`,
                `Latitude: ${propertyPath[i]?.latitude}, Longitude: ${propertyPath[i]?.longitude}`
            ];

            arrayPathProperty.push(rowTable)
        }

        return {
            content: [
                {
                    image: 'data:image/png;base64,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',
                    width: 150
                },
                {
                    text: [
                        {
                            text: 'Wallet Produtor: ',
                            style: 'label'
                        },
                        `${walletAddress}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Nome do Produtor: ',
                            style: 'label'
                        },
                        `${userData.name}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Área da propriedade: ',
                            style: 'label'
                        },
                        `${Intl.NumberFormat('pt-BR').format(Number(addressData?.areaProperty).toFixed(2))} m²`
                    ]
                },
                {
                    text: 'Coordenadas e endereço da propriedade',
                    style: 'title'
                },
                {
                    text: 'Coordenada central:',
                    style: 'label',
                },
                {
                    text: `Latitude: ${location?.latitude}, Longitude: ${location?.longitude}`,
                    style: 'description'
                },
                {
                    text: 'Coordenadas dos limites da propriedade:',
                    style: 'label',
                },
                {
                    table: {
                        body: [
                            [{ text: 'Ponto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenada', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...arrayPathProperty
                        ]
                    }
                },
                {
                    text: 'Endereço:',
                    style: 'label',
                },
                {
                    text: [
                        {
                            text: 'CEP: ',
                            style: 'label2'
                        },
                        `${addressData?.zipCode}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'País: ',
                            style: 'label2'
                        },
                        `${addressData?.country}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Estado: ',
                            style: 'label2'
                        },
                        `${addressData?.state}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Cidade: ',
                            style: 'label2'
                        },
                        `${addressData?.city}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Rua: ',
                            style: 'label2'
                        },
                        `${addressData?.street}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Complemento: ',
                            style: 'label2'
                        },
                        `${addressData?.complement}`
                    ]
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 5
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    marginBottom: 15
                },
                title: {
                    color: '#0a4303',
                    textAlign: 'center',
                    bold: true,
                    fontSize: 22,
                    marginTop: 15,
                    backgroundColor: 'green'
                },
                subTitle: {
                    color: '#0a4303',
                    textAlign: 'center',
                    bold: true,
                    fontSize: 14,
                    marginTop: 15,
                    marginBottom: 5
                },
                blackBold: {
                    bold: true,
                    marginTop: 10
                },
                label: {
                    bold: true,
                    color: '#0a4303',
                    marginTop: 15,
                    marginBottom: 5
                },
                label2: {
                    bold: true,
                    marginTop: 5,
                    marginBottom: 5
                },
            }
        }
    }

    async function acceptInspection() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        AcceptInspection(String(additionalData.inspectionId), walletAddress)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })

                const dataNotification = {
                    text1: 'Accept your inspection',
                    text2: 'Wait for the inspector at your property'
                }

                if (res.type === 'success') {
                    api.post('/notifications/send', {
                        from: walletAddress,
                        type: 'accept-inspection',
                        data: JSON.stringify(dataNotification),
                        for: additionalData?.createdBy
                    });

                    registerInspectionAPI();

                    api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'accept-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            userData,
                            inspectionId: additionalData?.inspectionId,
                            hash: res?.hashTransaction
                        }),
                    });
                    await api.put('/transactions-open/finish', { id: transaction?.id })
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if (message.includes("Can't accept yet")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Can't accept yet",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Please register as activist")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Please register as activist!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("This inspection don't exists")) {
                    setLogTransaction({
                        type: 'error',
                        message: "This inspection don't exists!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Already inspected this producer")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Already inspected this producer!",
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

    async function registerInspectionAPI() {
        const resProducer = await api.get(`/user/${String(additionalData?.createdBy).toUpperCase()}`);
        const producerDataApi = resProducer.data.user;
        const producerData = await GetProducer(additionalData?.createdBy)

        const producer = {
            name: producerData?.name,
            totalInspections: producerData?.totalInspections,
            recentInspection: producerData?.recentInspection,
            propertyAddress: JSON.parse(producerDataApi?.address),
            propertyArea: producerData?.certifiedArea,
            propertyGeolocation: producerDataApi?.propertyGeolocation,
            proofPhoto: producerDataApi?.imgProfileUrl,
            producerWallet: producerData?.producerWallet,
            pool: {
                currentEra: producerData?.pool?.currentEra
            },
            lastRequestAt: producerData?.lastRequestAt,
            isa: {
                isaAverage: producerData?.isa?.isaAverage,
                isaScore: producerData?.isa?.isaScore,
                sustainable: producerData?.isa?.sustainable
            }
        }

        const propertyData = JSON.stringify(producer);

        const zones = JSON.parse(producerDataApi?.zones);

        let pointsSortedZones = [];
        for (var i = 0; i < zones.length; i++) {
            const pointsToSort = zones[i]?.pointsToSort;

            const sortAnaliseBiomass1 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBiomass2 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBiomass3 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBiomass4 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBioSoil1 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBioSoil2 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBioSoil3 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBioSoil4 = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseTrees = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseAudio = parseInt(Math.random() * Number(pointsToSort.length) - 1);
            const sortAnaliseBio = parseInt(Math.random() * Number(pointsToSort.length) - 1);

            let data = {
                title: zones[i].title,
                analiseBiomass1: pointsToSort[sortAnaliseBiomass1],
                analiseBiomass2: pointsToSort[sortAnaliseBiomass2],
                analiseBiomass3: pointsToSort[sortAnaliseBiomass3],
                analiseBiomass4: pointsToSort[sortAnaliseBiomass4],
                analiseBioSoil1: pointsToSort[sortAnaliseBioSoil1],
                analiseBioSoil2: pointsToSort[sortAnaliseBioSoil2],
                analiseBioSoil3: pointsToSort[sortAnaliseBioSoil3],
                analiseBioSoil4: pointsToSort[sortAnaliseBioSoil4],
                analiseTree: pointsToSort[sortAnaliseTrees],
                analiseAudio: pointsToSort[sortAnaliseAudio],
                analiseBio: pointsToSort[sortAnaliseBio],
            }

            pointsSortedZones.push(data);
        }

        const addData = {
            coordsToAnalise: pointsSortedZones
        }

        console.log(addData);

        try {
            await api.post('/inspections', {
                inspectionId: String(additionalData?.inspectionId),
                createdBy: String(additionalData?.createdBy),
                createdAt: String(additionalData?.createdAtTimestamp),
                userWallet: String(walletAddress).toUpperCase(),
                propertyData,
                zones: producerDataApi?.zones,
                additionalData: JSON.stringify(addData),
            })
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingTransaction(false);
        }
    }

    //----------- FINISH INSPECTION ---------------------

    function generatePdf(infoData, resultIndices, resultCategories, resultZones, inspection, indices, pdfData, isas, proofPhoto) {
        const {
            bodyInsumos,
            bodyResultInsumos,
            bodyDegradacao,
            degenerationCarbon,
            degenerationWater,
            degenerationSoil,
            degenerationBio,
            saldoCarbonAnaliseSoloZones,
            saldoSoilAnaliseSoloZones,
            bodyAnaliseSoloZones,
            bodyCoordsZonesTeste,
            bodySampling1,
            bodyAguaEstocada,
            totalAguaEstocadaZones,
            totalCarbonEstocadoZones,
            bodyVolumeZones,
            bodyResiduos,
            bodyIndices,
            bodyBio,
            bodyCarbonoEstocado,
            volumeTotalZonas,
            estimatedTreesTotal,
            bodyEstimatedTrees,
            bodySoilBioPhoto,
            bodySoilBio,
            totalSoilBio,
            rowPhotosZone,
            totalWaterSprings,
            bodySprings,
            rowAnaliseBio,
            totalBioZones
        } = pdfData;

        let isaCarbon = '';
        let isaWater = '';
        let isaSoil = '';
        let isaBio = '';

        //Transforma o isaindex em uma string legivel;
        if (isas) {
            if (isas.carbon === 0) {
                isaCarbon = 'Regenerativo 3 = +25 Pontos de Regeneração'
            }
            if (isas.carbon === 1) {
                isaCarbon = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if (isas.carbon === 2) {
                isaCarbon = 'Regenerativo 1 = +1 Pontos de Regeneração'
            }
            if (isas.carbon === 3) {
                isaCarbon = 'Neutro = 0 Pontos de Regeneração'
            }
            if (isas.carbon === 4) {
                isaCarbon = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
            }
            if (isas.carbon === 5) {
                isaCarbon = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if (isas.carbon === 6) {
                isaCarbon = 'Não Regenerativo 3 = -25 Pontos de Regeneração'
            }
        }

        if (isas) {
            if (isas.water === 0) {
                isaWater = 'Regenerativo 3 = +25 Pontos de Regeneração'
            }
            if (isas.water === 1) {
                isaWater = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if (isas.water === 2) {
                isaWater = 'Regenerativo 1 = +1 Pontos de Regeneração'
            }
            if (isas.water === 3) {
                isaWater = 'Neutro = 0 Pontos de Regeneração'
            }
            if (isas.water === 4) {
                isaWater = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
            }
            if (isas.water === 5) {
                isaWater = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if (isas.water === 6) {
                isaWater = 'Não Regenerativo 3 = -25 Pontos de Regeneração'
            }
        }

        if (isas) {
            if (isas.soil === 0) {
                isaSoil = 'Regenerativo 3 = +25 Pontos de Regeneração'
            }
            if (isas.soil === 1) {
                isaSoil = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if (isas.soil === 2) {
                isaSoil = 'Regenerativo 1 = +1 Pontos de Regeneração'
            }
            if (isas.soil === 3) {
                isaSoil = 'Neutro = 0 Pontos de Regeneração'
            }
            if (isas.soil === 4) {
                isaSoil = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
            }
            if (isas.soil === 5) {
                isaSoil = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if (isas.soil === 6) {
                isaSoil = 'Não Regenerativo 3 = -25 Pontos de Regeneração'
            }
        }

        if (isas) {
            if (isas.bio === 0) {
                isaBio = 'Regenerativo 3 = +25 Pontos de Regeneração'
            }
            if (isas.bio === 1) {
                isaBio = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if (isas.bio === 2) {
                isaBio = 'Regenerativo 1 = +1 Pontos de Regeneração'
            }
            if (isas.bio === 3) {
                isaBio = 'Neutro = 0 Pontos de Regeneração'
            }
            if (isas.bio === 4) {
                isaBio = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
            }
            if (isas.bio === 5) {
                isaBio = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if (isas.bio === 6) {
                isaBio = 'Não Regenerativo 3 = -25 Pontos de Regeneração'
            }
        }

        return {
            content: [
                {
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZoAAACcCAYAAABGKG3KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAADYSSURBVHgB7Z0HYBzVtffPnd2VZEm2ZSELGxQQtnCR3MDAe3kQMCUBQrBDQCS0hBLKI+GFvBRIQhFJKB9JeAnJCwQIEMIjCQ4x3aEZQyAUG+y4yAUZV9wkN1lW29253//uzu7OzM7W2VVZnR+Mp8+Optz/nHPuPVdQgXPvvXXF22q85UUlgWEe8hwupTgsiIGEPFhIGiWJRgpBw9S2wr6zluaP6PRK01mr7yGGYRgmDi8VGE1P1hf1ePVan08/SgrxuTZJU3xENTLorQoKKlJyEhYUEfk/MZLSQ5PbiWEYhnGkIISmqYm03mPrp2lSnh6QwTO8JKaj9B8VEhGTkkhKISwMwzBMzhnUQqMExn/UuKODmu8Gj66fgkWVqaWE5YZhGKYvGbRCc+O8SbUBL/0KcZbZCbUjQ02J2zzt/UWAGIZhGEcGndBc++To8pHDKhs9Ot0FIahOtF1K7cmhYSOl3EwMwzCMI4NKaL77t/HVPuG52aOLqyESvsjykGbkyyOWxnE1oj3EMAzDODJohOa6e6m42Ot9BNbDmZKkELbS30kPEgtQxqrUg+1bsd+hzjuKncQwDMM4MiiE5rsvTSsr6uq9U0r9TAhM2PMlJaayM2GSyYxlHX6QNPFPTH2MmdmJdtOJNhLDMAzjyKAQGl9P95dgxFwjUigLtIfsWyQWFayRyRrSyE+wyT2QGh3H/Da2q3DcTNAB6vRvIYZhGMaRdNu+9xvff6quRuh0r4rJKCGRpkaUUjq0qHRqZJluw8vwxlugPd+nRatrYc2M0oT8ORYelnhzWiKC+/YSwzAM48iAFhrVTkbzeH4JJ1lFom3sYpOupkjTBITFj6n34Za7TBzYNVlq+kvimMkLsOwm/LYn6YElLbq1sfUAMQzDMI4MaNdZ59TJx3mkPktNS5FB+N7mL3OqFKCMI6jsXp3k+1KKX2tlXa91tWrFw0oPuhDuslux7SGpfwiH0ehVuNYyspkYhmGGEgPWolGxfk0Ev48S/KDwgphRYfeYZWjVbEUgZz6sl294BR314y+sPkNbvGq+3lV0cklZ0YtSiN9BkQ5xPEb8wh1d+3veJoZhGCYhAzYXy3eemFDlK6GnJckyFeGPKKI52G8N/BsVnoWIJLjcrwnq0CXtxfI2KbRtXhncGPD6Nu6sLt70wDEf+JuenVkqPR1fgKZ9FXufin1K7OchkizAfk/d9vnm84hhGIZJyIBO+nX9vNqKZOsdV+6lbjXaOvWgoBIT++pbH68boY/wHqVpdAoMFCUSR0Jkwo0/nVrIUAKE7NaDdP6Pz179HDEMwzAJKbjskk2P1JZ0V5SM0Uir0LQgxnQEeehQxGEmwgKqxyZ1GIrM+0Qbfya4Go6Lpfwnle06venk1g5iGIZhEpLXygCzmmZ5G474aCRR8UGeYm0y6TRZ02QtQirVQogyxNAr4eryaiSibjD7WPnMopMWvxlVYT9vZFu42EoxNSKAmfAfpYc2UpUIIrEVKY1jxbW1kSSSaG58sk2pC6E9dCuLDMMwTEpyKzQor699tPZg8olpHhLHE22CBVE8E6LyKdKlN1SYy3CRHul8zFLwW8aG+BilfGxSWObJvNz5nNK021I14DQj3pKlrXOJYRiGSUlOXGeNTVQ06ojDjisiz5elh04TUoyHSviiumEoS2hkWCVmy8W8LCI8ZkEhU/kfTQ5g04TY8eL/JPsiJ6tGOB2UnLahA1owePIts9cuIoZhGCYlroTm2ifry2VndyMO8m24uCZgXBwTB0EWoYmMjeVWF5mwiYxp/7jlMeslUQ00u9ikIzTGWZg2cAbHuv3WM1fdzG1nGIZh0iMr15lqsb/tiNqz9c6uH6LAPQbFb6j2caRhZMgDJWM5lq2JKsMz0bxkCV1bCVbkoDuARFmdU8VqwLv7Kvbfng+RmThx4iFSynFer3cshLLUvE7X9Tas2x4IBD5qaWlpJ4ZhmEFExkX2Vb87fKxW7PkFiuULogewWx9ktV5ibrPIuuTus8hxhRBWb5bN/ZbIfWb+Dad1sfOmOBJaNVJuCvSIE28/d9VGyhEzZ870dXV1qWSh38TskZT6fgQgOO9i/IPm5mbVUJStKoZhBjyetLfEx/4VtbVneDTxGuaOs7u5jNk4F5fVbUaJ4zROMRkhLMKTzC0XP51caBIuM/1rMsOW9er6nDvOWbOOcgQsmOGwVObhPK+jcPaDVCKj0LC9SvB5aVVV1d62trb3iGEYZoCTVgqaxkbyXPlo7dUeKf6G0rlSLZPGP+FxohQw0lIzzFzN2L6bdBzLBN/s0mHKtkVcnpqkh0m4CJK2yEPaVXfOXruacojH47kKo9MpCyA2Grhl7NixVcQwDDPASSk0jU/WF4084/AbUAL/BrPDEouDtIhJnAhJ67YWLKpFyTIlx6+XjpMuiZ7si3Sgc/YtZzXnw3K4iNxRWVFRMYcYhmEGOEmFRolMRXvXnUKKH6HQ9URlQo1shb40xMIiNmRe57R9eJxMIBJpkHSyamSK46SxzDh2qybpm+2V+89rOn/Ddso9RbBK6sklsGpOIYZhmAFOwlpnjU+SZ+S+jmuk0K6B/6g0VEHMKPWFUe0qVsOMrDXJyFYDzajPReHNjIpjxk4mpGU9JczvH1eVzTRtWWzv7jn+J+3LAlKTj1EgeM8tZ69pzlcV5jpAqiq4SxDjmUIMwzADnIRCM3zvEeeSpt9DqsKAYVFERUSaxIZsemCq1hwhvD6uib+162WrMjmLgo00Nklze9mOFW/oveKen56zZqFa8hPKH0VFRWMoB8CiGU0MwzADHEehuez+w+pR6N8npfCYqxA7WgsR0SBbGxqTqIiEBknsiAkNFZPVFJ8hJn7/9NVHBnH+rboun9F1+u0dc9Yso74jJ0IDxhLDMMwAJ05oLm2qLZEe/b5QwktDQaLWjINlY2S0JCEcjBJp2i9SY9hJUSKYTCPr6mRzybG7z7DvRsy9I3WxwE/a63fNaW6hvqeIGIZhhghxQqONld+AKpyopqWIRVYs8ReLlSIt62OWRWxBNI5DYbca2Y4V+gWRuSss1Q7qpzUh9uLYm4KS3iVNPOfT/P8S71+8tampSad+AsLXb7/NMAzT11iE5msPHjZT6nSzWUNCOiDCqVmkg0CEVguz/8xYJ6zxm6hFY/q98PEc1CLz4IsquHeRRtswvQFWzDr83qqALhf5tOJtbYcU77Z2gtZE/YnH4/kkGAxSDthLDMMwA5yY0DThe1+X/40SfmRUREQs7hGKukREhGIt+6WpbnFYH4QpxhK2iEKVA8zbxVs1KDDlcmzcjC23wZKqwrhcho+/BWIUiBwVIrJHk9SL+NFeTVB70CPbNF22eYpFT6Ar0DGMSrqazm/upQFMIBDY5ZRlOgvyUfWaYRgmp0SF5uJDDv93lOJn2GuSRXQlEnMJYbNwrJZObCZ2HEv1siCmdmL8D0HaP3Tdv+Cglk2rm5poKLmTWnCdVGWE9FMAOYBjrCGGYZgBTlRotIB+FWyaWHoZMtXysru+ZCx+E8l3bI61kLS1mxGh5QEsXEWa9iD1Hvjzry/f3kpDlObm5o6GhoaPMDmJ3PEuMQzDDHBCQnPJfQdXQy7ODmtF+N+woIiYRWMIiXk+tr2wxm4ijTRj9ZG3BIP67WNrax9qOnlhgBhljTwNi+ZGyp5uDH8lJi/U19eP0XW9hLIA97Z3zZo1yq3JlT4YhiIWjfSdBk2oFKYAv4w2SlGiIhwsGmPe8LEpUXGuSSb/GQwEr/791zevINpATBhN0x5DQXYuxOZIyo4/wzLqj6rZQwLclz/hHtVSdjTX1dVdwH0HMUwYb+M9NcPwUp2vZkw6Q1bRkSGxiW4TaYhp2cdWgyBco+yJgN5xzcNfb9tPjIUVK1aswlfzObj2D0FwjlMZmdPZD1/L+zD6fW9v723E5JNa3JNayo695eXlad1PhhkKeIf7xKiAFJ+2r5CmSlFCRuqUkU1khEVtok0tQyKj/ZX83Vc+fHVbJzGOwCJZCbE5CZNHYTgGIjIFhds4im/Q2YZhXTAYXAZR+vDCCy9c25/tgBiGYTLB261pEz0kq+0r4t1o1uUyVu+Z4hq9aPK5fb0dl839RiuLTAogNqoq9nvGkBYQGWIYhhkseL2kT9ZluP2LjNYhcxaX0PLQAopaNeFl0qggoGI5YpPopbsgMh3EMAzDDHk0XZeT1YSM1iEz/jN1FCPtgzEhI4OxUWi/oP7ow9dufIcYhmEYBnhhgdSZawEI04Qkaa0hQBSzeMwby2h8ZovQ/U/mqx8XhmEYZvChQSJqzQvMVktkMJsz0vyfNFk+UnXERSuKfYeuJYZhGIYx8CKoUpHI/IgaLOa0/g4bm7pVXvnA1ebklQzDMMxQxyuTdMIl7ROpHGJCDtm0Mkx21NfXq6rclV6vV29vb+/FuKulpaWHmAFHXV1dcUlJSbXf7x/l8XiGqWW6rgdwz7ZMnjy5be7cuTlJSZ4O6rnp7u4eVlpaWoKxD+fjE0JUapoWTasVCAT0oqKi3ZjsxXn6Ozo6ejDu3rJlSxcxfYpXysTqEamJlhqjVQ1HZgYNKDRGo4Coz2CXbatXr86lW1TDORyBwuFKPIPnolAoKSsr243pDSi0VmH8+v79+xd/8sknqqDgJ8tgwoQJh6IwrUt3+56entXr16/fQS5AoV6OAnomfvdruC/n4LmpiKxDAa/Epm3lypXP4b7dtmrVqo2UB5SwBIPBKjwvU3Aeqt1fPUTvcPx2TXFxserSPK4zQZ/PF3Hv69ivbfjw4W2Y/gTHWoP9luF4iyCaG4BqBM3PWB7xJltpFhnpVGGAzPnOVGInOZyYQQG+9Gbi5ZuHyXTzeS2DMJwFa2MLuWDWrFnerVu3Ho1C4EeYPQ1DqanLhBpMT8MwG9M3jBw5chuG91A4PNjV1bUABUI3DXFQsJ+AgvbP6W6PL/7F06ZNO2vZsmU7KUMmTZpUi986D5OX4ncnUoLyAverCqPLMF6P8U8oR6hnZefOnRMwOQfH/pLxYVRKGWJk3VBtBasxrY7xWSWQ+Nt0PIebIDzNWPZXiM/b+JhSaZ36pDF0Q0PD69TPqCzyGLbiuqiPkY9wDdbio28zrMStubT8vDILHY/UDXD4BvgUMYXKNIjTWRj/jrJAfRXjYT4dBcfFeLk/R2kUGNh+LEZfxHAGCsy38MX8E3wx/4P46zNtUIgcjYLjGkz+lNIoQGtra0twrY/HpBL72Zmk4cFvvUQ5QFkvKPBmtba2XqqeGSyqpDxgCFCtGnDup0N41uEZexfL/7e5uXkx5V9wZlE/oz7yzH1j4Rr04j3fgeFjCOES3IdXsf4Vo2F59r/zlV/VOL60FiFJVAkgTqXkh5375Geeb9rGGQFSgK/MGpjuf6TseRTuij9QluBlPiNDi0bd7w/wwB1DmeHBA9uIfa/C7x2L+XLKnk4c5yednZ2/zIV1g/M6Hud0mtM6/M53KftzVe6+h3DslO8BXuRNGP1fui8yCsIvZ2LRGGzGs3ZaMtfnuHHjRg4bNuzzmLwKg7rHGf3t6qsY1/Mwt3GaKVOmjFf3GJNnk7tnxQ29OIdHML4D92UT5Qlcr8HwwdSDa7ECz+kv8Nw9la3gqBhNG5SkKulWMl5UHC0hXdQPG6GrwuQNYpLS29vrhfk+i7IE92Mh9TEoOGdCoE7Aw/ZWqm1Hjx5dXlVVdQkezlswOyZHPYoqN9ud+OI+Zfz48RevW7cuY3eQGRzrs7iOt1LuUV/g35dpuAtwDkth4SnBz2evsJ/Cffh/sFYusAu0co/hOfwWJr9O7gr2Z92KDJ6ty3HN/geTI6h/KcJ9uRrjiyDs18KKdvNBONgpVu89npEnMK3cjJfj/V9AGXoVlOkYShUTaz8jnQeyta0xMC/XBZXoUrt5VlPy2A8zqGmiuOR2UcSRRx45Dg/jndXV1R+hcPstJanVmC1KIBAAfg+/cxgx6TIbFsscNYFY2wh8TV+A4SUUIMrKuZ5cWg+4J69Slqi+fzA8hMkHqP9Fxkw5nuGHcJ0eJOIyDaj37WXcq/vGjh2bUaxMgz4EpZOCmIg22qT4Bp0Rayc66PLEytJDziWmUJk1derUibZlGiyMT+GF/AV8u28bHbrlXGDMqNgBnjdV02ksMSlR8QgMN+F6fRv36C1cu8exWMXKfOQSHKtL1eKiLDCqt6suLy5z27V5nijC33cZzvMBVb2bhjjGc3R1ZWXln5S7Nd39NDwln0Rm7FaLOZeZVVhs1k9kva7GwqdL/aez764+npiCQxUGKFSUWyFUKwg+9WPU1ygsjBVY9G3Ks8CYwdemqqH2IH4/L8HiQsOoGnwPxlPT7f8oTZb6/f5sYhnKMr4Pw5U5Pp+cYgjgVyHQP1OVWohRzC4pKfmNso7T2VjTSbRFhILsLjFysGZMChSXrsZYL0nUka498IU7qj9NTMGBe3w+fPtXtra2PobpV/Aiqq/RfnF5qGC+ETzOSRCIyYqXs2lki0L7Soy+JnIUwMsnSmwwXIFn7auNjY0D0fLqD86F+H6T0nj3NFggW53cYpRAYBytGyMHWmR9eFLVV9f+/vnbD76QYzaFBV64Q+Db/w0mL8BQQf2LClZejkIrk8anTO5QVYDnU4bAhae6ML97gLrLElEKi/DHK1eunEaMKgdU78zfg1djUqptNUFyQzJxsQsMmVxpeshdFonNROaNcWhfFdgTj5f5xiw4/adjjiOmkCiiAQIe9hIMP1dtQIjpa7YYFQoyAvfrlxjS9vEPIA7CcDcxESpQ1t+j3OjJNtJkQGyIJWCW8dYLWdvUWFxsUsalQYsJVHSB0HX5GaHLdz53W/VbpzWNvvz026vG1t3LgTUmp5yGONEsYvoUvOsfLl++fF8m+xhtgWbRIEW5a2FAX0xMhNN27NiRtH2dl0TvRyS9yvw1gnEyPpkm2cTGvJ0k2zi2k5SWeVhPdLxG4njdL1oPb9v35uE3Vf5LF7RGC8htUngO6Hpgd0+P3r5vS3tH89y8titgCg8vCq8voQBY4LYVM5M2Utf1FymDFvSqWqxyt0CgMk4lM8D4Bp61p/GscU/CePdwT6+tqan5V6K0NV6/Xtzm8wQ2QKfHqQV2kTHPx6Zl3DK7+JgPE1d7WtJoQeJcXXjOVYk4g7CrsLJDCu8uXxHtrzyicv8JN9AncMNtwRO8RQp9sy5Fq6eL9grZ1S67i/YXr2tvX7iQAsQwBhCaU3p6elROK1f52Ji02YUCJqPedKuqqo4NBoNHUX5QLfr345xU4a9KGyVq5fkQNRy3Acc9A5N/JUbxheHDh9dg/JHTSm/xEZt3BDYdshjWRkho4qwYY0KaJiziYlpnj+FYXGiRfSyVB6LH8sLDpoLKFar+QihrtLEi1FmnrpGm42hFokenYV2yiHoOzBjVfew02iwFbcW2m3WSm4Su7fRL/yb/flq7+rH9u4gZaowvKSlRsUAWmr5hxe7du9dnsL0XFtA1uazKjFJhPY73DIb5fr//o9LS0g4sC/WJhWW+zs5OHz5AVJX7Ew133amUm9Q2KoGwyiH3FFlKzaEJrvUoXF+VzslZaOaeT8FzfiFfJV2crxZYrljUcJFWC8fJknEQmehh7NaR/QDSuijRX4INSkJDZFdBtZGDK8tIimDAJ7Qu73A6MP0bIyBA4n0Y9+/6pfxg1f0dK4jpbz5WjSwx3qtqrmF6IsYzKIetwXFMVZD8Lc1tl2N41Gkdzksl88y2Rt12HFe1lE9pceN3tvf29g5ky1xVW1Zt7dqNefX+qY9S1ZBxOXzzB9I9EFxNUzDKSfs6XLdWiNZ9iMv9Zs6cObuampqSue+2Yviwrq7uvqKiIpWO51ZVRZ9cVmjBOfwbjnmo24zmWbIaf8NfMthe/a2fUm2pMFa15nLebgnno/LT3ee0LlRTIOgJPuvRvXeRytHkIAoWq8QSk5EWcSGyxmVi7jLpUB06wcmSjLOYTD9tW2Y3lwQsIzkcS4cLKdRXzNGStGu82G7q1SP2Yt08PI3P7JHlr2x7gBN/9hV4AN/E6J7q6uoXFi5caClUVQM4vPhfRqFxl5Fu3u1vpe2WWblypfoafcppXUNDwyxyITQo0K5bunTpXhp8qPvzPtxbz+G+/B0xiOWYt+cwUw11T8E22ygzTqAcZHjHPX4Xz8tXV61aFfp6XrJkSVr7GW19VDcAl+C5exTjP7t85sp9Pp9ynz1Efc923JsmyoKJEyeq5gmqkaybxLFOfFa9z05xq5CqHb13ZysK/2ejoqEW2hXBPGu2XIhi1o5JpMziZLVo7PEdW+UD27ZJhYXixchJKEMIVWiIyzQST1fSgdb6q4Y/M+nK0i+MbhzNLX1zT0B1YIbx/2DcgAfvJAzP2EVGoR7KFStW/B6FmvrSyrg9hgMNxGSKim2ofn/+s7u7exwE+PjVq1ffhXuzlOJFRhHAPXsZ2yxP9weM6q+fJZfgHN8KBAJnR0QmW/C3vaa6BiAj12O2oLC+OFXV3oHGmjVrtuLvvw33ejylaf2niUrSfJbTipDQNDWpPsv0+2QovbmMWSTkICjSJERknjdm41xmMesmTiek42RKJCU6lkz3OKXYcLZGnueqRnTPn/j10ivqLhpWQ4xblMC8gZfvO5g+CQXWf+OBbk5nRxRcO7Cvyt7rqhdPlaFg6tSpo4hJidGNwbMYLsRwIm7V/evWrdtMeWDbtm2qksZ/kAvwbKhErZeuXbu2jXIAxOpDHFM1PM66liLOp37Pnj3jaBCisp/j7/8ahocpR+CZOsFpedRPN6Nr+2LcykdQAId8nQm9U6F/bFWbyWqtOFkz5vlk651+k1JsEqdhFjeeaZocfk/QCRCc+70l3nkTrii7hC2czMHD1YWH9WnV50l7e/uZEI17s+nHA/tspxz00IiYx3hiUrEA7qez8TFwjnIh5rtKOArk49y6RvGMXY9nax3lEDyzv8Yoa3HFOVX5/f7pNEgx3Fzfwr15k3KAqo3ntDwqNMqq0Tv990ghPjSLTNy0UyNNh0LcIgQOquUoDI4BmQQWTKJlRE6etFQ7KtP3GI20x0aN6HphwqWlxxKTEjxUqkOkmzFMOv/888+FK+UNt92/wuf9eriPpOyB/3k0MYloxv06B9d4jtGvSF90WywgNKeSOxYffPDBL1OOUW4kXIvnKXtUnq9BnfVEiQ0E9yuYdB1TxLU8wsjIbcFS8+DZprat0hPqYW+zxVpxEpmIGy3isrJXADBldjYvtwqXyQ4yueXiLJTwL9jS5NjdZPGVFuwWlqViApHDWKraayeiBH1hwmVlP6BG4uR5CVC1tWA5nIGg8J3KeklR6ydt8HXYitH75AIUpNXEOIL7Ng8uoz5taIjgs/ISuPrqR0F4l1OMLxfgg+n/yAXYf+Jg70IAz4Sq2HE/uQTXYjhiP4fbl8dVcXv2O1uXkBRfkeEqjbE4i11kKN6icSTZuiSro71HyxTbp2HVOK5PeiCBL2Jxx4TSskeP+HrZwcTEgQdqL3zln7jtVdGO4cJJK66TCHw9cybnxPipj4G4qerrUyl7dsFafobyBFyHi4zKK1mBfSd5vd5B73LHR95v8F6vJxeoxrElJSV19uWOdamfuXHrP0kXXyZT4xsH71fcgkSxF2neTjocy2TdOLrRkmAYT87uO0kJrRfzNk5WTghNXOwJiCfGX1LOX8h9CITiY2IKBhReqnO6rLN8o/B6myjvWUAWUJbg7ztcZSCgQQ4+HLfhWr9ILlAZnTGK64wwYaOdZ3+49W3c2gvhS3pfGhUE4kUikRvK6rKiJG4zihMkK2a3Wtwyx42t52BZLZ1caYmtH7Uen8anaBq9xLXS+g64vlzFeZiBBWJmteQCFF5vU55B2bCYskfFJI6kwY/Kv/IKuRf1uC7Wk7YOffambYt7PGWqtefvUOB2WIWCErut0jNGbDvZpk3i4iAZKd1q8daVLaIT98dQEotMzpAe8avDLy7lboP7Bk5UWECg8DqUXAAL9z3KMzhHV7XZIIYp+2QZDOBaf4jRRnKB0/1OmYbg5e+t2zmst/J6XQa+IoRsCR0ofLj4mI1DQW0p5OOsGoeTdFxgUhxHy8bZ3El8PomXW6tfxyo54EH6klcL9W3O5Bk87DlpJ8EMDPDuuPEGHOjq6spplWYnfD5fplkO7BxOBcCKFSs2u23Lhvc37n6nle9mblNz7ws/anuhS8oTdEk/Rvm7mxK4n6R0sj+sM+b4S1g7pE1PZNx+ZiNHOlg7cVkJLMIR78oziwg5nrGMj/cQXT7+4tKriGGYtHEpNJ8g0J53VyrOcQ+5s6QLptIQrsUb5I64DggzSqz22o927ph/0/ZbZaB3Opx592DRBiIHVTCwWy9x1oxZPWw7SccDkcPPyTgBsa93Oi8nC8bZqolNCxIeKejmsRcUFYSZzDB9AT7osnY5Y9/dgUAg7zXl8Bsqq0VGHbiZQeFcMG23YJEsIxfgOtbGHZOyYP5tu7f8/Zad3xFB/dNC6t+SQqzC4u44S8RmvZB1bfwJJlvmJGQyftv0ap3FWzjmtjRO+8e2FzUlXl/TzJnkI4ZhUoJCOOtam6oaPTQg7x3ZeTyeHhSwWXctgnIj61p1Aw0jWWpO46SuUkW/2NS6ff6trb8eEaycAcH5LArsnwtJS6RO++M2Tmbx2GdsKxJbNwkOklEcxixmkhwm47YXRJ9vbRg2hxiGSQkK4WE0wIHQ4DRl1o2OIYglVCD4/X7VJcRuckFtba3leuQk66iK4WD0lhpOuPOwUeU9XQ2BUEpwcSpKcVXVTaUGHxZ1mSkSGDaJRCViiMhEy2UsNhOzbKRj6//ovhYxkXHLnOaNhqvDNak1zppFT3MvnwyTkjFU+AzqzABmIJrtapBZVR8Oi25paamy8LZHluU8vfVbP9ikgmoh0Wlqors/LK0q62gPVOrCN5l0mgFzYDwsgmqpzGldVqPYHi3DvdVZSWIBSes/Dv8a20n7jonExPmCStvBzLOC5Oz1Nb5p0P8PiWGYhBTS134iUIYUTMZwXdd7I72U5oq89qMQ6n6A2pQbTQ2qbvbf1fL6pvqi6p2tRV0je4qLRXERdfcMD5KvSnhorNAhPEI7CH9uDQmtRuqyBncRFpE4KC7En8CNFsm15hR7scdq7BaPfdq8jW19iZCeqyE0VxPDMEyB0NLS0t7Q0JDTGE2/dNjTDFdbc7gPiI6wBpEKPiWtu117KZVUlw0/LOjxHCoFKfHBWE4iXUxCwX8kyv4KDFpEZAwvWgiLyETdbzKu8gCRszuNHLYLI84c1Thq5J65e7KurcIwDDMAyWkOw0HTM9yGR6l7A+1XYhQnSPXXjh7jC/aepAt5AdRjFsyokRFRsbvLEolMIoGxxJXItr0UNaVax2T4Ct8lhmEYRiE7Ojp6zAsGVRekiWj+basKOv1FDVP/c+Q48strEQf6MgSnJioo0UoCTi60GEmtGLvoqIY1mmc23GfvESWq3sAwDDN0QBnas2lTKFYfxVX15oHI8vv2fVxds/9GCuhnk9RflkYCgFQiI6VDnzpmZCIl0Y6tml3FvXIyDMMkoOCERrGwiQLNjx5Y2q0fmANxuB+iEUyYudkkMGQXGBkTHXO8xzKQnFE8/MBIYhgmEQWfJFUIcYAKhPr6+nKUbW5qCsbd74IUmggqrvNRR8d1kIf/s7SziVQYkNKyLFpZzSwu0iouUYxJIalKCwjO6swwCXDbNfcgYT8VCJ2dnV43VdKxb9z9LmihCTGXgt2dnm/jcd8cExFpcY/FBIWiC0wWS2wjmwhFxsGgHE8MwySih7KnL3tLdfNbBdNwe/jw4ZUuU+oMQaEBW+a27w6S/F5UOCTFZRSwWC9xOWwsoziEV2eLhmESgC9cNyn4RxUXF+c9ryDOUf2Gm0aXBWO1dXd3q6633cSdt9sXDAmhUdSO63pKSrE6qWssWjUt3oVma8Np2UbodAgxDJOI7ZQl6ssaQpP3XGkoXFUNXDdC48ZqG1DgeqskqJWUPVvsC4aM0KgKAjIoXzULTFhXbK4xovh8bCmERwpRRQzDOAKx2EHZMwYxgyLKM8FgUFXoGU7Z4+ZvHFDgfh0FCy9bbQjour7BvnDICE0IXS40Wy/SlKYmEnMJYVISc42zOGKWjZuOnRimoHHjOsO+IzweT96Tcnq9XlfdTVPhCI2GcvHfKHu6nT4shpTQaF65WNdh1+gQB13pTniwWCt6fA00e80zi1jhPyELo+Erw+QDvCufkAsgAm4KvrSAoLntzDDv3U33BfX19TW4FtMpS3CvuzBstC8fUkIj/R74UUWrlPHWi1k4ItZOJGOaNPvLzH6zuOANwzAObCAX4P37D8oz+I1jyAXYv0+FBr/noTygRMaph8wM2LNmzZqhLTQhTG4zqcdXAjAP9piMZTAtz7q3JIYZGqjKAFlX/0XhdxzlF1UOnkTZ04lhE/UhuCYzYH3MmTVrVi69Keo6zHYRn1HdQH9EDkXikBMa3Uk8EohJUjLamGGGLsXFxfvwQbeKsgT7jqurq6unPDF58uQZKFyPoCzB+W3p7Oxsp75lOM75yZ07d/5pwoQJbt1+IXCcqRhdQC7QdX2Z0/KhZ9EoHKwWSjI4rbdpTBcxDONIT0+P6kajhbJEfWEXFRVdRXkCxz+X3NFSW1vbH2l2inDu5/l8vvmwbv575syZbtobeRAL+znGZeQCWDSLHZfTEKInGCzWdTlKOgiMvbW/RUgcrCAbO4lhGEeam0Ndvb9PLkCBesWkSZMOohxj9G0/h9yxZOHChf2ZGaAWw8+7u7vnwvLLKkvJlClTbsDoFHIB7lEwEAi84bRuaFk0geBoqESxYw2ySFoass1HKwmQrRaaSah02kwMY4BnxqvyRRETBddkIbmjHF/L36YcU15efhEKyInkjqzdgrkCf4NKnzMHbsqlEI3vQXCK09zVA2voFtyf293EZhQ4xj9Wr169y2ndkBIa3UPTLFWZpdVCkUmDN7GdpEllQv8JuZWYgkL1qUFZghe2Bq6e0cREKSkpUbWyVpI7rkM85RzKEVOnTh2HmMKPyEW/XLjXrRDANTRwUJmX74bgvAcBOaGxsdGxdpoSIliIpzc0NLyKv6GJcgB+d16idUPqq0vXtU8LI21eZCxtfrDQrIjNiGRp9iL7CtpITKGxm7KnIhgMfg7j1URcVUSBgm33ypUr30Oh1kBZohpvYvj5xIkT161Zs2YZuQCF8BiIzO1uKgEoULiuQQxqLQ08puNvexrX/H9xvZ7AtHoOh0MUVcPU4zB/PMb/jsFNdwBm/Dj2wkQrh1Y7Gik/Y87cLJ0qBRBRXGYASYmrOavsFUQfEVNQ4EXcRS7AS/c1vOBTiQkxd+5c1Qf9W+ReeMd5PJ656ms80dd6KmDJqJxm96Is+DK5BGK1sKWlpa9rnKWLimndhOu1AMObasBz/QwGZcXNotyJjCpbFyNGlNCyGzJCM/JMGg+JqZNGdD9OcAycXGuxlY7DWn+wp5WYggLPx8fkjqO8Xu88uCa+VlNT4yZBYcEAK+8ljNxkcg6BgnKCEpsVK1b8avr06Wmnjhk9enQ5XG9XQBwW4xiNRlwja1QreIxeoAGMirtgUEl/D8ZQSnkC1+J+CG5Cd/OQcZ15Pd4rEEzxKLdYRFjC1mQYGfGZCVunFNLqTrM/mTjG4r3TqZ2eJqawcFVLymAchodGjhzZNmLEiDanDqEUeEnVF/F1zc3Nfdror6+Bu2srXFYv4zpcSu5R7UiuDQQC50HMn8E1fAECshpf1Ts3bNiwV22A36rE+mqfz3ek8mZg+y9g8ZGUo3IPx1sP8XQbdyoENuBaPJ9sgyEhNCMaqVJ2ipQ1VkLCY7FiYqoT0SQHu/8pauLkAIVGZ2fnC2VlZarKqtt3RO0/Bi9iwsSQWLcXBaGyegpaaAzux3AhBtcZmQ2LRH2pX4XJq2DlEO4ZQXii20BkIttSjsEtk49APAumZ81sgcD/ZdWqVUljmtm9RFPoGPLRLzBVh4LY7H7rQUm8B8t2o+htwZoFmH6TVKdAH5Cf+oOZ5NM6PXdDIEqEjHQKIEL6EY3lO1QMCC+LqY40iw5FltHmA0Hfu0S9xBQW6qsYBZayU88jJmfAals0ZcqUN1FIn0aDm/UoYB+hIQ4EfIVym6XaLnOhmYV99tCNmDrRcb2gw0NjjU7B9FUojVWNrOdoBr78d8AdsS2UF6ivECMP9l2Oc/iKmpEiYpnI0LT6xyI40X/CoiMcfWgUEysh/3Gg+MBQ6A99SIKX6A94ib5EQzWDRn7Q4c76GawPlb9sBA1S8Fw8lqjNyFACrsPHcR02pNoumxfIi73SrzmihEfQN7HPCzQWZvNRlLecRXZGnOk5g3TZhLMtM/QlduJm0TBNyyQ1ziwI2UkB/Q80l4LEFCQqaIzRO8TklDFjxizA6F0apEBkNhQVFf2Khji4Dm92dXWldR0yF5qF1I29bkbJ+wrmlkJEwgPRCgpnaQ1bLHFRcyrFcAn2fRuOt29SPr8SYXWNON1zIdx3D2Mu7BuXZG3VH1pmNMAkm8BQfG00souOTm/KYaP+SUzBAjfPdrxMt2Kym5icodK1+P3+b2GyP/KDuUXF7a5funTpXhrC4L3YB6v0ariY03o3sivsP6DV5KGzUOKejO/58KDTZ7DsKCw7EtPHQVS+ii2Vj9sawBBUgX/vgdjcQTWU+77AZ1FFuc/zGAThfrjGxkTTyEiTgKjtzG1joq38rYJD5CA4Cj1U8DzcOrd1ML4oTAZAbF7H8/E7YnLK2rVrV8NivIkGGXgWflldXT2gqzT3AQFch8uWL1++Ot0dYjEaFXvZSYdQMVVDOFI3hHIK7feGYuZ7sPd6KqclsH7+SNNpAvkQ05F0EdZFapr4YPB8X46hMtpC6svGXa2tT9OwYg99SivWzvaQuAm/VREJ3hsVyWI1yhB4EaYqy6GYTTRQI0PTat/ocgMpYzEcTD/XVtL7N2KGAnpvb+/tcJVMQczmVGJyRkVFxQPt7e3KlZ63zMw5RH0w/3nPnj234uOjPxNoRliNwn4ZnskvUg5q8KULfq8TcZn/WrVq1bxM9osJzS76LE4XVgAdFrJz0q0NGL+dMg220X5aBKvlEdpLr1MLXUEz6c9Y9ycMlUaBrWLt18hjsXYRZe7vnEZlwyqoMuilYzTpadSEPBWHrLboQ0hYDB2JBPejwmNaHyc8MlzLTJqOJaKGzraA0G7g2MzQoaWlpbW+vv5ivNjv4EWrJSYnvPPOO11Tp069EZZNHbnMHJxvcO//EggEvrNt27a+rMyUjO0QvAumTJlyHq7fz/BcHkZ5xqiGfxPGf6QMiQmNh1SyulycrCqbVUvUOSiZ59AImk9H030oljfjN+7A2juxLtJvghcbN8nj6ENs61wfvYhKvDoVy1CeHjpIaHSYEFoNbv14XdDRHl2MipgaZuMkVJXZsF4iZxUWG2nZ1ixGkWmSscac0pAaYzfcU/njfc93rydmSKHiNRAb9Y78gdRnDpMT4H7ZU1tbe255eflvMPslFGS5d6e7Q7mJfguR+QncfQOthqm+YsWKJyE2y1Ew/UBlO6AcppWxsRnX4Wa8A48b6YQyIiY0OlxdWsg8zK0ZJuhM/HsyRCYcNJKYskaGKlCUPw9N0I3tw/9ohtWhUynEpUiY14VGwiQqFBMOi6USFhuimIssKjbYwC4wkenodsYJR9xp4K97OvwPETMkgdgsnThx4pler/dnFG5f02cui0JGtVmqq6u71ufzrdI07ToKN8IcCKjKIN9raGj4UzaFa18BsVkFsb6qrKzsVZzvD1WKHkrfJ5UOb+O4KnPFkpUrs0uEEBOaZbA6GhDk99LxOEVvRqcZEY4gqT4QpmP+PzAeadqiBMdzVtpwAT8i+nuxdpEWXYnD7iOLyILJRWZuWRmzVDIQGzLPy3f8Xv+1iDsNBP8s00+oNCqNjY1fxfhh+KrvwAt4jNt+PJiQe1Kl4bkDgjOvuLj4LkyfRf3XfqkD9/Xx7u7uOz/++ONNKGBpoGPU/noM128+rt8PMX0luewtE7TgGb993759T7p1GVobbK5EPIVCQ/Y0wmJpoRo8Iv+JuRsoQ9LSN7MQmKyXiEoldKGJmBDFxCbW6j9yLDKOG/qp8IGWSum5YP88/5BvoMVEMxG/BjeCygauUq2fjmE2BGcKMW6QEJxmFJaNKCxn4dpeg2v6eeo7y1FVWX5ENcY8//zzlzU1NQ261FIqnojrd2NRUdFzmL0H1286ZYb6kH4Lrjj1ITU/V+5C58wAdTQaWvhjiMUxmKtKdgCLMkjcqBZ6E+PH6QO6kY6if+EYKj1B7loAO1geplXW5ab1EVGyi01YY0zWjUlgjGMtx8aX7H2heyPlkJKSkr29vb1NlCUqPTm5owXH+CkexKzSEGG/vDW4gz98A1woTZQ9S6kPMLooftMYfqS6GsZ1ORqD6k43bfcPCrZu7LM9nW2NlB9NlCU5eG7yjpEFWGV6fgliXoe/WcVuzlIuIQwjcxHHwTF0PGP7cT1245jLUKjOw/v4NCyYfWo9RIYGK8b1WwA372fg5lXWjXJHOlk3B3AdOlWQH8NKXIM3VHJMPNctlGOcDYhp9AMIxB1pmRfO2+wNpZ/5gObSzFC6mtvNOdEsqV2EzUUmjExk5uWmaWEcwN6BWWhdJB5jXmfaJ25d3PlYfxeas1jonsa9f+/eQAzD9CszZsyo7enpaUDheTQEYoYSHpWMFEMRppXV42T5BLBOBfTVR0EPxjsxbobILML0CsSFlvRX40vEfiRlz0LES05OYzuB3zkGf+vluA7DMN6CcTeu30Zcg51+v38jptcnS/GfC5y/ZgW5/VHVKPPXiNZsRNzmg1C7GqLxlEvscZREm5hda0JYg/3CcqgY4YoJT5Rq/qu3vegfKNUZGWZIA0HYgJEaog0mYfGUQ3gqlNhgKEehaY/r9EJMOkEHtms3rNChhIQgLcJ4EfUjiYTmYZS+DRgfTamIBdw1TE/AOBL0PxhHf8VocF9ObjC5wqLtYshBYGxikuxQ9oXScKFJKboxvrOiK3D3hoWceoRhBjIQDpWdgzN0DHCchWZpKCh2BdVmUCd7bMgOehBTF5mWjkgvuu+CRPEYY0KKeKvGWiEgdhyYMW8Gg3R956uBJUM6kRHDMEwO8dKxNIYCIXFQQf8KygZlrPZQMUr3k8iN19FMokC/wyb2WmZmMYnb0cGFhnE7oj63BPzev3Yt6PqEGIZhmJzhJX8oLcwsx7XpWiPSNg7v2w0T4SKIkOpX+5cYJiTbXTgsSegBixMPSn2u5tpqFI3ftOmaeF7X/Dd3zact1E99szEMwxQyXpS40/Pg3gpAZH5PH9LfEOU5Hccfl4lomQUh4UbmmgAiwXqHOeUhg4TtgCXzqi60eztf8i8mhmEYJm94yUM/gSh8F9Ol5B7VkG0Ljvcg4jz30QxEeQQ9Qhn25Jmx7tljMZHF0lKNOYAF/8LsYwG96Jnu17o3kQjmytHHMAzDJMBLuyEII+lllM6+uLXpFsMRGdFDHQxspfdpHyyZz2HJL0hVE4gcKxKstwXh7crimF3GIeifkNg23fitDzQh3sP038s9wX/ueJkOhPqxynclBYZhGCaElzaEqvCmzpRWT5VUlCC7swptyFCTzIMxPgkio/pZVznT0k8dkY6ApN4tgJl1UoolUsr3ZNC7oLy8d8Pu+aTyKCmFYRiGYfqY9Fxa02g2LBVVacDZvZYD68DRiiHHuH8XXGQ7pZBbhXLTkVgnpFgTlMFmv4eW0evmti+9MNgYhmGY/iQ9ofGQSmyXbQxnL9ThQVg7L5LKDiDpNijHoab17RCP72D8mhRmZ5201mbzUwd9QA4J3jjMwjAMM5BJT2hCiSUzcG4J6gol2JS0AHN3w6xYS6Po3yBY10dExojT+GGd/FGW0aOcfp9hGKYwSU9oeukPiLasx1Q1LJNax20EBTFshVzswlE3YlhH7yE2cjQcb5WwaEQobmO1inR6Xu+gH9BiFhmGYZhCJT2haQ7lEnqR0mUCVdEwOpWOoi9CYL5IkW4CrA1anpFd9HVak6ALZ4ZhGKYgSC40n4ZcdNIVsGKmQxjSEyWNxuDfBgyHkIruOPM4rKT/goDtIYZhGKagSS4eXfQNCMfPQtOpojPpRW+2YLgarrL0rSOGYRhmUJNcaETIOnGL6ttmDSyiR+kAPcSuMoZhmKFFcqHR6AkE7M+D4KTuljbcaj+IoTdU60zQTky/gaXPYHiPPiTuQIxhGGYIklxoPoA8TEVIn6gG0RZP0m1VAhuVgqYIFosfsZcPaB8xDMMwidhA2bOdBhGpA/zLQwF7DtozDMPkEJ/PdzJlSW9vL/f+yzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzBp8/8BmA6fm452HEEAAAAASUVORK5CYII=',
                    width: 150
                },
                {
                    text: [
                        {
                            text: 'Wallet Produtor: ',
                            style: 'label'
                        },
                        `${infoData?.producerWallet}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Nome do Produtor: ',
                            style: 'label'
                        },
                        `${infoData?.producerName}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Wallet do Inspetor: ',
                            style: 'label'
                        },
                        `${infoData?.inspectorWallet}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Área inspecionada: ',
                            style: 'label'
                        },
                        `${infoData?.producerArea} m²`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Data: ',
                            style: 'label'
                        },
                        `${infoData?.date}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Foto de prova: ',
                            style: 'label'
                        },
                        {
                            text: `${proofPhoto}`,
                            link: `https://app.sintrop.com/view-image/${proofPhoto}`,
                            style: 'link'
                        }
                    ]
                },
                {
                    text: `Relatório da Inspeção #${inspection.inspectionId}`,
                    style: 'title',
                    fillColor: '#c5e0b3'
                },
                {
                    text: `Tabela de índices utilizada`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Indice', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyIndices
                        ]
                    }
                },
                {
                    text: `Tabela de insumos utilizada`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyInsumos
                        ]
                    }
                },
                {
                    text: `Tabela de resíduos utilizada`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyResiduos
                        ]
                    }
                },
                {
                    text: `1) Insumos registrados na propriedade:`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyResultInsumos
                        ]
                    }
                },
                {
                    text: `2) Cálculo da degradação por uso de insumos e resíduos:`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyDegradacao,
                            [{ text: 'Total', style: 'tableHeader' }, { text: `${degenerationCarbon.toFixed(1).replace('.', ',')} kg`, style: 'tableHeader' }, { text: `${degenerationWater.toFixed(1).replace('.', ',')} m³`, style: 'tableHeader' }, { text: `${degenerationSoil.toFixed(1).replace('.', ',')} m²`, style: 'tableHeader' }, { text: `${degenerationBio.toFixed(1).replace('.', ',')} uv`, style: 'tableHeader' }],
                        ]
                    }
                },
                {
                    text: `3) Zonas de Regeneração:`,
                    style: 'subTitle'
                },
                {
                    text: `Coordenadas das zonas:`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Nome', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenadas', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyCoordsZonesTeste
                        ]
                    },
                    style: 'table'
                },
                {
                    text: `Fotos das zonas:`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...rowPhotosZone
                        ]
                    },
                    style: 'table'
                },
                {
                    text: `Estimativa de biomassa no solo`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 1 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 2 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 3 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 4 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da amostra [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biomassa úmida?', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Total [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyAnaliseSoloZones,
                            [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${saldoCarbonAnaliseSoloZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                        ]
                    }
                },
                {
                    text: `-Cálculo da biomassa no solo:`,
                    style: 'titleExplic'
                },
                {
                    text: `Total = ((Média dos pontos x Área da zona) / Área da amostra) x Indice da análise de solo`,
                    italics: true,
                    color: '#0a4303'
                },
                {
                    text: `Caso seja assinalado o solo úmido, o resultado da fórmula acima, é multiplicado pelo indice do fator de umidade`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `Plantas registradas nas zonas`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenada', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Diâmetro [cm]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Altura [m]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Amostragem', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodySampling1
                        ]
                    }
                },
                {
                    text: `-Cálculo do volume de biomassa das árvores:`,
                    style: 'titleExplic'
                },
                {
                    text: `Volume = (π x r² x altura) x Índice multiplicador da raiz`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `Quantidade total de plantas`,
                    style: 'label'
                },
                {
                    table: {
                        headerRows: 1,
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Plantas registradas', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área total das amostragens [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Total estimado', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyEstimatedTrees,
                            [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${estimatedTreesTotal}`, style: 'tableHeader' }],
                        ]
                    }
                },
                {
                    text: `-Cálculo da estimativa de plantas:`,
                    style: 'titleExplic'
                },
                {
                    text: `Total = Área da zona x (Total de plantas registrados / Área total das amostragens da zona)`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `Volume estimado de biomassa das zonas`,
                    style: 'label'
                },
                {
                    table: {
                        headerRows: 1,
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume total da amostra [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área total da amostra [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyVolumeZones,
                            [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${volumeTotalZonas.toFixed(4).replace('.', ',')}`, style: 'tableHeader' }],
                        ]
                    }
                },
                {
                    text: `-Fórmula da extrapolação do volume de biomassa da amostra para a zona`,
                    style: 'titleExplic'
                },
                {
                    text: `Volume da zona = Área da zona x (Volume total da amostra / Área total da amostra)`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `Água estocada nas zonas`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume da zona [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyAguaEstocada,
                            [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${totalAguaEstocadaZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                        ]
                    },
                },
                {
                    text: `-Cálculo da água estocada:`,
                    style: 'titleExplic'
                },
                {
                    text: `Água estocada = Volume da zona x Índice da porcentagem de água na biomassa`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `Carbono estocado nas zonas`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume da zona [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água estocada [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biomassa seca', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [t]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyCarbonoEstocado,
                            [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${totalCarbonEstocadoZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                        ]
                    }
                },
                {
                    text: `-Cálculo do carbono estocado:`,
                    style: 'titleExplic'
                },
                {
                    text: `Carbono estocado = *Biomassa seca x Índice da porcentagem de carbono na biomassa seca`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `*Biomassa Seca = Volume da zona - Água estocada`,
                    style: 'explicacaoCalc'
                },
                {
                    text: `4) Registro de Biodiversidade:`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Tipo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade registrada', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodyBio
                        ]
                    }
                },
                {
                    text: `Biodiversidade registrada nas zonas`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Tipo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Espécie', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...rowAnaliseBio
                        ]
                    }
                },
                {
                    text: `Biodiversidade do solo registrado nas zonas`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenada', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Registro', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodySoilBioPhoto
                        ]
                    }
                },
                {
                    text: `Nascentes dentro da propriedade:`,
                    style: 'label'
                },
                {
                    table: {
                        body: [
                            [{ text: 'Geolocalização', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Fluxo de água', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ...bodySprings
                        ]
                    }
                },
                {
                    text: `5) Resultado Final:`,
                    style: 'subTitle'
                },
                {
                    table: {
                        body: [
                            [{ text: '', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade [uv]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                            ['Insumos', `${degenerationCarbon.toFixed(2).replace('.', ',')}`, `${degenerationWater.toFixed(2).replace('.', ',')}`, `${degenerationSoil.toFixed(2).replace('.', ',')}`, `${degenerationBio.toFixed(0)}`],
                            ['Árvores', `${((totalCarbonEstocadoZones * -1) * 1000).toFixed(2).replace('.', ',')}`, `${totalAguaEstocadaZones.toFixed(2).replace('.', ',')}`, `0`, `0`],
                            ['Análise de Solo', `${saldoCarbonAnaliseSoloZones.toFixed(2).replace('.', ',')}`, `0`, `${saldoSoilAnaliseSoloZones.toFixed(2).replace('.', ',')}`, `0`],
                            ['Biodiversidade', '0', '0', '0', `${(totalSoilBio + totalBioZones).toFixed(0)}`],
                            ['Nascentes', '0', `${Number(totalWaterSprings).toFixed(2)}`, '0', `0`],
                            [
                                { text: 'Total', style: 'tableHeader' },
                                { text: `${(degenerationCarbon + saldoCarbonAnaliseSoloZones + ((totalCarbonEstocadoZones * -1) * 1000)).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                                { text: `${(degenerationWater + totalAguaEstocadaZones + totalWaterSprings).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                                { text: `${(degenerationSoil + saldoSoilAnaliseSoloZones).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                                { text: `${(degenerationBio + totalSoilBio + totalBioZones).toFixed(0)}`, style: 'tableHeader' },
                            ]
                        ]
                    },
                    style: 'table'
                },
                {
                    text: `Resultado Registrado na Blockchain:`,
                    style: 'label'
                },
                {
                    text: [
                        {
                            text: 'Carbono: ',
                            style: 'label'
                        },
                        `${Number(resultIndices?.carbon).toFixed(2).replace('.', ',')} kg = ${isaCarbon}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Água: ',
                            style: 'label'
                        },
                        `${Number(resultIndices?.water).toFixed(2).replace('.', ',')} m³ = ${isaWater}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Solo: ',
                            style: 'label'
                        },
                        `${Number(resultIndices?.soil).toFixed(2).replace('.', ',')} m² = ${isaSoil}`
                    ]
                },
                {
                    text: [
                        {
                            text: 'Biodiversidade: ',
                            style: 'label'
                        },
                        `${Number(resultIndices?.bio).toFixed(0)} uv = ${isaBio}`
                    ]
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 5
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    marginBottom: 15
                },
                title: {
                    color: '#0a4303',
                    textAlign: 'center',
                    bold: true,
                    fontSize: 22,
                    marginTop: 15,
                    backgroundColor: 'green'
                },
                subTitle: {
                    color: '#0a4303',
                    textAlign: 'center',
                    bold: true,
                    fontSize: 14,
                    marginTop: 15,
                    marginBottom: 5
                },
                blackBold: {
                    bold: true,
                    marginTop: 10
                },
                label: {
                    bold: true,
                    color: '#0a4303',
                    marginTop: 5,
                    marginBottom: 5
                },
                link: {
                    color: 'blue',
                    marginBottom: 5
                },
                explicacaoCalc: {
                    marginBottom: 10,
                    italics: true,
                    color: '#0a4303'
                },
                titleExplic: {
                    color: '#0a4303',
                    italics: true
                },
                tableHeader: {
                    bold: true
                },
                table: {
                    marginBottom: 10
                }
            }
        }
    }

    async function calculateIndices(indices, resultCategories, resultZones, springs) {
        const indiceAnaliseSolo = indices.filter(item => item.id === '14');
        const indiceMultiplicadorRaiz = indices.filter(item => item.id === '27');
        const indicePercentAguaEstocada = indices.filter(item => item.id === '28');
        const indiceCarbonBiomassaSeca = indices.filter(item => item.id === '29');
        const indiceFatorUmidade = indices.filter(item => item.id === '30');

        let bodyInsumos = [];
        for (var i = 0; i < indices.length; i++) {
            let row = [];
            row.push(indices[i].title);
            row.push(indices[i].unity);
            row.push(indices[i].carbonValue);
            row.push(indices[i].aguaValue);
            row.push(indices[i].soloValue);
            row.push(indices[i].bioValue);

            if (indices[i].insumoCategory === 'insumo-quimico' || indices[i].insumoCategory === 'insumo-biologico' || indices[i].insumoCategory === 'insumo-mineral' || indices[i].insumoCategory === 'recurso-externo') {
                bodyInsumos.push(row);
            }
        }

        let bodyResiduos = [];
        for (var i = 0; i < indices.length; i++) {
            let row = [];
            row.push(indices[i].title);
            row.push(indices[i].unity);
            row.push(indices[i].carbonValue);
            row.push(indices[i].aguaValue);
            row.push(indices[i].soloValue);
            row.push(indices[i].bioValue);

            if (indices[i].insumoCategory === 'embalagens') {
                bodyResiduos.push(row);
            }
        }

        let bodyIndices = [];
        for (var i = 0; i < indices.length; i++) {
            let row = [];
            row.push(indices[i].title);
            row.push(indices[i].unity);
            row.push(indices[i].carbonValue);
            row.push(indices[i].aguaValue);
            row.push(indices[i].soloValue);
            row.push(indices[i].bioValue);

            if (indices[i].insumoCategory === 'arvores' || indices[i].insumoCategory === 'biomassa') {
                bodyIndices.push(row);
            }
        }

        let bodyResultInsumos = [];

        //Variaveis da degeneração
        let bodyDegradacao = [];
        let degenerationCarbon = 0;
        let degenerationWater = 0;
        let degenerationSoil = 0;
        let degenerationBio = 0;

        //Variaveis da biodiversidade
        let bioPictures = [];
        let bodyBio = [];

        //For para calcular os resultados dos insumos
        for (var i = 0; i < resultCategories.length; i++) {
            const category = JSON.parse(resultCategories[i].categoryDetails);

            //Lista os insumos registrados na inspeção
            if (resultCategories[i].value !== '0') {
                let row = [];
                row.push(resultCategories[i].title);
                row.push(resultCategories[i].value);
                row.push(category.unity);

                if (category.id === '9' || category.id === '10' || category.id === '11' || category.id === '12' || category.id === '23') {
                } else {
                    bodyResultInsumos.push(row);
                }
            }

            //Faz a contagem dos insumos de degeneração
            if (category.category === '1') {
                if (resultCategories[i].value !== '0') {
                    let row = [];
                    row.push(resultCategories[i].title);
                    row.push(`${resultCategories[i].value} x ${category.carbonValue} = ${(Number(resultCategories[i].value) * Number(category.carbonValue)).toFixed(1)} kg`);
                    row.push(`${resultCategories[i].value} x ${category.aguaValue} = ${(Number(resultCategories[i].value) * Number(category.aguaValue)).toFixed(1)} m³`);
                    row.push(`${resultCategories[i].value} x ${category.soloValue} = ${(Number(resultCategories[i].value) * Number(category.soloValue)).toFixed(1)} m²`);
                    row.push(`${resultCategories[i].value} x ${category.bioValue} = ${(Number(resultCategories[i].value) * Number(category.bioValue)).toFixed(1)} uni`);

                    bodyDegradacao.push(row);

                    //Faz a soma da degeneração
                    degenerationCarbon += Number(resultCategories[i].value) * Number(category.carbonValue);
                    degenerationWater += Number(resultCategories[i].value) * Number(category.aguaValue);
                    degenerationSoil += Number(resultCategories[i].value) * Number(category.soloValue);
                    degenerationBio += Number(resultCategories[i].value) * Number(category.bioValue);
                }
            }
        }

        //Análise das zonas
        let saldoCarbonAnaliseSoloZones = 0;
        let saldoSoilAnaliseSoloZones = 0;
        let bodyCoordsZonesTeste = [];
        let bodyAnaliseSoloZones = [];

        //novo método

        let bodySampling1 = [];
        let volumeTotalZonas = 0;
        let totalAguaEstocadaZones = 0;
        let totalCarbonEstocadoZones = 0;
        let bodyAguaEstocada = [];
        let bodyCarbonoEstocado = [];
        let bodyVolumeZones = [];
        let estimatedTreesTotal = 0;
        let bodyEstimatedTrees = [];
        let rowPhotosZone = [];

        //variaveis do registro de biodiversidade nas zonas
        let rowAnaliseBio = [];
        let totalBioZones = 0;

        //Variáveis da biodivesidade no solo
        let totalSoilBio = 0;
        let bodySoilBioPhoto = [];
        let bodySoilBio = [];


        //For para calcular os resultados das zonas
        for (var i = 0; i < resultZones.length; i++) {
            let volumeTotalSampling1 = 0;
            let volumeAmostraAereaSampling1 = 0;

            const zone = resultZones[i];
            const titleZone = resultZones[i].title;
            const pathZone = resultZones[i].path;
            const areaZone = Number(zone.areaZone);
            const photosZone = resultZones[i].photosZone;
            const bioSoil = resultZones[i].bioSoil;
            const analiseBio = resultZones[i].analiseBio;

            const treesS1 = zone.arvores?.sampling1?.trees;

            //Faz a estimativa de árvores da zona e monta o array da tabela do pdf
            let estimatedTreeZone = 0;
            let rowTreesZone = [];

            const estimatedTree = (areaZone * (treesS1.length / Number(zone.arvores?.sampling1.area)));
            estimatedTreeZone += Number(estimatedTree).toFixed(0);

            const rowTree = [
                titleZone,
                `${areaZone.toFixed(2).replace('.', ',')}`,
                `${treesS1.length}`,
                `${Number(zone.arvores?.sampling1.area)}`,
                `${areaZone.toFixed(2).replace('.', ',')} x (${treesS1.length} / ${Number(zone.arvores?.sampling1.area)})`,
                `${estimatedTree.toFixed(0)}`
            ];
            rowTreesZone = rowTree;

            bodyEstimatedTrees.push(rowTreesZone);
            estimatedTreesTotal += Number(estimatedTreeZone);

            //For para listar e calcular cada árvore registrada
            for (var s1 = 0; s1 < treesS1.length; s1++) {
                const height = Number(treesS1[s1].height);
                const diameter = Number(treesS1[s1].ray);
                const ray = (diameter / 2) / 100;

                const volumeTree = 3.14159 * (Number(ray ** 2) * Number(height));
                volumeAmostraAereaSampling1 += Number(volumeTree);

                let row = [];
                let imgTree = {
                    text: `Foto`,
                    link: `https://${window.location.host}/view-image/${treesS1[s1].photo}`,
                    style: 'link'
                }

                row.push(titleZone);
                row.push(`Lat: ${treesS1[s1]?.lat}, Lng: ${treesS1[s1]?.lng}`);
                row.push(`${treesS1[s1].ray}`);
                row.push(`${treesS1[s1].height}`);
                row.push(imgTree);
                row.push(`${(volumeTree * Number(indiceMultiplicadorRaiz[0].carbonValue)).toFixed(4).replace('.', ',')}`);
                row.push(`1 - ${zone?.arvores?.sampling1?.area} m²`);

                bodySampling1.push(row);
            }

            const totalSampling1 = Number(volumeAmostraAereaSampling1) * Number(indiceMultiplicadorRaiz[0].carbonValue);
            volumeTotalSampling1 = Number(totalSampling1);

            let volumeZona = 0;
            let volumeTotalAmostragem = 0
            let areaTotalAmostragem = 0;

            volumeZona = areaZone * ((Number(volumeTotalSampling1) / Number(zone.arvores?.sampling1?.area)));
            areaTotalAmostragem += Number(zone.arvores?.sampling1?.area);
            volumeTotalAmostragem += Number(volumeTotalSampling1);
            volumeTotalZonas += volumeZona;

            let aguaEstocada = volumeZona * Number(indicePercentAguaEstocada[0].aguaValue);
            totalAguaEstocadaZones += aguaEstocada;

            let biomassaSeca = volumeZona - Number(aguaEstocada);
            const carbonoEstocado = Number(biomassaSeca) * Number(indiceCarbonBiomassaSeca[0].carbonValue);
            totalCarbonEstocadoZones += Number(carbonoEstocado);

            bodyVolumeZones.push([
                titleZone,
                `${areaZone.toFixed(2).replace('.', ',')}`,
                `${volumeTotalAmostragem.toFixed(4).replace('.', ',')}`,
                `${areaTotalAmostragem.toFixed(2).replace('.', ',')}`,
                `${areaZone.toFixed(2).replace('.', ',')} m² x (${volumeTotalAmostragem.toFixed(4).replace('.', ',')} m³ / ${areaTotalAmostragem.toFixed(2).replace('.', ',')} m²)`,
                `${volumeZona.toFixed(4).replace('.', ',')}`,
            ]);

            //Monta a tabela da água estocada
            let bodyAgua = [
                titleZone,
                `${Number(volumeZona).toFixed(4).replace('.', ',')}`,
                `${Number(volumeZona).toFixed(4).replace('.', ',')} x ${Number(indicePercentAguaEstocada[0].aguaValue)}`,
                `${aguaEstocada?.toFixed(2).replace('.', ',')}`,
            ];

            bodyAguaEstocada.push(bodyAgua);

            //Monta a tabela do carbono estocad0
            let bodyCarbono = [
                titleZone,
                `${Number(volumeZona).toFixed(4).replace('.', ',')}`,
                `${aguaEstocada?.toFixed(2).replace('.', ',')}`,
                `${Number(volumeZona).toFixed(4).replace('.', ',')} - ${aguaEstocada?.toFixed(4).replace('.', ',')} = ${(Number(volumeZona) - Number(aguaEstocada)).toFixed(2).replace('.', ',')}`,
                `${(Number(volumeZona) - Number(aguaEstocada)).toFixed(2).replace('.', ',')} x ${Number(indicePercentAguaEstocada[0].aguaValue)}`,
                `${carbonoEstocado?.toFixed(2).replace('.', ',')}`,
            ];

            bodyCarbonoEstocado.push(bodyCarbono);

            //Monta a tabela com coordenadas e área de cada zona
            let bodyTeste = [
                titleZone,
            ];
            let stringCoords = '';
            for (var c = 0; c < pathZone.length; c++) {
                stringCoords += `| Ponto ${c + 1} - Lat: ${pathZone[c].lat}, Lng: ${pathZone[c].lng} `;
            }
            bodyTeste.push(stringCoords);
            bodyTeste.push(`${(resultZones[i].areaZone).toFixed(0)} m²`);
            bodyCoordsZonesTeste.push(bodyTeste);

            const analiseSolo = resultZones[i].analiseSolo;

            //Faz o cálculo da biomassa da zona
            let biomassaSolo = 0;
            saldoSoilAnaliseSoloZones += resultZones[i].areaZone;

            if (resultZones[i]?.soilUmid) {
                const calculoBiomassaSolo = (Number((((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) / 0.5) * resultZones[i].areaZone) * Number(indiceAnaliseSolo[0].carbonValue)) * Number(indiceFatorUmidade[0].carbonValue);
                saldoCarbonAnaliseSoloZones += calculoBiomassaSolo;
                biomassaSolo += calculoBiomassaSolo;
            } else {
                const calculoBiomassaSolo = Number((((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) / 0.5) * resultZones[i].areaZone) * Number(indiceAnaliseSolo[0].carbonValue);
                saldoCarbonAnaliseSoloZones += calculoBiomassaSolo;
                biomassaSolo += calculoBiomassaSolo;
            }

            //Monta o item da tabela para a análise de solo;
            const analiseSoloZone = [
                titleZone,
                `${areaZone.toFixed(2).replace('.', ',')}`,
                `${analiseSolo[0].value}`,
                `${analiseSolo[1].value}`,
                `${analiseSolo[2].value}`,
                `${analiseSolo[3].value}`,
                '0,5',
                `${resultZones[i]?.soilUmid ? 'Sim' : 'Não'}`,
                `(((${analiseSolo[0].value} + ${analiseSolo[1].value} + ${analiseSolo[2].value} + ${analiseSolo[3].value} / 4) / 0,5) x ${areaZone.toFixed(2).replace('.', ',')}) x ${indiceAnaliseSolo[0].carbonValue}`,
                `${(biomassaSolo).toFixed(2).replace('.', ',')} kg`
            ]
            bodyAnaliseSoloZones.push(analiseSoloZone);

            //Imagem das zonas
            for (var p = 0; p < photosZone.length; p++) {
                const dataImage = {
                    text: `${photosZone[p].photo}`,
                    link: `https://${window.location.host}/view-image/${photosZone[p].photo}`,
                    style: 'link'
                }
                let row = []
                row.push(titleZone);
                row.push(dataImage);
                rowPhotosZone.push(row);
            }

            //Cáculo da biodiversidade no solo de cada zona
            for (var s = 0; s < bioSoil.length; s++) {
                totalSoilBio += Number(bioSoil[s].value);

                const dataImage = {
                    text: `Foto`,
                    link: `https://app.sintrop.com/view-image/${bioSoil[s].photo}`,
                    style: 'link'
                }
                let row = []
                row.push(titleZone);
                row.push(`Lat: ${bioSoil[s]?.coord?.lat}, Lng: ${bioSoil[s]?.coord?.lng}`)
                row.push(dataImage);
                row.push(bioSoil[s]?.value)

                bodySoilBioPhoto.push(row);
            }

            //Calculo e montagem da tabela do registro de biodiversidade da zona
            for (var p = 0; p < analiseBio.length; p++) {
                totalBioZones += 1;

                const dataImage = {
                    text: `Foto`,
                    link: `https://app.sintrop.com/view-image/${analiseBio[p].photo}`,
                    style: 'link'
                }
                let row = []
                row.push(titleZone);
                row.push(dataImage);
                row.push(analiseBio[p]?.type)
                row.push(analiseBio[p]?.especieSelected?.name)
                rowAnaliseBio.push(row);
            }
        }

        let rowSoilBio = [
            'Solo',
            `${totalSoilBio}`,
        ];

        let rowBioZones = [
            'Zonas',
            `${totalBioZones}`,
        ];
        bodyBio.push(rowSoilBio);
        bodyBio.push(rowBioZones);
        const totalBioRegistered = Number(totalSoilBio) + totalBioZones;

        let rowBioTotal = [
            'Total',
            `${Number(totalBioRegistered).toFixed(0)} uv`
        ]

        bodyBio.push(rowBioTotal);

        //Verifica e calcula as nascentes
        let totalWaterSprings = 0;
        let bodySprings = [];
        if (springs.length > 0) {
            for (var sp = 0; sp < springs.length; sp++) {
                if (Number(springs[sp].value) > 20) {
                    totalWaterSprings += 1000;
                }
                if (Number(springs[sp].value) <= 20) {
                    totalWaterSprings += 100;
                }
                const dataImage = {
                    text: `${springs[sp].photo}`,
                    link: `https://${window.location.host}/view-image/${springs[sp].photo}`,
                    style: 'link'
                }

                let row = [];
                row.push(`Lat: ${springs[sp].coord.lat} | Lng: ${springs[sp].coord.lng}`);
                row.push(dataImage);
                row.push(`${springs[sp].value} cm`);
                bodySprings.push(row);
            }
        }

        let totalCarbon = degenerationCarbon + ((totalCarbonEstocadoZones * -1) * 1000) + saldoCarbonAnaliseSoloZones;
        let totalWater = degenerationWater + totalAguaEstocadaZones + totalWaterSprings;
        let totalBio = degenerationBio + totalSoilBio + totalBioZones;
        let totalSoil = degenerationSoil + saldoSoilAnaliseSoloZones;

        const resultIndices = {
            carbon: totalCarbon.toFixed(2),
            water: totalWater.toFixed(2),
            bio: totalBio.toFixed(2),
            soil: totalSoil.toFixed(2),
        }

        const pdfData = {
            bioPictures,
            bodyDegradacao,
            bodyResultInsumos,
            bodyInsumos,
            degenerationCarbon,
            degenerationWater,
            degenerationSoil,
            degenerationBio,
            saldoCarbonAnaliseSoloZones,
            saldoSoilAnaliseSoloZones,
            bodyAnaliseSoloZones,
            bodyCoordsZonesTeste,
            bodySampling1,
            bodyAguaEstocada,
            bodyCarbonoEstocado,
            totalAguaEstocadaZones,
            totalCarbonEstocadoZones,
            bodyVolumeZones,
            bodyResiduos,
            bodyIndices,
            bodyBio,
            volumeTotalZonas,
            estimatedTreesTotal,
            bodyEstimatedTrees,
            bodySoilBioPhoto,
            bodySoilBio,
            totalSoilBio,
            rowPhotosZone,
            totalWaterSprings,
            bodySprings,
            rowAnaliseBio,
            totalBioZones
        }

        return {
            resultIndices,
            pdfData
        }
    }

    async function finishNewVersion() {
        setLoading(true);
        let pdfDevHash = '';

        const inspectionData = await GetInspection(additionalData?.inspectionId);
        const producerData = await GetProducer(inspectionData?.createdBy);

        const response = await api.get(`/inspection/${additionalData?.inspectionId}`)
        if (response.data.inspection.status === 1) {
            setLoading(false);
            return;
        }

        //Busca todos os indices
        const responseIndices = await api.get('/subCategories');
        const indices = responseIndices.data.subCategories;

        const resultCategories = JSON.parse(response?.data?.inspection?.resultCategories);
        const inspection = response?.data?.inspection;
        const resultZones = JSON.parse(response?.data?.inspection?.zones);

        let springs = [];
        if (response?.data?.inspection?.springs) {
            const jsonSprings = JSON.parse(response?.data?.inspection?.springs);
            springs = jsonSprings;
        }

        //Função que calcula os indices e retorna os dados para o pdf
        const responseCalculo = await calculateIndices(indices, resultCategories, resultZones, springs);

        await api.put('/update-result', {
            id: String(additionalData?.inspectionId),
            result: JSON.stringify(responseCalculo)
        })

        const data1 = {
            resultIndices: responseCalculo.resultIndices,
            pdfBioHash: pdfDevHash,
            pdfAguaHash: pdfDevHash,
            pdfCarbonHash: pdfDevHash,
            pdfSoloHash: pdfDevHash
        }

        const infoData = {
            producerWallet: producerData?.producerWallet,
            producerName: producerData?.name,
            producerArea: producerData?.certifiedArea,
            inspectorWallet: walletAddress,
            date: format(new Date(), 'dd/MM/yyyy - kk:mm')
        }

        //Calcula os isas e filtra o index para resultado legível
        const isas = {
            carbon: await calculateCarboon(responseCalculo.resultIndices),
            water: await calculateWater(responseCalculo.resultIndices),
            soil: await calculateSolo(responseCalculo.resultIndices),
            bio: await calculateBio(responseCalculo.resultIndices),
        }

        const pdf = await pdfMake.createPdf(generatePdf(infoData, responseCalculo.resultIndices, resultCategories, resultZones, inspection, indices, responseCalculo.pdfData, isas, response.data.inspection.proofPhoto));
        pdf.open()
        setLoading(false);
        return
        pdf.getBuffer(async (res) => {
            const hash = await save(res);
            pdfDevHash = hash;

            createIsas(data1, 'phoenix', hash, producerData);
        })
    }

    async function createIsas(data, methodType, hashPdf, producerData) {
        setLoading(true)

        const carbonResult = calculateCarboon(data?.resultIndices);
        const waterResult = calculateWater(data?.resultIndices);
        const bioResult = calculateBio(data?.resultIndices);
        const soloResult = calculateSolo(data?.resultIndices);

        const carbonIndicator = Number(data?.resultIndices?.carbon).toFixed(0)
        const bioIndicator = Number(data?.resultIndices?.bio).toFixed(0)
        const aguaIndicator = Number(data?.resultIndices?.water).toFixed(0)
        const soloIndicator = Number(data?.resultIndices?.soil).toFixed(0)

        const resultIndices = {
            carbonIndicator,
            bioIndicator,
            aguaIndicator,
            soloIndicator
        }

        const carbon = {
            categoryId: 1,
            isaIndex: carbonResult,
            indicator: carbonIndicator
        }

        const bio = {
            categoryId: 2,
            isaIndex: bioResult,
            indicator: bioIndicator
        }

        const water = {
            categoryId: 3,
            isaIndex: waterResult,
            indicator: aguaIndicator
        }

        const solo = {
            categoryId: 4,
            isaIndex: soloResult,
            indicator: soloIndicator
        }

        setLoading(false);
        const arrayIsas = [
            { categoryId: carbon.categoryId, isaIndex: carbon.isaIndex, indicator: carbon.indicator },
            { categoryId: bio.categoryId, isaIndex: bio.isaIndex, indicator: bio.indicator },
            { categoryId: solo.categoryId, isaIndex: solo.isaIndex, indicator: solo.indicator },
            { categoryId: water.categoryId, isaIndex: water.isaIndex, indicator: water.indicator }
        ];

        console.log(arrayIsas)

        finishInspectionBlockchain(arrayIsas, resultIndices, methodType, producerData, hashPdf)
    }

    async function finishInspectionBlockchain(isas, resultIndices, methodType, producerData, hashPdf) {
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(
            String(additionalData?.inspectionId),
            isas,
            walletAddress,
            hashPdf
        )
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                attNetworkImpact(resultIndices, methodType, producerData);

                const dataNotification = {
                    text1: 'Completed your inspection',
                    text2: 'Check the results of your inspection',
                    inspectionId: additionalData?.inspectionId
                }

                if (res.type === 'success') {
                    api.post('/notifications/send', {
                        from: walletAddress,
                        type: 'finalize-inspection',
                        data: JSON.stringify(dataNotification),
                        for: producerData?.producerWallet
                    });

                    api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'realize-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            userData,
                            inspectionId: additionalData?.inspectionId,
                            hash: res?.hashTransaction
                        }),
                    });
                    await api.put('/transactions-open/finish', { id: transaction?.id })
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message)
                if (message.includes("Can't accept yet")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Can't accept yet",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Inspection Expired")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Inspection Expired!',
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Please register as activist")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Please register as activist!',
                        hash: ''
                    })
                    return;
                }
                if (message.includes("This inspection don't exists")) {
                    setLogTransaction({
                        type: 'error',
                        message: "This inspection don't exists!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Accept this inspection before")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Accept this inspection before!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("You not accepted this inspection")) {
                    setLogTransaction({
                        type: 'error',
                        message: "You not accepted this inspection!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Cannot read properties of undefined (reading 'length')")) {
                    setLogTransaction({
                        type: 'error',
                        message: "Fill in all category data!",
                        hash: ''
                    })
                    return;
                }
                if (message.includes('invalid BigNumber string (argument="value", value="", code=INVALID_ARGUMENT, version=bignumber/5.6.2)')) {
                    setLogTransaction({
                        type: 'error',
                        message: "Fill in all category data!",
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

    function calculateCarboon(data) {
        let result = 3;
        const carbon = data.carbon;

        if (carbon < 0) {
            if (Math.abs(carbon) > 0 && Math.abs(carbon) < 100000) {
                result = 2
            }
            if (Math.abs(carbon) >= 100000 && Math.abs(carbon) < 1000000) {
                result = 1
            }
            if (Math.abs(carbon) >= 1000000) {
                result = 0
            }
        }
        if (carbon >= 1000000) {
            result = 6
        }
        if (carbon >= 100000 && carbon < 1000000) {
            result = 5
        }
        if (carbon > 0 && carbon < 100000) {
            result = 4
        }
        if (carbon === 0) {
            result = 3
        }

        return result;
    }

    function calculateWater(data) {
        let result = 0;
        const water = data.water;

        if (water < 0) {
            if (Math.abs(water) > 0 && Math.abs(water) < 10) {
                result = 4
            }
            if (Math.abs(water) < 100 && Math.abs(water) >= 10) {
                result = 5
            }
            if (Math.abs(water) > 100) {
                result = 6
            }
        }
        if (water >= 100) {
            result = 0
        }
        if (water >= 10 && water < 100) {
            result = 1
        }
        if (water > 0 && water < 10) {
            result = 2
        }
        if (water === 0) {
            result = 3
        }

        return result;
    }

    function calculateBio(data) {
        let result = 0;
        const bio = Number(data.bio);

        if (bio < 0) {
            if (Math.abs(bio) > 0 && Math.abs(bio) < 100) {
                result = 4
                return result;
            }
            if (Math.abs(bio) >= 100 && Math.abs(bio) < 1000) {
                result = 5
                return result;
            }
            if (Math.abs(bio) >= 1000) {
                result = 6
                return result;
            }
        }
        if (bio >= 1000) {
            result = 0
            return result;
        }
        if (bio < 1000 && bio >= 100) {
            result = 1
            return result;
        }
        if (bio < 100 && bio > 0) {
            result = 2
            return result;
        }
        if (bio === 0) {
            result = 3
            return result;
        }
    }

    function calculateSolo(data) {
        const soil = Number(data.soil) / 10000;

        let result = 0;
        if (soil < 0) {
            if (Math.abs(soil) > 0 && Math.abs(soil) < 1) {
                result = 4
            }
            if (Math.abs(soil) < 2 && Math.abs(soil) >= 1) {
                result = 5
            }
            if (Math.abs(soil) >= 2) {
                result = 6
            }
        }
        if (soil >= 100) {
            result = 0
        }
        if (soil >= 2 && soil < 100) {
            result = 1
        }
        if (soil > 0 && soil < 2) {
            result = 2
        }
        if (soil === 0) {
            result = 3
        }

        return result;
    }

    async function attNetworkImpact(resultIndices, methodType, producerData) {
        await api.put('/impact-user', {
            producerWallet: producerData?.producerWallet
        });

        const response = await api.get('/new-network-impact');
        await api.put('/transactions-open/finish', { id: transaction.id });
        setLoadingTransaction(false);
    }

    //----------- FINISH INSPECTION ---------------------^^^^^^^^

    async function requestInspection() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        RequestInspection(walletAddress)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                setLoadingTransaction(false);

                const dataNotification = {
                    text1: 'Request new inspection',
                    text2: ''
                }

                if (res.type === 'success') {
                    api.post('/notifications/send', {
                        from: walletAddress,
                        group: 'inspectors',
                        type: 'request-inspection',
                        data: JSON.stringify(dataNotification),
                        for: 'inspectors'
                    });

                    api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'request-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            userData,
                            hash: res?.hashTransaction
                        })
                    });

                    api.put('/transactions-open/finish', { id: transaction.id });
                    attTransactions();
                }



            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
                        hash: ''
                    })
                    return;
                }
                if (message.includes("Recent inspection")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Recent inspection!',
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

    async function buyTokens() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        BuyRCT(walletAddress, additionalData?.value)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                setLoadingTransaction(false);

                if (res.type === 'success') {
                    api.put('/transactions-open/finish', { id: transaction.id });

                    attTransactions();
                }

            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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

    //------------ BURN TOKENS ---------------
    async function burnTokens() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        if (userData.userType === 7) {
            BurnRCSupporter(walletAddress, String(additionalData?.value) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });
                        registerTokensApi(additionalData?.value, res.hashTransaction)
                        attTransactions();
                        if (additionalData?.invoiceData) {
                            attValuesInvoice();
                        }
                    }

                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        } else {
            BurnTokens(walletAddress, String(additionalData?.value) + '000000000000000000')
                .then(res => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });
                        registerTokensApi(additionalData?.value, res.hashTransaction)
                        attTransactions();
                        if (additionalData?.invoiceData) {
                            attValuesInvoice();
                        }
                    }

                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    setLogTransaction({
                        type: 'error',
                        message: 'Something went wrong with the transaction, please try again!',
                        hash: ''
                    })
                })
        }
    }

    async function registerTokensApi(tokens, hash) {
        const addData = {
            userData,
            tokens: Number(tokens),
            transactionHash: hash,
            hash,
            reason: additionalData?.reason,
            itens: additionalData?.itens,
            invoiceData: additionalData?.invoiceData,
            typePayment: additionalData?.typePayment,
        }

        try {
            await api.post('/tokens-burned', {
                wallet: walletAddress.toUpperCase(),
                tokens: Number(tokens),
                transactionHash: hash,
                carbon: Number(impactToken?.carbon),
                water: Number(impactToken?.water),
                bio: Number(impactToken?.bio),
                soil: Number(impactToken?.soil)
            });

            await api.post('/publication/new', {
                userId: userData?.id,
                type: 'contribute-tokens',
                origin: 'platform',
                additionalData: JSON.stringify(addData),
            });

            if (additionalData?.itens?.length > 0) {
                await api.post('/calculator/items/contribution', {
                    userId: userData?.id,
                    items: JSON.stringify(additionalData?.itens)
                })
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingTransaction(false);
        }
    }

    async function attValuesInvoice() {
        if (additionalData?.typePayment === 'partial') {
            const response = await api.get(`/invoice/${additionalData?.invoiceData?.id}`);
            const ammountReceived = response.data.invoice?.ammountReceived;
            const newAmmount = ammountReceived + Number(additionalData?.value);

            try {
                await api.put('/invoice', {
                    invoiceId: response.data.invoice?.id,
                    ammountReceived: Number(newAmmount)
                })
            } catch (err) {
                console.log(err);
            }
        }

        if (additionalData?.typePayment === 'total') {
            const response = await api.get('/impact-per-token');
            const impact = response.data.impact;

            try {
                await api.put('/invoice', {
                    invoiceId: additionalData?.invoiceData?.id,
                    ammountReceived: Number(additionalData?.value),
                    impactTokenCarbon: impact?.carbon,
                    impactTokenWater: impact?.water,
                    impactTokenSoil: impact?.soil,
                    impactTokenBio: impact?.bio,
                })
            } catch (err) {
                console.log(err);
            }
        }
    }
    //------------ BURN TOKENS ---------------

    //------------ Invalidate inspection ---------------
    async function invalidateInspection() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        InvalidateInspection(walletAddress, additionalData?.inspection?.id, additionalData?.justification)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                const addData = {
                    ...additionalData,
                    hash: res.hashTransaction,
                }

                if (res.type === 'success') {
                    api.put('/transactions-open/finish', { id: transaction.id });

                    attTransactions();

                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'vote-invalidate-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify(addData),
                    });

                    //reduceImpact(additionalData?.inspection?.id)
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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

    async function reduceImpact(id) {
        const inspection = await GetInspection(id);

        if (Number(inspection?.validationsCount) !== 0) {
            setLoadingTransaction(false);
            return;
        }

        const isas = await GetIsa(id);

        const carbon = isas.filter(item => item.categoryId === '1');
        const bio = isas.filter(item => item.categoryId === '2');
        const water = isas.filter(item => item.categoryId === '3');
        const soil = isas.filter(item => item.categoryId === '4');

        const response = await api.get('/network-impact');
        const impact = response.data.impact;
        const networkImpact = impact.filter(item => item.id === '1');
        const sintropImpact = impact.filter(item => item.id === '2');

        const newCarbonNetwork = networkImpact[0].carbon + Math.abs(carbon[0].indicator);
        const newBioNetwork = networkImpact[0].bio - Math.abs(bio[0].indicator);
        const newWaterNetwork = networkImpact[0].agua - Math.abs(water[0].indicator);
        const newSoilNetwork = networkImpact[0].solo - Math.abs(soil[0].indicator);

        try {
            await api.put('/network-impact', {
                carbon: newCarbonNetwork,
                agua: newWaterNetwork,
                bio: newBioNetwork,
                solo: newSoilNetwork,
                id: '1'
            });
        } catch (err) {

        }

        const newCarbonSintrop = sintropImpact[0].carbon + Math.abs(carbon[0].indicator);
        const newBioSintrop = sintropImpact[0].bio - Math.abs(bio[0].indicator);
        const newWaterSintrop = sintropImpact[0].agua - Math.abs(water[0].indicator);
        const newSoilSintrop = sintropImpact[0].solo - Math.abs(soil[0].indicator);

        try {
            await api.put('/network-impact', {
                carbon: newCarbonSintrop,
                agua: newWaterSintrop,
                bio: newBioSintrop,
                solo: newSoilSintrop,
                id: '2'
            });
        } catch (err) {

        }


        setLoadingTransaction(false);
    }

    async function invalidateUser() {
        let walletToVote = '';

        if (additionalData?.userToVote?.userType === 1) {
            walletToVote = additionalData?.userToVote?.producerWallet;
        }
        if (additionalData?.userToVote?.userType === 2) {
            walletToVote = additionalData?.userToVote?.inspectorWallet;
        }
        if (additionalData?.userToVote?.userType === 3) {
            walletToVote = additionalData?.userToVote?.researcherWallet;
        }
        if (additionalData?.userToVote?.userType === 4) {
            walletToVote = additionalData?.userToVote?.developerWallet;
        }
        if (additionalData?.userToVote?.userType === 7) {
            walletToVote = additionalData?.userToVote?.supporterWallet;
        }

        setModalTransaction(true);
        setLoadingTransaction(true);
        addValidation(walletAddress, walletToVote, additionalData?.justification)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                const addData = {
                    ...additionalData,
                    hash: res.hashTransaction,
                }

                if (res.type === 'success') {
                    api.put('/transactions-open/finish', { id: transaction.id });

                    attTransactions();

                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'vote-invalidate-user',
                        origin: 'platform',
                        additionalData: JSON.stringify(addData),
                    });

                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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

    //--------------- Relatório de desenvolvimento-----------------
    async function sendDevReport() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        InvalidateInspection(walletAddress, additionalData?.inspection?.id, additionalData?.justification)
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });
                const addData = {
                    ...additionalData,
                    hash: res.hashTransaction,
                }

                if (res.type === 'success') {
                    api.put('/transactions-open/finish', { id: transaction.id });

                    attTransactions();

                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'vote-invalidate-inspection',
                        origin: 'platform',
                        additionalData: JSON.stringify(addData),
                    });

                }
                setLoadingTransaction(false);
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if (message.includes("Request OPEN or ACCEPTED")) {
                    setLogTransaction({
                        type: 'error',
                        message: 'Request OPEN or ACCEPTED',
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

    //----------------Sacar tokens -------------------------
    async function withdraw() {
        if (userData?.userType === 4) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawDeveloper(walletAddress)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });

                        attTransactions();

                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction,
                                hash: res.hashTransaction
                            }),
                        });

                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
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

        if (userData?.userType === 1) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawProducer(walletAddress)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });

                        attTransactions();

                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction,
                                hash: res.hashTransaction
                            }),
                        });

                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
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

        if (userData?.userType === 2) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawInspector(walletAddress)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });
                    console.log(res)

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });

                        attTransactions();

                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction,
                                hash: res.hashTransaction
                            }),
                        });

                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
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

        if (userData?.userType === 3) {
            setModalTransaction(true);
            setLoadingTransaction(true);
            WithdrawResearcher(walletAddress)
                .then(async (res) => {
                    setLogTransaction({
                        type: res.type,
                        message: res.message,
                        hash: res.hashTransaction
                    });

                    if (res.type === 'success') {
                        api.put('/transactions-open/finish', { id: transaction.id });

                        attTransactions();

                        await api.post('/publication/new', {
                            userId: userData?.id,
                            type: 'withdraw-tokens',
                            origin: 'platform',
                            additionalData: JSON.stringify({
                                userData,
                                transactionHash: res.hashTransaction,
                                hash: res.hashTransaction,
                            }),
                        });

                    }
                    setLoadingTransaction(false);
                })
                .catch(err => {
                    setLoadingTransaction(false);
                    const message = String(err.message);
                    console.log(message);
                    if (message.includes("Request OPEN or ACCEPTED")) {
                        setLogTransaction({
                            type: 'error',
                            message: 'Request OPEN or ACCEPTED',
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
    }

    //-------------- invite user -------------------
    async function inviteUser() {
        setModalTransaction(true);
        setLoadingTransaction(true);
        Invite(walletAddress, String(additionalData?.userWallet).toLowerCase(), Number(additionalData?.userType))
            .then(async (res) => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                });

                if (res.type === 'success') {
                    await api.post('/publication/new', {
                        userId: userData?.id,
                        type: 'invite-wallet',
                        origin: 'platform',
                        additionalData: JSON.stringify({
                            hash: res.hashTransaction,
                            walletInvited: additionalData?.userWallet,
                            userType: Number(additionalData?.userType),
                            userData
                        }),
                    });

                    api.put('/transactions-open/finish', { id: transaction.id });
                    attTransactions();
                }
                setLoadingTransaction(false);
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            })

    }

    return (
        <div className='flex flex-col p-2 rounded-md w-full max-w-[320px] bg-[#0a4303] mb-2'>
            <p className='font-bold text-sm flex gap-1 text-white'>
                Tipo da transação:

                <p className='font-normal'>
                    {transaction?.type === 'register' && 'Cadastro'}
                    {transaction?.type === 'request-inspection' && 'Solicitação de inspeção'}
                    {transaction?.type === 'accept-inspection' && 'Aceitar inspeção'}
                    {transaction?.type === 'realize-inspection' && 'Finalizar inspeção'}
                    {transaction?.type === 'buy-tokens' && 'Compra de RC'}
                    {transaction?.type === 'burn-tokens' && 'Contribuição'}
                    {transaction?.type === 'invalidate-inspection' && 'Invalidar inspeção'}
                    {transaction?.type === 'dev-report' && 'Relatório de contribuição'}
                    {transaction?.type === 'withdraw-tokens' && 'Sacar tokens'}
                    {transaction?.type === 'invalidate-user' && 'Invalidar usuário'}
                    {transaction?.type === 'invite-user' && 'Convidar usuário'}
                </p>
            </p>

            <button
                className="w-full rounded-lg py-1 bg-[#3E9EF5] font-bold text-white mt-5"
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

            {loadingData && (
                <Loading />
            )}

            {loading && (
                <Loading />
            )}

            {modalDescart && (
                <>
                    <ConfirmDescart
                        close={async (confirm) => {
                            if (confirm) {
                                setModalDescart(false);
                                await api.put('/transactions-open/finish', { id: transaction.id, toDiscard: true });
                                attTransactions();

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
                        if (success) {
                            setModalChangePassword(false);
                            toast.success('Senha alterada com sucesso!')
                        } else {
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
                            attTransactions();

                        }
                    }
                }}>
                    <LoadingTransaction
                        loading={loadingTransaction}
                        logTransaction={logTransaction}
                    />
                </Dialog.Root>
            </div>

            <ToastContainer position='top-center' />
        </div>
    )
}