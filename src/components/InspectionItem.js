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
        //console.log(data);
        getProducerDataApi();
        getProducer();
        validateStatus(data.status);
    }, [data]);
    
    function generatePdf(inspection, indiceReport, resultCategories, resultIndices, resultBiodiversity){
        console.log(resultCategories);
        const categoriesDegeneration = resultCategories.filter(item => JSON.parse(item.categoryDetails).category === '1')
        const categoriesRegeneration = resultCategories.filter(item => JSON.parse(item.categoryDetails).category === '2')
        const soloRegenerado = resultCategories.filter(item => item.categoryId === '13')
        const melhorCobertura = resultCategories.filter(item => item.categoryId === '14')
        const piorCobertura = resultCategories.filter(item => item.categoryId === '15')
        
        if(indiceReport === 'carbon'){
            return {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: 150
                    },
                    {
                        text: `Inspeção #${inspection.inspectionId} - Carbon Report`,
                        style: 'header'
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

                    'Inspected At:',
                    {
                        text: `${format(new Date(), 'dd/MM/yyyy - kk:mm')}`,
                        style: 'inspectedDate'
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
                                `\n${item.title}: ${item.value} x ${carbonValue} = ${Number(item.value) * carbonValue} kg Co²`   
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
                        
                    })}`,
                    `¹Cobertura de solo: ${(((Number(melhorCobertura[0].value) + Number(piorCobertura[0].value)) / 2) * Number(soloRegenerado[0].value)) * JSON.parse(melhorCobertura[0].categoryDetails).carbonValue} kg Co²`,
                    
                    {
                        text: 'Fórmulas do cálculo:',
                        style: 'titleFormulas'
                    },
                    `¹ - (((Melhor cobertura de solo + Pior cobertura de solo) / 2) x Solo regenerado) x Impacto de carbono`,
                    `(${melhorCobertura[0].value} + ${piorCobertura[0].value} / 2) x ${soloRegenerado[0].value} x ${JSON.parse(melhorCobertura[0].categoryDetails).carbonValue} = ${(((Number(melhorCobertura[0].value) + Number(piorCobertura[0].value)) / 2) * Number(soloRegenerado[0].value)) * JSON.parse(melhorCobertura[0].categoryDetails).carbonValue}`

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
                        marginBottom: 15
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15,
                        bold: true,
                        color: '#0a4303'
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    },
                    inspectedDate:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 15
                    },
                    insumoText:{
                        marginBottom:5
                    },
                    titleFormulas:{
                        bold: true,
                        marginTop:15
                    }
                }
                
            }
        }

        if(indiceReport === 'solo'){
            return {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: 150
                    },
                    {
                        text: `Inspeção #${inspection.inspectionId} - Solo Report`,
                        style: 'header'
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

                    'Inspected At:',
                    {
                        text: `${format(new Date(), 'dd/MM/yyyy - kk:mm')}`,
                        style: 'inspectedDate'
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
                    `\nSolo regenerado: ${soloRegenerado[0].value} m²`
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
                        marginBottom: 15
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15,
                        bold: true,
                        color: '#0a4303'
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    },
                    inspectedDate:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 15
                    },
                    insumoText:{
                        marginBottom:5
                    },
                    titleFormulas:{
                        bold: true,
                        marginTop:15
                    }
                }
                
            }
        }

        if(indiceReport === 'agua'){
            return {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: 150
                    },
                    {
                        text: `Inspeção #${inspection.inspectionId} - Water Report`,
                        style: 'header'
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

                    'Inspected At:',
                    {
                        text: `${format(new Date(), 'dd/MM/yyyy - kk:mm')}`,
                        style: 'inspectedDate'
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
                        marginBottom: 15
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15,
                        bold: true,
                        color: '#0a4303'
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    },
                    inspectedDate:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 15
                    },
                    insumoText:{
                        marginBottom:5
                    },
                    titleFormulas:{
                        bold: true,
                        marginTop:15
                    }
                }
                
            }
        }

        if(indiceReport === 'bio'){
            return {
                content: [
                    {
                        image: 'data:image/png;base64,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',
                        width: 150
                    },
                    {
                        text: `Inspeção #${inspection.inspectionId} - Biodiversity Report`,
                        style: 'header'
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

                    'Inspected At:',
                    {
                        text: `${format(new Date(), 'dd/MM/yyyy - kk:mm')}`,
                        style: 'inspectedDate'
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
                                    `\n${item.title}: ${item.value} x ${bioValue} = ${Number(item.value) * bioValue} uni/vida`,
                                ]
                            )
                        }
                        
                    })}`,
    
                    '\n2. Insumos de Regeneração:',
                    `\nUnidades de vida encontradas na propriedade: ${resultBiodiversity.length} uni/vida`
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
                        marginBottom: 15
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    resultIndice:{
                        marginBottom: 15,
                        bold: true,
                        color: '#0a4303'
                    },
                    descriptionInfo:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 5
                    },
                    inspectedDate:{
                        bold: true,
                        color: '#0a4303',
                        marginBottom: 15
                    },
                    insumoText:{
                        marginBottom:5
                    },
                    titleFormulas:{
                        bold: true,
                        marginTop:15
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
            setLoading(false);
            alert('Realize a inspeção no app do ativista para smartphone!')
            return;
        }
        const resultIndices = JSON.parse(response?.data?.inspection?.resultIdices);
        const resultCategories = JSON.parse(response?.data?.inspection?.resultCategories);
        const inspection = response?.data?.inspection
        const resultBiodiversity = JSON.parse(response?.data?.inspection?.biodversityIndice);

        const pdfCarbon = await pdfMake.createPdf(generatePdf(inspection, 'carbon', resultCategories, resultIndices, resultBiodiversity));
        const pdfSolo = await pdfMake.createPdf(generatePdf(inspection, 'solo', resultCategories, resultIndices, resultBiodiversity));
        const pdfAgua = await pdfMake.createPdf(generatePdf(inspection, 'agua', resultCategories, resultIndices, resultBiodiversity));
        const pdfBio = await pdfMake.createPdf(generatePdf(inspection, 'bio', resultCategories, resultIndices, resultBiodiversity));
        
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