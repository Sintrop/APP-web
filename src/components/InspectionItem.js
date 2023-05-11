import React, {useEffect, useState} from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import { api } from '../services/api';
import {useMainContext} from '../hooks/useMainContext';
import { ToastContainer, toast } from 'react-toastify';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from './LoadingTransaction';
import { useParams } from 'react-router';
import { AcceptInspection, RealizeInspection } from '../services/manageInspectionsService';
import {GetProducer} from '../services/producerService';
import { ModalChooseMethod } from './ModalChooseMethod';
import {ViewResultInspection} from './ViewResultInspection';
import Loading from '../components/Loading';
import {save} from '../config/infura';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function InspectionItem({data, type, reload}){
    const {walletAddress} = useParams();
    const {user, blockNumber} = useMainContext();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);
    const [status, setStatus] = useState('0');
    const [producerData, setProducerData] = useState({});
    const [producerDataApi, setProducerDataApi] = useState([]);
    const [producerAddress, setProducerAddress] = useState({});
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [openModalChooseMethod, setOpenModalChooseMethod] = useState(false);
    const [modalViewResult, setModalViewResult] = useState(false);

    
    useEffect(() => {
        getProducerDataApi();
        getProducer();
        validateStatus(data.status);
    }, [data]);
    
    function generatePdf(inspection, indiceReport, resultCategories, resultIndices){
        console.log(resultCategories);
        const categoriesDegeneration = resultCategories.filter(item => JSON.parse(item.categoryDetails).category === '1')
        const categoriesRegeneration = resultCategories.filter(item => JSON.parse(item.categoryDetails).category === '2')
        
        if(indiceReport === 'carbon'){
            return {
                content: [
                    {
                        text: `Inspeção #${inspection.inspectionId}`,
                        style: 'header'
                    },
                    {
                        text: `Carbon Report`,
                        style: 'subheader'
                    },
                    'Producer Wallet:',
                    {
                        text: `${inspection.createdBy}`,
                        style: 'descriptionInfo'
                    },
    
                    'Activist Wallet:',
                    {
                        text: `${inspection.userWallet}`,
                        style: 'descriptionInfo'
                    },
    
                    {
                        text: `1. Qual o saldo de carbono do produtor? Justifique sua resposta`,
                        style: 'subheader'
                    },
                    {
                        text: `${resultIndices?.carbon} kg CO2 / era`,
                        style: 'resultIndice'
                    },
                    '1. Insumos de Degeneração:',
                    `${categoriesDegeneration.map(item => {
                        const carbonValue = Number(JSON.parse(item.categoryDetails).carbonValue)
                        if(item){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${carbonValue} = ${Number(item.value) * carbonValue} kg Co²`,
                                ]
                            )
                        }
                        
                    })}`,
    
                    '\n2. Insumos de Regeneração:',
                    `${categoriesRegeneration.map(item => {
                        const carbonValue = Number(JSON.parse(item.categoryDetails).carbonValue)
                        if(item.value !== '0'){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${carbonValue} = ${Number(item.value) * carbonValue} kg Co²`,
                                ]
                            )
                        }
                        
                    })}`
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        marginBottom: 15
                    },
                    subheader: {
                        fontSize: 15,
                        bold: true,
                        marginTop: 10
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    }
                }
                
            }
        }

        if(indiceReport === 'solo'){
            return {
                content: [
                    {
                        text: `Inspeção #${inspection.inspectionId}`,
                        style: 'header'
                    },
                    {
                        text: `Solo Report`,
                        style: 'subheader'
                    },
                    'Producer Wallet:',
                    {
                        text: `${inspection.createdBy}`,
                        style: 'descriptionInfo'
                    },
    
                    'Activist Wallet:',
                    {
                        text: `${inspection.userWallet}`,
                        style: 'descriptionInfo'
                    },
    
                    {
                        text: `1. Qual o saldo de solo do produtor? Justifique sua resposta`,
                        style: 'subheader'
                    },
                    {
                        text: `${resultIndices?.solo} m² / era`,
                        style: 'resultIndice'
                    },
                    '1. Insumos de Degeneração:',
                    `${categoriesDegeneration.map(item => {
                        const soloValue = Number(JSON.parse(item.categoryDetails).soloValue)
                        if(item){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${soloValue} = ${Number(item.value) * soloValue} m²`,
                                ]
                            )
                        }
                        
                    })}`,
    
                    '\n2. Insumos de Regeneração:',
                    'Solo regenerado: 11.356 m²'
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        marginBottom: 15
                    },
                    subheader: {
                        fontSize: 15,
                        bold: true,
                        marginTop: 10
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    }
                }
                
            }
        }

        if(indiceReport === 'agua'){
            return {
                content: [
                    {
                        text: `Inspeção #${inspection.inspectionId}`,
                        style: 'header'
                    },
                    {
                        text: `Water Report`,
                        style: 'subheader'
                    },
                    'Producer Wallet:',
                    {
                        text: `${inspection.createdBy}`,
                        style: 'descriptionInfo'
                    },
    
                    'Activist Wallet:',
                    {
                        text: `${inspection.userWallet}`,
                        style: 'descriptionInfo'
                    },
    
                    {
                        text: `1. Qual o saldo de água do produtor? Justifique sua resposta`,
                        style: 'subheader'
                    },
                    {
                        text: `${resultIndices?.agua} m³ / era`,
                        style: 'resultIndice'
                    },
                    '1. Insumos de Degeneração:',
                    `${categoriesDegeneration.map(item => {
                        const aguaValue = Number(JSON.parse(item.categoryDetails).aguaValue)
                        if(item){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${aguaValue} = ${Number(item.value) * aguaValue} m³`,
                                ]
                            )
                        }
                        
                    })}`,
    
                    '\n2. Insumos de Regeneração:',
                    `${categoriesRegeneration.map(item => {
                        const aguaValue = Number(JSON.parse(item.categoryDetails).aguaValue)
                        if(item.value !== '0'){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${aguaValue} = ${Number(item.value) * aguaValue} m³`,
                                ]
                            )
                        }
                        
                    })}`
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        marginBottom: 15
                    },
                    subheader: {
                        fontSize: 15,
                        bold: true,
                        marginTop: 10
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    }
                }
                
            }
        }

        if(indiceReport === 'bio'){
            return {
                content: [
                    {
                        text: `Inspeção #${inspection.inspectionId}`,
                        style: 'header'
                    },
                    {
                        text: `Biodiversity Report`,
                        style: 'subheader'
                    },
                    'Producer Wallet:',
                    {
                        text: `${inspection.createdBy}`,
                        style: 'descriptionInfo'
                    },
    
                    'Activist Wallet:',
                    {
                        text: `${inspection.userWallet}`,
                        style: 'descriptionInfo'
                    },
    
                    {
                        text: `1. Qual o saldo de biodiversidade do produtor? Justifique sua resposta`,
                        style: 'subheader'
                    },
                    {
                        text: `${resultIndices?.bio} unidades de vida / era`,
                        style: 'resultIndice'
                    },
                    '1. Insumos de Degeneração:',
                    `${categoriesDegeneration.map(item => {
                        const bioValue = Number(JSON.parse(item.categoryDetails).bioValue)
                        if(item){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${bioValue} = ${Number(item.value) * bioValue} uni`,
                                ]
                            )
                        }
                        
                    })}`,
    
                    '\n2. Insumos de Regeneração:',
                    `${categoriesRegeneration.map(item => {
                        const bioValue = Number(JSON.parse(item.categoryDetails).bioValue)
                        if(item.value !== '0'){
                            return(
                                [
                                    `\n${item.title}: ${item.value} x ${bioValue} = ${Number(item.value) * bioValue} uni`,
                                ]
                            )
                        }
                        
                    })}`
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        marginBottom: 15
                    },
                    subheader: {
                        fontSize: 15,
                        bold: true,
                        marginTop: 10
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    }
                }
                
            }
        }
    }

    async function getProducer() {
        setLoading(true);
        const response = await GetProducer(data?.createdBy)
        setProducerData(response);
        setLoading(false);
    }

    async function getProducerDataApi(){
        try{
            const response = await api.get(`/user/${String(data?.createdBy).toUpperCase()}`);
            setProducerDataApi(response.data.user);
            const address = JSON.parse(response.data.user.address);
            setProducerAddress(address);
        }catch(err){
            console.log(err);
        }
    }

    function handleAccept(){
        if(user !== '2'){
            toast.error(`${t('This account is not activist')}!`);
            return;
        }
        if(data.status === '2'){
            toast.error(`${t('This inspection has been inspected')}!`);
            return;
        }
        if(data.status === '3'){
            toast.error(`${t('This inspection has been expired')}!`);
            return;
        }
        if(data.status === '1'){
            toast.error(`${t('This inspection has been accepted')}!`);
            return;
        }

        if(!producerData || !producerDataApi){
            return;
        }
        
        acceptInspection();
    }

    async function acceptInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        AcceptInspection(data.id, walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
            registerInspectionAPI();
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            if(message.includes("Can't accept yet")){
                setLogTransaction({
                    type: 'error',
                    message: "Can't accept yet",
                    hash: ''
                })
                return;
            }
            if(message.includes("Please register as activist")){
                setLogTransaction({
                    type: 'error',
                    message: "Please register as activist!",
                    hash: ''
                })
                return;
            }
            if(message.includes("This inspection don't exists")){
                setLogTransaction({
                    type: 'error',
                    message: "This inspection don't exists!",
                    hash: ''
                })
                return;
            }
            if(message.includes("Already inspected this producer")){
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

    async function registerInspectionAPI(){
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

        try{
            await api.post('/inspections',{
                inspectionId: String(data.id),
                createdBy: String(data.createdBy),
                createdAt: String(data.createdAtTimestamp),
                userWallet: String(walletAddress).toUpperCase(),
                propertyData
            })
        }catch(err){
            console.log(err);
        }finally{

        }
    }

    function handleRealize(){
        //registerInspectionAPI()
        setOpenModalChooseMethod(true);
    }

    function validateStatus(status){
        if(status === '0' || status === '2'){
            setStatus(status)
        }
        if(status === '1'){
            if(Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION) < Number(blockNumber)){
                setStatus('3')
            }else{
                setStatus('1')
            }
        }
    }

    async function finishInspection(){
        setLoading(true);
        let pdfCarbonHash = '';
        let pdfSoloHash = '';
        let pdfAguaHash = '';
        let pdfBioHash = '';

        const response = await api.get(`/inspection/${data.id}`)
        if(response.data.inspection.status === 1){
            alert('Realize a inspeção no app do ativista para smartphone!')
            setLoading(false);
            return;
        }
        const resultIndices = JSON.parse(response?.data?.inspection?.resultIdices);
        const resultCategories = JSON.parse(response?.data?.inspection?.resultCategories);
        const inspection = response?.data?.inspection

        const pdfCarbon = await pdfMake.createPdf(generatePdf(inspection, 'carbon', resultCategories, resultIndices));
        const pdfSolo = await pdfMake.createPdf(generatePdf(inspection, 'solo', resultCategories, resultIndices));
        const pdfAgua = await pdfMake.createPdf(generatePdf(inspection, 'agua', resultCategories, resultIndices));
        const pdfBio = await pdfMake.createPdf(generatePdf(inspection, 'bio', resultCategories, resultIndices));
        
        pdfCarbon.getBuffer(async (res) => {
            const hash = await save(res);
            pdfCarbonHash = hash;

            pdfSolo.getBuffer(async (res) => {
                const hash = await save(res);
                pdfSoloHash = hash;

                pdfAgua.getBuffer(async (res) => {
                    const hash = await save(res);
                    pdfAguaHash = hash;

                    pdfBio.getBuffer(async (res) => {
                        const hash = await save(res);
                        pdfBioHash = hash;

                        const data = {
                            resultIndices,
                            pdfBioHash,
                            pdfAguaHash,
                            pdfCarbonHash,
                            pdfSoloHash
                        }
                        createIsas(data)
                    })
                })
            });
        });



    }
    
    async function createIsas(data){
        let isas = [];
        
        const carbonResult = calculateCarboon(data?.resultIndices);
        const waterResult = calculateWater(data?.resultIndices);
        const bioResult = calculateBio(data?.resultIndices);
        const soloResult = calculateSolo(data?.resultIndices);
    
        const carbonIndicator = Number(data?.resultIndices?.carbon).toFixed(0)
        const bioIndicator = Number(data?.resultIndices?.bio).toFixed(0)
        const aguaIndicator = Number(data?.resultIndices?.agua).toFixed(0)
        const soloIndicator = Number(data?.resultIndices?.solo).toFixed(0)
        
        const carbon = {
            categoryId: 1,
            isaIndex: carbonResult,
            report: data?.pdfCarbonHash,
            indicator: carbonIndicator
        }
        isas.push(carbon);

        const bio = {
            categoryId: 2,
            isaIndex: bioResult,
            report: data?.pdfBioHash,
            indicator: bioIndicator
        }
        isas.push(bio);

        const water = {
            categoryId: 3,
            isaIndex: waterResult,
            report: data?.pdfAguaHash,
            indicator: aguaIndicator
        }
        isas.push(water);

        const solo = {
            categoryId: 4,
            isaIndex: soloResult,
            report: data?.pdfSoloHash,
            indicator: soloIndicator
        }
        isas.push(solo);
        setLoading(false);
        finishInspectionBlockchain(isas)
    }

    async function finishInspectionBlockchain(isas){
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(data.id, isas, walletAddress)
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
            console.log(message)
            if(message.includes("Can't accept yet")){
                setLogTransaction({
                    type: 'error',
                    message: "Can't accept yet",
                    hash: ''
                })
                return;
            }
            if(message.includes("Inspection Expired")){
                setLogTransaction({
                    type: 'error',
                    message: 'Inspection Expired!',
                    hash: ''
                })
                return;
            }
            if(message.includes("Please register as activist")){
                setLogTransaction({
                    type: 'error',
                    message: 'Please register as activist!',
                    hash: ''
                })
                return;
            }
            if(message.includes("This inspection don't exists")){
                setLogTransaction({
                    type: 'error',
                    message: "This inspection don't exists!",
                    hash: ''
                })
                return;
            }
            if(message.includes("Accept this inspection before")){
                setLogTransaction({
                    type: 'error',
                    message: "Accept this inspection before!",
                    hash: ''
                })
                return;
            }
            if(message.includes("You not accepted this inspection")){
                setLogTransaction({
                    type: 'error',
                    message: "You not accepted this inspection!",
                    hash: ''
                })
                return;
            }
            if(message.includes("Cannot read properties of undefined (reading 'length')")){
                setLogTransaction({
                    type: 'error',
                    message: "Fill in all category data!",
                    hash: ''
                })
                return;
            }
            if(message.includes('invalid BigNumber string (argument="value", value="", code=INVALID_ARGUMENT, version=bignumber/5.6.2)')){
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

    function calculateCarboon(data){
        let result = 0;
        if(data.carbon >= 1){
            result = 4  
        }
        if(data.carbon < 1 && data.carbon > 0){
            result = 3
        }
        if(data.carbon === 0){
            result = 2  
        }
        if(data.carbon < 0 && data.carbon > -1){
            result = 1
        }
        if(data.carbon <= -1 ){
            result = 0
        }

        return result;
    }

    function calculateWater(data){
        let result = 0;
        if(data.agua >= 10){
            result = 0 
        }
        if(data.agua < 10 && data.agua > 0){
            result = 1
        }
        if(data.agua === 0){
            result = 2  
        }
        if(data.agua < 0 && data.agua > -10){
            result = 3
        }
        if(data.agua <= -10 ){
            result = 4
        }

        return result;
    }

    function calculateBio(data){
        let result = 0;
        if(data.bio >= 100){
            result = 0 
        }
        if(data.bio < 100 && data.bio > 0){
            result = 1
        }
        if(data.bio === 0){
            result = 2  
        }
        if(data.bio < 0 && data.bio > -100){
            result = 3
        }
        if(data.bio <= -100 ){
            result = 4
        }

        return result;
    }

    function calculateSolo(data){
        let result = 0;
        if(data.solo >= 100){
            result = 0 
        }
        if(data.solo < 100 && data.solo > 0){
            result = 1
        }
        if(data.solo === 0){
            result = 2  
        }
        if(data.solo < 0 && data.solo > -100){
            result = 3
        }
        if(data.solo <= -100 ){
            result = 4
        }
        return result;
    }

    return(
        <div className='flex flex-col'>
            <div className="flex items-center w-full py-2 gap-3 bg-[#0a4303]">
                <div className='flex items-center lg:w-[300px] bg-[#0A4303] px-2'>
                    <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.createdBy}</p>
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-full bg-[#0A4303]'>
                        <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                    </div>
                )}

                <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.acceptedBy}</p>
                </div>

                <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white '>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303] text-white'>
                        {status === '0' && (
                            <p>{t('Not accepted')}</p>
                        )}
                        {status === '1' && (
                            <p>{t('Expires in')} {(Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION)) - Number(blockNumber)} blocks</p>
                        )}
                        {status === '2' && (
                            <p>{t('Inspected')}</p>
                        )}
                        {status === '3' && (
                            <p>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(process.env.REACT_APP_BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION))} blocks</p>
                        )}
                    </div>
                )}

                {type === 'manage' && (
                    <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                        {status === '0' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#F4A022]'>
                                <p className='text-xs text-white font-bold'>{t('OPEN')}</p>
                            </div>
                        )}

                        {status === '1' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#3E9EF5]'>
                                <p className='text-xs text-white font-bold'>{t('ACCEPTED')}</p>
                            </div>
                        )}

                        {status === '2' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#2AC230]'>
                                <p className='text-xs text-white font-bold'>{t('INSPECTED')}</p>
                            </div>
                        )}

                        {status === '3' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#C52A15]'>
                                <p className='text-xs text-white font-bold'>{t('EXPIRED')}</p>
                            </div>
                        )}
                    </div>
                )}

                {type === 'history' && (
                    <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                        <p className='text-white'>{data.isaScore}</p>
                    </div>
                )}

                <div className='flex justify-end pr-2 items-center h-full w-[300px] bg-[#0A4303]'>
                    {type === 'history' && (
                        <>
                        <button
                            onClick={() => {
                                setModalViewResult(true)
                            }}
                            className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
                        >
                            {t('See Result')}
                        </button>
                        </>
                    )}

                    {type === 'manage' && (
                        <>
                            <div className='flex lg:hidden'>
                                <button
                                    onClick={() => setMoreInfo(!moreInfo)}
                                >
                                    {moreInfo ? (
                                        <AiFillCaretUp
                                            size={30}
                                            color='white'
                                        />    
                                    ) : (
                                        <AiFillCaretDown
                                            size={30}
                                            color='white'
                                        />
                                    )}
                                </button>
                            </div>
                            <div className='hidden lg:flex w-full h-full'>
                                {user === '2' && (
                                    <button
                                        onClick={() => {
                                            if(data.status === '0'){
                                                handleAccept()
                                            }
                                            if(data.status === '1'){
                                                handleRealize()
                                            }
                                        }}
                                        className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md'
                                    >
                                        {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                        {data.status === '1' && t('Realize Inspection')}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {moreInfo && (
                <div className='w-full bg-[#0a4303] flex flex-col p-2 border-b-2 border-green-950'>
                    <p className='font-bold text-white'>{t('Address')}:</p>
                    <p className='text-white'>Cidade/Estado, complemento</p>

                    <p className='font-bold text-white mt-3'>{t('Accepted By')}:</p>
                    <p className='text-white'>{data.acceptedBy}</p>

                    <p className='font-bold text-white mt-3'>{t('Created At')}:</p>
                    <p className='text-white'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>

                    {type === 'manage' && (
                        <>
                        <p className='font-bold text-white mt-3'>{t('Expires In')}:</p>
                        <p className='text-white'>0 Blocks to expire</p>

                        <div className='w-full mt-3'>
                            <button
                                onClick={() => {
                                    if(data.status === '0'){
                                        handleAccept()
                                    }
                                }}
                                className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
                            >
                                {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                {data.status === '1' && t('Realize Inspection')}
                            </button>
                        </div>
                        </>
                    )}
                </div>
            )}

                <Dialog.Root
                        open={modalTransaction}
                        onOpenChange={(open) => {
                            if(!loadingTransaction){
                                setModalTransaction(open);
                                reload();
                                //close();
                            }
                        }}
                >
                        <LoadingTransaction
                            loading={loadingTransaction}
                            logTransaction={logTransaction}
                        />
                </Dialog.Root>

                <Dialog.Root
                    open={openModalChooseMethod}
                    onOpenChange={(open) => setOpenModalChooseMethod(open)}
                >
                    <ModalChooseMethod
                        finishInspection={finishInspection}
                    />
                </Dialog.Root>

                <Dialog.Root
                    open={modalViewResult}
                    onOpenChange={(open) => setModalViewResult(open)}
                >
                    <ViewResultInspection
                        data={data}
                    />
                </Dialog.Root>

                {loading && (
                    <Loading/>
                )}

            <ToastContainer/>
        </div>
    )
}