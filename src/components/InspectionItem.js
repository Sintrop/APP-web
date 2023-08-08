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
import { useNavigate } from 'react-router';
import Loading from '../components/Loading';
import {save} from '../config/infura';
import axios from 'axios';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export function InspectionItem({data, type, reload, statusExpired, startOpen}){
    const navigate = useNavigate();
    const {walletAddress, typeUser} = useParams();
    const {user, blockNumber, setWalletSelected} = useMainContext();
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
    const [method, setMethod] = useState('sintrop');
    
    useEffect(() => {
        //console.log(data);
        getProducerDataApi();
        getProducer();
        validateStatus(data.status);
        getInspectionApi();
        if(startOpen){
            setMoreInfo(true)
        }
    }, [data]);

    async function getInspectionApi(){
        try{
            const response = await api.get(`/inspection/${data.id}`);
            if(response.data.inspection?.resultCategories){
                setMethod('sintrop')
            }else{
                setMethod('manual')
            }
        }catch(err){
            console.log(err);
        }
    }
    
    function generatePdf(infoData, resultIndices, resultBiodiversity, resultCategories, resultZones, inspection, indices, pdfData, isas){
        const {
            bioPictures, 
            bodyInsumos, 
            bodyResultInsumos, 
            bodyDegradacao, 
            bodyArvoresAvulsas, 
            bodyCoordsZones,
            degenerationCarbon, 
            degenerationWater, 
            degenerationSoil,
            degenerationBio,
            totalArvoresAvulsas,
            saldoCarbonArvores,
            saldoWaterArvores,
            saldoBioArvores,
            saldoCarbonArvoresZones,
            saldoWaterArvoresZones,
            saldoBioArvoresZones,
            saldoCarbonAnaliseSoloZones,
            saldoSoilAnaliseSoloZones,
            bodyPicturesZone,
            bodyCoordsSubZones,
            bodyPicturesSubZones,
            bodyArvoresSubZone,
            bodyArvoresZone,
            bodyImpactCarbonArvoresZone,
            bodyImpactWaterArvoresZone,
            bodyAnaliseSoloZones,
            bodyInsetosAnaliseSoloZones,
            bioInsetos,
            bodyCoordsZonesTeste
        } = pdfData;

        let isaCarbon = '';
        let isaWater = '';
        let isaSoil = '';
        let isaBio = '';

        //Transforma o isaindex em uma string legivel;
        if(isas){
            if(isas.carbon === 0){
                isaCarbon = 'Regenerativo 3 = +20 Pontos de Regeneração'
            }
            if(isas.carbon === 1){
                isaCarbon = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if(isas.carbon === 2){
                isaCarbon = 'Regenerativo 1 = +5 Pontos de Regeneração'
            }
            if(isas.carbon === 3){
                isaCarbon = 'Neutro = 0 Pontos de Regeneração'
            }
            if(isas.carbon === 4){
                isaCarbon = 'Não Regenerativo 1 = -5 Pontos de Regeneração'
            }
            if(isas.carbon === 5){
                isaCarbon = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if(isas.carbon === 6){
                isaCarbon = 'Não Regenerativo 3 = -20 Pontos de Regeneração'
            }
        }

        if(isas){
            if(isas.water === 0){
                isaWater = 'Regenerativo 3 = +20 Pontos de Regeneração'
            }
            if(isas.water === 1){
                isaWater = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if(isas.water === 2){
                isaWater = 'Regenerativo 1 = +5 Pontos de Regeneração'
            }
            if(isas.water === 3){
                isaWater = 'Neutro = 0 Pontos de Regeneração'
            }
            if(isas.water === 4){
                isaWater = 'Não Regenerativo 1 = -5 Pontos de Regeneração'
            }
            if(isas.water === 5){
                isaWater = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if(isas.water === 6){
                isaWater = 'Não Regenerativo 3 = -20 Pontos de Regeneração'
            }
        }

        if(isas){
            if(isas.soil === 0){
                isaSoil = 'Regenerativo 3 = +20 Pontos de Regeneração'
            }
            if(isas.soil === 1){
                isaSoil = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if(isas.soil === 2){
                isaSoil = 'Regenerativo 1 = +5 Pontos de Regeneração'
            }
            if(isas.soil === 3){
                isaSoil = 'Neutro = 0 Pontos de Regeneração'
            }
            if(isas.soil === 4){
                isaSoil = 'Não Regenerativo 1 = -5 Pontos de Regeneração'
            }
            if(isas.soil === 5){
                isaSoil = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if(isas.soil === 6){
                isaSoil = 'Não Regenerativo 3 = -20 Pontos de Regeneração'
            }
        }

        if(isas){
            if(isas.bio === 0){
                isaBio = 'Regenerativo 3 = +20 Pontos de Regeneração'
            }
            if(isas.bio === 1){
                isaBio = 'Regenerativo 2 = +10 Pontos de Regeneração'
            }
            if(isas.bio === 2){
                isaBio = 'Regenerativo 1 = +5 Pontos de Regeneração'
            }
            if(isas.bio === 3){
                isaBio = 'Neutro = 0 Pontos de Regeneração'
            }
            if(isas.bio === 4){
                isaBio = 'Não Regenerativo 1 = -5 Pontos de Regeneração'
            }
            if(isas.bio === 5){
                isaBio = 'Não Regenerativo 2 = -10 Pontos de Regeneração'
            }
            if(isas.bio === 6){
                isaBio = 'Não Regenerativo 3 = -20 Pontos de Regeneração'
            }
        }
        
        return {
            content: [
                {
                    image: 'data:image/png;base64,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',
                    width: 150
                },
                {
                    text:[
                        {
                            text: 'Wallet Produtor: ',
                            style: 'label'
                        },
                        `${infoData?.producerWallet}`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Nome do Produtor: ',
                            style: 'label'
                        },
                        `${infoData?.producerName}`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Wallet do Inspetor: ',
                            style: 'label'
                        },
                        `${infoData?.inspectorWallet}`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Área inspecionada: ',
                            style: 'label'
                        },
                        `${infoData?.producerArea} m²`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Data: ',
                            style: 'label'
                        },
                        `${infoData?.date}`
                    ]
                },
                {
                    text: `Relatório da Inspeção #${inspection.inspectionId}`,
                    style: 'title'
                },
                {
                    text: `Tabela de indices utilizada`,
                    style: 'subTitle'
                },
                {
                    table:{
                        body: [
                            ['Insumo', 'Carbono', 'Água', 'Solo', 'Biodiversidade', 'Unidade'],
                            ...bodyInsumos
                        ]
                    }
                },
                {
                    text: `1) Insumos registrados na propriedade:`,
                    style: 'subTitle'
                },
                {
                    table:{
                        body: [
                            ['Insumo', 'Resultado', 'Unidade'],
                            ...bodyResultInsumos
                        ]
                    }
                },
                {
                    text: `2) Cálculo da degradação por uso de insumos externos:`,
                    style: 'subTitle'
                },
                {
                    table:{
                        body: [
                            ['Insumo', 'Carbono', 'Água', 'Solo', 'Biodiversidade'],
                            ...bodyDegradacao,
                            ['Total', `${degenerationCarbon.toFixed(1)} kg`, `${degenerationWater.toFixed(1)} m³`, `${degenerationSoil.toFixed(1)} m²`, `${degenerationBio.toFixed(1)} uv`,]
                        ]
                    }
                },
                {
                    text: `3) Contagem de árvores avulsas:`,
                    style: 'subTitle'
                },
                {
                    table:{
                        body: [
                            ['Tipo', 'Contagem', 'Saldo de Co²', 'Saldo de Água'],
                            ...bodyArvoresAvulsas,
                            ['Total', `${totalArvoresAvulsas}`, `${saldoCarbonArvores.toFixed(1)} kg`, `${saldoWaterArvores.toFixed(1)} m³`]
                        ]
                    }
                },
                {
                    text: `4) Zonas de Regeneração: Em Desenvolvimento`,
                    style: 'subTitle'
                },
                {
                    text: `Coordenadas das zonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Nome', 'Coordenadas', 'Área'],
                            ...bodyCoordsZonesTeste
                        ]
                    }
                },
                {
                    text: `Foto das coordenadas das zonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Ponto 1', 'Ponto 2', 'Ponto 3', 'Ponto 4', 'Ponto 5', 'Ponto 6', 'Ponto 7', 'Ponto 8', 'Ponto 9', 'Ponto 10'],
                            ...bodyPicturesZone
                        ]
                    }
                },
                {
                    text: `Análise de solo das zonas`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Ponto 1', 'Ponto 2', 'Ponto 3', 'Ponto 4', 'Total'],
                            ...bodyAnaliseSoloZones
                        ]
                    }
                },
                {
                    text: `Insetos encontrados nas análises de solo`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Ponto 1', 'Ponto 2', 'Ponto 3', 'Ponto 4', 'Total'],
                            ...bodyInsetosAnaliseSoloZones
                        ]
                    }
                },
                {
                    text: `Contagem de árvores nas subzonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona Mãe', 'Mudas', 'Jovens', 'Adultas', 'Anciâs', 'Total', 'Área'],
                            ...bodyArvoresSubZone
                        ]
                    }
                },
                {
                    text: `Extrapolação de árvores para as zonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Mudas', 'Jovens', 'Adultas', 'Anciâs', 'Total'],
                            ...bodyArvoresZone
                        ]
                    }
                },
                {
                    text: `Impacto de carbono das ávores das zonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Mudas', 'Jovens', 'Adultas', 'Anciâs', 'Total'],
                            ...bodyImpactCarbonArvoresZone
                        ]
                    }
                },
                {
                    text: `Impacto de água das ávores das zonas:`,
                    style: 'label'
                },
                {
                    table:{
                        body: [
                            ['Zona', 'Mudas', 'Jovens', 'Adultas', 'Anciâs', 'Total'],
                            ...bodyImpactWaterArvoresZone
                        ]
                    }
                },
                {
                    text: `5) Registro de Biodiversidade:`,
                    style: 'subTitle'
                },
                {
                    text: `Fotos Registradas:`,
                    style: 'label'
                },
                {
                    ul: bioPictures
                },
                {
                    text:[
                        {
                            text: 'Biodiversidade registrada: ',
                            style: 'label'
                        },
                        `${bioPictures.length} uni`
                    ]
                },
                {
                    text: `6) Resultado Final:`,
                    style: 'subTitle'
                },
                {
                    table:{
                        body: [
                            ['', 'Carbono', 'Água', 'Solo', 'Biodiversidade'],
                            ['Insumos', `${degenerationCarbon.toFixed(1)} kg`, `${degenerationWater.toFixed(1)} m³`, `${degenerationSoil.toFixed(1)} m²`, `${degenerationBio.toFixed(0)} uv`],
                            ['Árvores Avulsas', `${saldoCarbonArvores.toFixed(1)} kg`, `${saldoWaterArvores.toFixed(1)} m³`, `0 m²`, `0 uv`],
                            ['Árvores das Zonas', `${saldoCarbonArvoresZones.toFixed(1)} kg`, `${saldoWaterArvoresZones.toFixed(1)} m³`, `0 m²`, `0 uv`],
                            ['Análise de Solo', `${saldoCarbonAnaliseSoloZones.toFixed(1)} kg`, `0 m³`, `${saldoSoilAnaliseSoloZones.toFixed(1)} m²`, `${bioInsetos.toFixed(0)} uv`],
                            ['Registro de Biodiversidade', '0 kg', '0 m³', '0 m²', `${bioPictures.length} uni`],
                            [
                                'Total', 
                                `${(degenerationCarbon + saldoCarbonArvores + saldoCarbonArvoresZones + saldoCarbonAnaliseSoloZones).toFixed(1)} kg`, 
                                `${(degenerationWater + saldoWaterArvores + saldoWaterArvoresZones).toFixed(1)} m³`, 
                                `${(degenerationSoil + saldoSoilAnaliseSoloZones).toFixed(1)} m²`, 
                                `${(degenerationBio + Number(bioPictures.length) + bioInsetos).toFixed(0)} uni`, 
                                
                            ]
                        ]
                    }
                },
                {
                    text: `Resultado Registrado na Blockchain:`,
                    style: 'label'
                },
                {
                    text:[
                        {
                            text: 'Carbono: ',
                            style: 'label'
                        },
                        `${resultIndices?.carbon} kg = ${isaCarbon}`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Água: ',
                            style: 'label'
                        },
                        `${resultIndices?.water} m³ = ${isaWater}`
                    ]
                },
                {
                    text:[
                        {
                            text: 'Solo: ',
                            style: 'label'
                        },
                        `${resultIndices?.soil} m² = ${isaSoil}`
                    ]
                },
                {
                    text:[
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
                    marginTop: 15
                },
                subTitle: {
                    color: '#0a4303',
                    textAlign: 'center',
                    bold: true,
                    fontSize: 14,
                    marginTop: 15
                },
                blackBold: {
                    bold: true,
                    marginTop: 10
                },
                label:{
                    bold: true,
                    color: '#0a4303',
                    marginTop: 5
                },
                link:{
                    color: 'blue',
                    marginBottom:5
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
            setLoadingTransaction(false);
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
            if(Number(data.acceptedAt) + Number(6650) < Number(blockNumber)){
                setStatus('3')
                statusExpired(data.id)
            }else{
                setStatus('1')
            }
        }
    }

    async function calculateArea(coords){
        let coordsUTM = [];
        for(var i = 0; i < coords.length; i++){
            let object = {}
            const response = await axios.get(`https://epsg.io/srs/transform/${coords[i].lng},${coords[i].lat}.json?key=default&s_srs=4326&t_srs=3857`)
            object = response.data.results[0]
            coordsUTM.push(object);
        }

        let areaX = 0;
        let areaY = 0;
        for(var i = 1; i < coordsUTM.length; i++){
            let product1 = coordsUTM[i-1].y * coordsUTM[i].x;
            areaX += product1
        }
        for(var i = 1; i < coordsUTM.length; i++){
            let product2 = coordsUTM[i-1].x * coordsUTM[i].y;
            areaY += product2
        }

        let repeatX = coordsUTM[coordsUTM.length - 1].y * coordsUTM[0].x; 
        let repeatY = coordsUTM[coordsUTM.length - 1].x * coordsUTM[0].y; 

        areaX += repeatX;
        areaY += repeatY;

        let D = areaX - areaY;
        let areaM2 = 0.5 * D;

        return Math.abs(areaM2) 
    }

    async function calculateIndices(indices, resultCategories, resultZones, resultBiodiversity){
        const indiceAnaliseSolo = indices.filter(item => item.id === '14');

        let bodyInsumos = [];
        for (var i = 0; i < indices.length; i++){
            let row = [];
            row.push(indices[i].title);
            row.push(indices[i].carbonValue);
            row.push(indices[i].aguaValue);
            row.push(indices[i].soloValue);
            row.push(indices[i].bioValue);
            row.push(indices[i].unity)

            bodyInsumos.push(row);
        }

        //Filtra os indices das árvores
        const ArvoreMuda = resultCategories.filter(item => item.categoryId === '9');
        const ArvoreJovem = resultCategories.filter(item => item.categoryId === '10');
        const ArvoreAdulta = resultCategories.filter(item => item.categoryId === '11');
        const ArvoreAncia = resultCategories.filter(item => item.categoryId === '12');
        

        let bodyResultInsumos = [];

        //Variaveis da degeneração
        let bodyDegradacao = [];
        let degenerationCarbon = 0;
        let degenerationWater = 0;
        let degenerationSoil = 0;
        let degenerationBio = 0;
        
        //Variaveis das arvores
        let bodyArvoresAvulsas = [];
        let totalArvoresAvulsas = 0;
        let saldoCarbonArvores = 0;
        let saldoWaterArvores = 0;
        let saldoBioArvores = 0;

        //Variaveis da biodiversidade
        let bioPictures = [];
        let bioInsetos = 0;

        //Cria a lista de link das fotos da biodiversidade
        for(var i = 0; i < resultBiodiversity.length; i++){
            let dataBio = {
                text: `ipfs.io/ipfs/${resultBiodiversity[i].photo}`,
                link: `https://${window.location.host}/view-image/${resultBiodiversity[i].photo}`,
                style: 'link'
            }

            bioPictures.push(dataBio);
        }

        //For para calcular os resultados dos insumos e árvores avulsas
        for (var i = 0; i < resultCategories.length; i++){
            const category = JSON.parse(resultCategories[i].categoryDetails);

            //Lista os insumos registrados na inspeção
            if(resultCategories[i].value !== '0'){
                let row = [];
                row.push(resultCategories[i].title);
                row.push(resultCategories[i].value);
                row.push(category.unity);
                
                if(category.id === '9' || category.id === '10' || category.id === '11' || category.id === '12' || category.id === '23'){
                }else{
                    bodyResultInsumos.push(row);
                }
            }

            //Faz a contagem dos insumos de degeneração
            if(category.category === '1'){
                if(resultCategories[i].value !== '0'){
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

            //faz a contagem das arvores avulsas
            if(category.id === '9' || category.id === '10' || category.id === '11' || category.id === '12'){
                let row = [];
                row.push(resultCategories[i].title);
                row.push(resultCategories[i].value);
                row.push(`${resultCategories[i].value} x ${category.carbonValue} = ${(Number(resultCategories[i].value) * Number(category.carbonValue)).toFixed(1)} kg`);
                row.push(`${resultCategories[i].value} x ${category.aguaValue} = ${(Number(resultCategories[i].value) * Number(category.aguaValue)).toFixed(1)} m³`);
                
                bodyArvoresAvulsas.push(row);

                //Faz a soma das arvores
                totalArvoresAvulsas += Number(resultCategories[i].value);
                saldoCarbonArvores += Number(resultCategories[i].value) * Number(category.carbonValue);
                saldoWaterArvores += Number(resultCategories[i].value) * Number(category.aguaValue);
            }

        }

        //Análise das zonas
        let saldoCarbonArvoresZones = 0;
        let saldoWaterArvoresZones = 0;
        let saldoBioArvoresZones = 0;
        let saldoCarbonAnaliseSoloZones = 0;
        let saldoSoilAnaliseSoloZones = 0;

        let bodyCoordsZones = [];
        let bodyCoordsZonesTeste = [];
        let bodyCoordsSubZones = [];
        let bodyPicturesZone = [];
        let bodyPicturesSubZones = [];
        let bodyArvoresSubZone = [];
        let bodyArvoresZone = [];
        let bodyImpactCarbonArvoresZone = [];
        let bodyImpactWaterArvoresZone = [];
        let bodyAnaliseSoloZones = [];
        let bodyInsetosAnaliseSoloZones = [];

        //For para calcular os resultados das zonas
        for(var i = 0; i < resultZones.length; i++){
            const titleZone = resultZones[i].title;
            const pathZone = resultZones[i].path;

            //Pega as cordenadas da zona, titulo e area e coloca no array para montar no pdf
            const zone = [`${resultZones[i].title}`, `Lat:${resultZones[i].path[0].lat}, Lng:${resultZones[i].path[0].lng}`, `Lat:${resultZones[i].path[1].lat}, Lng:${resultZones[i].path[1].lng}`, `Lat:${resultZones[i].path[2].lat}, Lng:${resultZones[i].path[2].lng}`, `Lat:${resultZones[i].path[3].lat}, Lng:${resultZones[i].path[3].lng}`, `Lat:${resultZones[i].path[4].lat}, Lng:${resultZones[i].path[4].lng}`, `Lat:${resultZones[i].path[5].lat}, Lng:${resultZones[i].path[5].lng}`,`${(resultZones[i].areaZone).toFixed(0)} m²`,]
            bodyCoordsZones.push(zone);

            let bodyTeste = [
                titleZone,
            ];
            let stringCoords = '';
            for(var c = 0; c < pathZone.length; c++){
                stringCoords += `| Ponto ${c+1} - Lat: ${pathZone[c].lat}, Lng: ${pathZone[c].lng} `;
            }
            bodyTeste.push(stringCoords);
            bodyTeste.push(`${(resultZones[i].areaZone).toFixed(0)} m²`)
            bodyCoordsZonesTeste.push(bodyTeste)

            const analiseSolo = resultZones[i].analiseSolo;
            //Filtra as árvores pelo id
            const mudasValue = resultZones[i].arvores.filter(item => item.id === 1);
            const jovensValue = resultZones[i].arvores.filter(item => item.id === 2);
            const adultasValue = resultZones[i].arvores.filter(item => item.id === 3);
            const anciasValue = resultZones[i].arvores.filter(item => item.id === 4);
            const bioValue = resultZones[i].arvores.filter(item => item.id === 5);

            //Faz a estimativa de arvores da zona calculando pela subzona
            const estimatedMudas = Number((Number(mudasValue[0].value) / resultZones[i].areaSubZone) * resultZones[i].areaZone).toFixed(0);
            const estimatedJovens = Number((Number(jovensValue[0].value) / resultZones[i].areaSubZone) * resultZones[i].areaZone).toFixed(0);
            const estimatedAdultas = Number((Number(adultasValue[0].value) / resultZones[i].areaSubZone) * resultZones[i].areaZone).toFixed(0);
            const estimatedAncias = Number((Number(anciasValue[0].value) / resultZones[i].areaSubZone) * resultZones[i].areaZone).toFixed(0);

            //Monta a tabela de quantas árvores por zona e mostra a estrapolação;
            const arrayArvoresSubZone = [
                titleZone,
                mudasValue[0].value,
                jovensValue[0].value,
                adultasValue[0].value,
                anciasValue[0].value,
                Number(mudasValue[0].value) + Number(jovensValue[0].value) + Number(adultasValue[0].value) + Number(anciasValue[0].value),
                `${resultZones[i].areaSubZone} m²`
            ]
            bodyArvoresSubZone.push(arrayArvoresSubZone);

            //Monta o array da extrapolação de árvores para a zona
            const arrayArvoresZone = [
                titleZone,
                estimatedMudas,
                estimatedJovens,
                estimatedAdultas,
                estimatedAncias,
                Number(estimatedMudas) + Number(estimatedJovens) + Number(estimatedAncias) + Number(estimatedAdultas)
            ]
            bodyArvoresZone.push(arrayArvoresZone);
            
            //Calcula o impacto das árvores da zona
            saldoCarbonArvoresZones += (Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).carbonValue)) + (Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).carbonValue)) + (Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).carbonValue)) + (Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).carbonValue));
            saldoWaterArvoresZones += (Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).aguaValue)) + (Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).aguaValue)) + (Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).aguaValue)) + (Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).aguaValue))
            
            
            //Monta a tabela do impacto de carbono das árvores da zona
            const impactCarbonArvoresSubZone = [
                titleZone,
                `${estimatedMudas} x ${Number(JSON.parse(ArvoreMuda[0].categoryDetails).carbonValue)} = ${(Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).carbonValue)).toFixed(1)} kg`,
                `${estimatedJovens} x ${Number(JSON.parse(ArvoreJovem[0].categoryDetails).carbonValue)} = ${(Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).carbonValue)).toFixed(1)} kg`,
                `${estimatedAdultas} x ${Number(JSON.parse(ArvoreAdulta[0].categoryDetails).carbonValue)} = ${(Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).carbonValue)).toFixed(1)} kg`,
                `${estimatedAncias} x ${Number(JSON.parse(ArvoreAncia[0].categoryDetails).carbonValue)} = ${(Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).carbonValue)).toFixed(1)} kg`,
                `${((Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).carbonValue)) + (Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).carbonValue)) + (Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).carbonValue)) + (Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).carbonValue))).toFixed(1)} kg`
            ]
            bodyImpactCarbonArvoresZone.push(impactCarbonArvoresSubZone);

            //Monta a tabela do impacto dde agua das árvores da zona
            const impactWaterArvoresSubZone = [
                titleZone,
                `${estimatedMudas} x ${Number(JSON.parse(ArvoreMuda[0].categoryDetails).aguaValue)} = ${(Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).aguaValue)).toFixed(1)} m³`,
                `${estimatedJovens} x ${Number(JSON.parse(ArvoreJovem[0].categoryDetails).aguaValue)} = ${(Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).aguaValue)).toFixed(1)} m³`,
                `${estimatedAdultas} x ${Number(JSON.parse(ArvoreAdulta[0].categoryDetails).aguaValue)} = ${(Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).aguaValue)).toFixed(1)} m³`,
                `${estimatedAncias} x ${Number(JSON.parse(ArvoreAncia[0].categoryDetails).aguaValue)} = ${(Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).aguaValue)).toFixed(1)} m³`,
                `${((Number(estimatedMudas) * Number(JSON.parse(ArvoreMuda[0].categoryDetails).aguaValue)) + (Number(estimatedJovens) * Number(JSON.parse(ArvoreJovem[0].categoryDetails).aguaValue)) + (Number(estimatedAdultas) * Number(JSON.parse(ArvoreAdulta[0].categoryDetails).aguaValue)) + (Number(estimatedAncias) * Number(JSON.parse(ArvoreAncia[0].categoryDetails).aguaValue))).toFixed(1)} m³`
            ]
            bodyImpactWaterArvoresZone.push(impactWaterArvoresSubZone);
            //Seta a biodiversidade de arvores da zona
            saldoBioArvoresZones += Number(bioValue[0].value);

            //Faz o cálculo da biomassa da zona
            const calculoBiomassaSolo = Number(((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) * resultZones[i].areaZone) * Number(indiceAnaliseSolo[0].carbonValue);
            saldoCarbonAnaliseSoloZones += calculoBiomassaSolo;
            saldoSoilAnaliseSoloZones += resultZones[i].areaZone;

            //Faz o calculo da biodiversidade dos insetos vistos nas analises de solo
            const calculoBioInsetos = Number(((Number(analiseSolo[0].insetos) + Number(analiseSolo[1].insetos) + Number(analiseSolo[2].insetos) + Number(analiseSolo[3].insetos)) / 4) * resultZones[i].areaZone);
            bioInsetos += Number(calculoBioInsetos);

            //Monta o item da tabela para a análise de solo;
            const analiseSoloZone = [
                titleZone,
                `${analiseSolo[0].value} kg`,
                `${analiseSolo[1].value} kg`,
                `${analiseSolo[2].value} kg`,
                `${analiseSolo[3].value} kg`,
                `${(calculoBiomassaSolo).toFixed(1)} kg`
            ]
            bodyAnaliseSoloZones.push(analiseSoloZone);

            //Monta a tabela dos insetos de cada zona
            const insetosAnaliseSoloZone = [
                titleZone,
                `${analiseSolo[0].insetos}`,
                `${analiseSolo[1].insetos}`,
                `${analiseSolo[2].insetos}`,
                `${analiseSolo[3].insetos}`,
                `${(calculoBioInsetos).toFixed(0)} uv`
            ]
            bodyInsetosAnaliseSoloZones.push(insetosAnaliseSoloZone);

            //Pega as fotos registradas de cada zona e monta o array
            const coordsZone = resultZones[i].path
            let arrayPicturesZone = []
            for(var i = 0; i < 10; i++){
                if(coordsZone[i]?.photo){
                    let dataPhotoZones = {
                        text: `Foto`,
                        link: `https://${window.location.host}/view-image/${coordsZone[i].photo}`,
                        style: 'link'
                    }
                    arrayPicturesZone.push(dataPhotoZones);
                }else{
                    arrayPicturesZone.push('-');
                }
            }
            arrayPicturesZone.unshift(titleZone);
            bodyPicturesZone.push(arrayPicturesZone);

            // //Pega as fotos registradas de cada subzona e monta o array
            // const coordsSubZone = resultZones[i].subZone
            // let arrayPicturesSubZone = []
            // for(var i = 0; i < coordsSubZone.length; i++){
            //     let dataPhotoSubZone = {
            //         text: `Photo`,
            //         link: `https://ipfs.io/ipfs/${coordsSubZone[i].photo}`,
            //         style: 'link'
            //     }
    
            //     arrayPicturesSubZone.push(dataPhotoSubZone);
            // }
            // arrayPicturesSubZone.unshift(titleZone);
            // bodyPicturesSubZones.push(arrayPicturesSubZone);
        }

        let totalCarbon = degenerationCarbon + saldoCarbonArvores + saldoCarbonArvoresZones + saldoCarbonAnaliseSoloZones;
        let totalWater = degenerationWater + saldoWaterArvores + saldoWaterArvoresZones;
        let totalBio = degenerationBio + resultBiodiversity.length + bioInsetos;
        let totalSoil = degenerationSoil + saldoSoilAnaliseSoloZones;
        
        const resultIndices = {
            carbon: totalCarbon.toFixed(1),
            water: totalWater.toFixed(1),
            bio: totalBio.toFixed(1),
            soil: totalSoil.toFixed(1),
        }

        const pdfData = {
            bioPictures,
            bodyArvoresAvulsas,
            bodyDegradacao,
            bodyResultInsumos,
            bodyInsumos,
            degenerationCarbon,
            degenerationWater,
            degenerationSoil,
            degenerationBio,
            totalArvoresAvulsas,
            saldoCarbonArvores,
            saldoWaterArvores,
            saldoBioArvores,
            saldoCarbonArvoresZones,
            saldoWaterArvoresZones,
            saldoBioArvoresZones,
            saldoCarbonAnaliseSoloZones,
            saldoSoilAnaliseSoloZones,
            bodyCoordsZones,
            bodyPicturesZone,
            bodyCoordsSubZones,
            bodyPicturesSubZones,
            bodyArvoresSubZone,
            bodyArvoresZone,
            bodyImpactCarbonArvoresZone,
            bodyImpactWaterArvoresZone,
            bodyAnaliseSoloZones,
            bodyInsetosAnaliseSoloZones,
            bioInsetos,
            bodyCoordsZonesTeste
        }

        return{
            resultIndices,
            pdfData
        }
    }

    async function finishNewVersion(){
        setLoading(true);
        
        let pdfDevHash = '';

        const response = await api.get(`/inspection/${data.id}`)
        if(response.data.inspection.status === 1){
            setLoading(false);
            toast.error('Realize a inspeção no app do ativista para smartphone!')
            return;
        }

        //Busca todos os indices
        const responseIndices = await api.get('/subCategories');
        const indices = responseIndices.data.subCategories;
        
        const resultCategories = JSON.parse(response?.data?.inspection?.resultCategories);
        const inspection = response?.data?.inspection
        const resultBiodiversity = JSON.parse(response?.data?.inspection?.biodversityIndice);
        const resultZones = JSON.parse(response?.data?.inspection?.zones);
        
        //Função que calcula os indices e retorna os dados para o pdf
        const responseCalculo = await calculateIndices(indices, resultCategories, resultZones, resultBiodiversity)
        
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
        
        const pdf = await pdfMake.createPdf(generatePdf(infoData, responseCalculo.resultIndices, resultBiodiversity, resultCategories, resultZones, inspection, indices, responseCalculo.pdfData, isas));
        
        pdf.getBuffer(async(res) => {
            const hash = await save(res);
            pdfDevHash = hash;

            createIsas(data1, 'phoenix', hash);
        })
    }

    async function finishInspection(){
        setLoading(true);
        let pdfCarbonHash = '';
        let pdfSoloHash = '';
        let pdfAguaHash = '';
        let pdfBioHash = '';

        let totalCarbon = 0;
        let totalWater = 0;
        let totalBio = 0;
        let totalSoil = 0;

        let degenerationCarbon = 0;
        let regenerationCarbon = 0;
        let degenerationWater = 0;
        let regenerationWater = 0;
        let degenerationBio = 0;
        let regenerationBio = 0;
        let degenerationSoil = 0;
        let regenerationSoil = 0;

        const response = await api.get(`/inspection/${data.id}`)
        if(response.data.inspection.status === 1){
            setLoading(false);
            toast.error('Realize a inspeção no app do ativista para smartphone!')
            return;
        }

        const resultCategories = JSON.parse(response?.data?.inspection?.resultCategories);
        const inspection = response?.data?.inspection
        const resultBiodiversity = JSON.parse(response?.data?.inspection?.biodversityIndice);

        const soloRegenerado = resultCategories.filter(item => item.categoryId === '13');
        const analiseSolo1 = resultCategories.filter(item => item.categoryId === '14');
        const analiseSolo2 = resultCategories.filter(item => item.categoryId === '15');
        const analiseSolo3 = resultCategories.filter(item => item.categoryId === '16');
        const analiseSolo4 = resultCategories.filter(item => item.categoryId === '17');
        const analiseSolo5 = resultCategories.filter(item => item.categoryId === '18');
        const bioArvores = resultCategories.filter(item => item.categoryId === '23');

        const calculoBiomassaSolo = ((Number(analiseSolo1[0]?.value) + Number(analiseSolo2[0]?.value) + Number(analiseSolo3[0]?.value) + Number(analiseSolo4[0]?.value) + Number(analiseSolo5[0]?.value)) / 5) * Number(soloRegenerado[0].value);
        const resultIndiceBiomassaSolo = calculoBiomassaSolo * JSON.parse(analiseSolo1[0].categoryDetails).carbonValue;
        regenerationCarbon += resultIndiceBiomassaSolo;

        const calculoBiodiversidadeInsetos = ((Number(analiseSolo1[0]?.value2) + Number(analiseSolo2[0]?.value2) + Number(analiseSolo3[0]?.value2) + Number(analiseSolo4[0]?.value2) + Number(analiseSolo5[0]?.value2)) / 5) * Number(soloRegenerado[0].value);
        regenerationBio += calculoBiodiversidadeInsetos;
        regenerationBio += Number(resultBiodiversity.length);
        regenerationBio += Number(bioArvores[0].value);

        regenerationSoil += Number(soloRegenerado[0].value);

        for(var i = 0; i < resultCategories.length; i++) {
            const categoryDetails = JSON.parse(resultCategories[i].categoryDetails);
            if(categoryDetails.category === '1'){
                degenerationCarbon += Number(resultCategories[i].value) * Number(categoryDetails.carbonValue)
                degenerationWater += Number(resultCategories[i].value) * Number(categoryDetails.aguaValue)
                degenerationBio += Number(resultCategories[i].value) * Number(categoryDetails.bioValue)
                degenerationSoil += Number(resultCategories[i].value) * Number(categoryDetails.soloValue)
            }

            if(categoryDetails.category === '2' && resultCategories[i].categoryId !== '23'){
                regenerationCarbon += Number(resultCategories[i].value) * Number(categoryDetails.carbonValue)
                regenerationWater += Number(resultCategories[i].value) * Number(categoryDetails.aguaValue)
            }
        }

        totalCarbon = degenerationCarbon + regenerationCarbon;
        totalWater = degenerationWater + regenerationWater;
        totalBio = degenerationBio + regenerationBio;
        totalSoil = degenerationSoil + regenerationSoil;

        const resultIndices = {
            carbon: totalCarbon,
            agua: totalWater,
            solo: totalSoil,
            bio: totalBio
        }
        console.log(resultIndices)

        try{
            await api.put(`/inspections/${data.id}/update-result-indices`, {
                resultIndices: JSON.stringify(resultIndices)
            })
        }catch(err){
            console.log(err)
        }

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
                        createIsas(data, 'phoenix')
                    })
                })
            });
        });



    }
    
    async function createIsas(data, methodType, hashPdf){
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
            report: hashPdf,
            indicator: carbonIndicator
        }

        const bio = {
            categoryId: 2,
            isaIndex: bioResult,
            report: hashPdf,
            indicator: bioIndicator
        }

        const water = {
            categoryId: 3,
            isaIndex: waterResult,
            report: hashPdf,
            indicator: aguaIndicator
        }

        const solo = {
            categoryId: 4,
            isaIndex: soloResult,
            report: hashPdf,
            indicator: soloIndicator
        }
        
        setLoading(false);
        const arrayIsas = [
            {categoryId: carbon.categoryId, isaIndex: carbon.isaIndex, report: carbon.report, indicator: carbon.indicator},
            {categoryId: bio.categoryId, isaIndex: bio.isaIndex, report: bio.report, indicator: bio.indicator},
            {categoryId: solo.categoryId, isaIndex: solo.isaIndex, report: solo.report, indicator: solo.indicator},
            {categoryId: water.categoryId, isaIndex: water.isaIndex, report: water.report, indicator: water.indicator}
        ];

        console.log(arrayIsas)

        finishInspectionBlockchain(arrayIsas, resultIndices, methodType)
    }
    
    async function finishInspectionBlockchain(isas, resultIndices, methodType) {
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(
            data.id, 
            isas, 
            walletAddress
        )
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            attNetworkImpact(resultIndices, methodType);
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
        let result = 3;
        const carbon = data.carbon;

        if(carbon < 0){
            if(Math.abs(carbon) > 0 && Math.abs(carbon) < 1000){
                result = 2  
            }
            if(Math.abs(carbon) >= 1000 && Math.abs(carbon) < 100000){
                result = 1
            }
            if(Math.abs(carbon) >= 100000 ){
                result = 0
            }
        }
        if(carbon >= 100000){
            result = 6
        }
        if(carbon >= 1000 && carbon < 100000){
            result = 5  
        }
        if(carbon > 0 && carbon < 1000){
            result = 4  
        }
        if(carbon === 0){
            result = 3
        }
        
        return result;
    }

    function calculateWater(data){
        let result = 0;
        const water = data.water;

        if(water < 0){
            if(Math.abs(water) > 0 && Math.abs(water) < 10){
                result = 4
            }
            if(Math.abs(water) < 100 && Math.abs(water) >= 10){
                result = 5
            }
            if(Math.abs(water) > 100){
                result = 6
            }
        }
        if(water >= 100){
            result = 0 
        }
        if(water >= 10 && water < 100){
            result = 1
        }
        if(water > 0 && water < 10){
            result = 2  
        }
        if(water === 0){
            result = 3
        }

        return result;
    }

    function calculateBio(data){
        let result = 0;
        const bio = data.bio;

        if(bio < 0){
            if(Math.abs(bio) > 0 && Math.abs(bio) < 100){
                result = 4
                return result;
            }
            if(Math.abs(bio) >= 100 && Math.abs(bio) < 1000){
                result = 5
                return result;
            }
            if(Math.abs(bio) >= 1000){
                result = 6
                return result;
            }
        }
        if(bio >= 1000){
            result = 0 
            return result;
        }
        if(bio < 1000 && bio >= 100){
            result = 1
            return result;
        }
        if(bio < 100 && bio > 0){
            result = 2  
            return result;
        }
        if(bio === 0){
            result = 3
            return result;
        }
    }

    function calculateSolo(data){
        const percentSoil = (Number(data.soil) / producerData?.certifiedArea) * 100;
        let result = 3;
        if(percentSoil >= 70){
            result = 0 
        }
        if(percentSoil >= 50 && percentSoil < 70){
            result = 1
        }
        if(percentSoil > 30 && percentSoil < 50){
            result = 2  
        }
        if(percentSoil === 30){
            result = 3
        }
        if(percentSoil < 30 && percentSoil >= 20 ){
            result = 4
        }
        if(percentSoil < 20 && percentSoil >= 10 ){
            result = 5
        }
        if(percentSoil < 10 ){
            result = 6
        }
        return result;
    }

    function handleClickUser(userType, wallet){
        setWalletSelected(wallet)
        navigate(`/dashboard/${walletAddress}/user-details/${userType}/${wallet}`)
    }

    async function attNetworkImpact(resultIndices, methodType){
        let carbon = 0;
        let agua = 0;
        let bio = 0;
        let solo = 0;
        let carbonPhoenix = 0;
        let aguaPhoenix = 0;
        let bioPhoenix = 0;
        let soloPhoenix = 0;
        let carbonManual = 0;
        let aguaManual = 0;
        let bioManual = 0;
        let soloManual = 0;

        const responseImpact = await api.get('network-impact');
        const impact = responseImpact.data.impact;
        for(var i = 0; i < impact.length; i++){
            if(impact[i].id === '1'){
                carbon = Number(impact[i]?.carbon);
                agua = Number(impact[i]?.agua);
                bio = Number(impact[i]?.bio);
                solo = Number(impact[i]?.solo);
            }
            if(impact[i].id === '2'){
                carbonPhoenix = Number(impact[i]?.carbon);
                aguaPhoenix = Number(impact[i]?.agua);
                bioPhoenix = Number(impact[i]?.bio);
                soloPhoenix = Number(impact[i]?.solo);
            }
            if(impact[i].id === '3'){
                carbonManual = Number(impact[i]?.carbon);
                aguaManual = Number(impact[i]?.agua);
                bioManual = Number(impact[i]?.bio);
                soloManual = Number(impact[i]?.solo);
            }
        }

        if(Number(resultIndices.carbonIndicator) < 0){
            carbon += Number(resultIndices.carbonIndicator);
            if(methodType === 'phoenix'){
                carbonPhoenix += Number(resultIndices.carbonIndicator);
            }
            if(methodType === 'manual'){
                carbonManual += Number(resultIndices.carbonIndicator);
            }
        }

        if(Number(resultIndices.bioIndicator) > 0){
            bio += Number(resultIndices.bioIndicator);
            if(methodType === 'phoenix'){
                bioPhoenix += Number(resultIndices.bioIndicator);
            }
            if(methodType === 'manual'){
                bioManual += Number(resultIndices.bioIndicator);
            }
        }

        if(Number(resultIndices.aguaIndicator) > 0){
            agua += Number(resultIndices.aguaIndicator)
            if(methodType === 'phoenix'){
                aguaPhoenix += Number(resultIndices.aguaIndicator);
            }
            if(methodType === 'manual'){
                aguaManual += Number(resultIndices.aguaIndicator);
            }
        }

        if(Number(resultIndices.soloIndicator) > 0){
            solo += Number(resultIndices.soloIndicator)
            if(methodType === 'phoenix'){
                soloPhoenix += Number(resultIndices.soloIndicator);
            }
            if(methodType === 'manual'){
                soloManual += Number(resultIndices.soloIndicator);
            }
        }

        await api.put('network-impact',{
            carbon,
            agua,
            bio,
            solo, 
            id: '1'
        });

        if(methodType === 'phoenix'){
            await api.put('network-impact',{
                carbon: carbonPhoenix,
                agua: aguaPhoenix,
                bio: bioPhoenix,
                solo: soloPhoenix, 
                id: '2'
            });
        }
        if(methodType === 'manual'){
            await api.put('network-impact',{
                carbon: carbonManual,
                agua: aguaManual,
                bio: bioManual,
                solo: soloManual, 
                id: '3'
            });
        }
        setLoadingTransaction(false);
    }

    return(
        <div className='flex flex-col border-b-2 bg-[#0a4303] mb-3'>
            <div 
                className="flex flex-col lg:flex-row items-center justify-between w-full p-2 gap-3"
            >
                <div className='hidden lg:flex items-center gap-8'>
                    <p className='text-white font-bold'>#{data.id}</p>
                    {status !== '3' && (
                        <p className="text-white">
                            {type === 'manage' ? (
                                `${format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}`
                            ) : (
                                `${format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}`
                            )}
                        </p>
                    )}
                </div>

                <div className='flex w-full lg:w-auto items-center justify-between lg:gap-10'>
                    <p className='text-white font-bold lg:w-36 lg:hidden flex mr-2 lg:mr-0'>#{data.id}</p>
                    
                    {type === 'history' ? (
                        <>
                        {status === '2' && (
                            <div className='flex gap-2 items-center justify-center'>
                                {method === 'sintrop' ? (
                                    <img
                                        src={require('../assets/metodo-sintrop.png')}
                                        className='w-[30px] object-contain'
                                    />
                                ) : (
                                    <img
                                        src={require('../assets/metodo-manual.png')}
                                        className='w-[30px] object-contain'
                                    />
                                )}
                                <p className='text-white font-bold'>
                                    Método {method === 'sintrop' ? 'Sintrop' : 'Manual'}
                                </p>
                            </div>
                        )}
                        </>
                    ) : (
                        <div/>
                    )}

                    {type === 'history' ? (
                        <>
                        {status === '3' ? (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-red-500'>
                                <p className='text-xs text-red-500 font-bold'>{t('EXPIRED')}</p>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center border-2 rounded-md w-32 py-1 bg-green-950 mr-2 lg:mr-0'>
                                <p className='text-white font-bold'>ISA {data.isaScore} pts</p>
                            </div>
                        )}
                        </>
                    ) : (
                        <div className='flex items-center w-32'>
                            {status === '0' && (
                                <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#F4A022]'>
                                    <p className='text-xs text-[#F4A022] font-bold'>{t('OPEN')}</p>
                                </div>
                            )}

                            {status === '1' && (
                                <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#3E9EF5]'>
                                    <p className='text-xs text-[#3E9EF5] font-bold'>{t('ACCEPTED')}</p>
                                </div>
                            )}

                            {status === '2' && (
                                <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#2AC230]'>
                                    <p className='text-xs text-[#2AC230] font-bold'>{t('INSPECTED')}</p>
                                </div>
                            )}

                            {status === '3' && (
                                <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-red-500'>
                                    <p className='text-xs text-red-500 font-bold'>{t('EXPIRED')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'history' && (
                        <>
                        {status === '2' && (
                            <button
                                onClick={() => {
                                    navigate(`/dashboard/${walletAddress}/result-inspection/${typeUser}/${data.id}`)
                                }}
                                className='font-bold w-32 text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2 hidden lg:flex justify-center'
                            >
                                {t('See Result')}
                            </button>
                        )}
                        </>
                    )}

                    {type === 'manage' && (
                        <div className='hidden lg:flex'>
                            {status !== '3' ? (
                                <>
                                    {user === '2' ? (
                                        <button
                                            onClick={() => {
                                                if(data.status === '0'){
                                                    handleAccept();
                                                }
                                                if(data.status === '1'){
                                                    setOpenModalChooseMethod(true);
                                                }
                                            }}
                                            className='font-bold w-36 h-8 text-[#062C01] text-sm bg-[#ff9900] rounded-md'
                                        >
                                            {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                            {data.status === '1' && t('Realize Inspection')}
                                        </button>
                                    ) : (
                                        <div className='w-36'/>
                                    )}
                                </>
                            ) : (
                                <div className='w-36'/>
                            )}
                        </div>
                    )}
                    {moreInfo ? (
                        <AiFillCaretUp
                            size={30}
                            color='white'
                            onClick={() => setMoreInfo(!moreInfo)}
                            className='cursor-pointer'
                        />    
                    ) : (
                        <AiFillCaretDown
                            size={30}
                            color='white'
                            className='cursor-pointer'
                            onClick={() => setMoreInfo(!moreInfo)}
                        />
                    )}
                </div>
            </div>

            {moreInfo && (
                <div className='flex flex-col lg:flex-row items-center justify-between w-full mt-2 px-2 pb-3'>
                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-col lg:flex-row items-center lg:gap-2'>
                            <p className='font-bold text-white'>Wallet {t('Producer')}:</p>
                            <p 
                                className='max-w-[40ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                onClick={() => handleClickUser('1', data.createdBy)}
                            >
                                {data.createdBy}
                            </p>
                        </div>
                        {type === 'manage' ? (
                            <>
                            <p className='text-white w-full text-center lg:text-start'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                            {status === '1' && (
                                <div className="flex items-center gap-1">
                                    <p className='font-bold text-white'>Wallet {t('Activist')}:</p>
                                    <p 
                                        className='max-w-[40ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                        onClick={() => handleClickUser('2', data.acceptedBy)}
                                    >
                                        {data.acceptedBy}
                                    </p>
                                </div>
                            )}
                            </>
                        ) : (
                            <div className='flex items-center lg:gap-2 flex-col lg:flex-row mt-2 lg:mt-0'>
                                <p className='font-bold text-white'>Wallet {t('Activist')}:</p>
                                <p 
                                    className='max-w-[40ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                    onClick={() => handleClickUser('2', data.acceptedBy)}
                                >
                                    {data.acceptedBy}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                        <div className='flex items-center font-bold'>
                            {status === '1' && (
                                <p className='text-[#ff9900]'>{t('Expires in')} {(Number(data.acceptedAt) + Number(6650)) - Number(blockNumber)} blocks</p>
                            )}
                        
                            {status === '3' && (
                                <p className='text-red-500'>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(6650))} blocks</p>
                            )}
                        </div>
                    </div>
                    
                    {status === '1' || status === '2' && (
                        <p className="text-white flex lg:hidden mt-2">
                            {type === 'manage' ? (
                                `${t('Accepted At: ')}`
                            ) : (
                                `${t('Inspected At: ')}`
                            )}
                            {type === 'manage' ? (
                                `${format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}`
                            ) : (
                                `${format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}`
                            )}
                        </p>
                    )}

                    <div className="flex justify-center lg:justify-end w-40 h-10 mt-3">
                        {type === 'history' && (
                            <>
                            <button
                                onClick={() => {
                                    navigate(`/dashboard/${walletAddress}/result-inspection/${typeUser}/${data.id}`)
                                }}
                                className='font-bold justify-center w-32 text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2 flex lg:hidden'
                            >
                                {t('See Result')}
                            </button>
                            </>
                        )}

                        {type === 'manage' && (
                            <>
                                {/* <div className='flex lg:hidden'>
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
                                </div> */}
                                <div className='lg:hidden flex'>
                                    {status !== '3' ? (
                                        <>
                                            {user === '2' ? (
                                                <button
                                                    onClick={() => {
                                                        if(data.status === '0'){
                                                            handleAccept()
                                                        }
                                                        if(data.status === '1'){
                                                            handleRealize()
                                                        }
                                                    }}
                                                    className='font-bold w-36 h-10 text-[#062C01] text-sm bg-[#ff9900] rounded-md'
                                                >
                                                    {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                                    {data.status === '1' && t('Realize Inspection')}
                                                </button>
                                            ) : (
                                                <div className='w-36'/>
                                            )}
                                        </>
                                    ) : (
                                        <div className='w-36'/>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
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
                            action='accept-inspection'
                        />
                </Dialog.Root>

                <Dialog.Root
                    open={openModalChooseMethod}
                    onOpenChange={(open) => setOpenModalChooseMethod(open)}
                >
                    <ModalChooseMethod
                        finishInspection={finishNewVersion}
                        finishManual={(data, methodType) => createIsas(data, methodType)}
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

                <ToastContainer
                    position='top-center'
                />
        </div>
    )

    return(
        <div className='flex flex-col border-b-2 bg-[#0a4303] mb-3'>
            <div className="hidden lg:flex flex-col lg:flex-row items-center justify-between w-full py-2 gap-3">
                <div className='flex flex-col'>
                    <div className='flex items-center px-2 gap-5 w-full'>
                        <p className='text-white font-bold'>Inspeção #{data.id}</p>
                        
                    </div>
                    
                    <div className='flex flex-col lg:flex-row items-center px-2 mt-3'>
                        <p className='font-bold text-white mr-1'>Produtor Carteira:</p>
                        <p 
                            className='max-w-[40ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400 cursor-pointer'
                            onClick={() => handleClickUser('1', data.createdBy)}
                        >
                            {data.createdBy}
                        </p>
                    </div>

                    <div className='flex flex-col lg:flex-row items-center h-full bg-[#0A4303] px-2'>
                        {status === '0' ? (
                            <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                        ) : (
                            <>
                            <p className='font-bold text-white mr-1'>Ativista Carteira:</p>
                            <p 
                                className='max-w-[40ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                onClick={() => handleClickUser('2', data.acceptedBy)}
                            >
                                {data.acceptedBy}
                            </p>
                            </>
                        )}
                    </div>
                </div>

                

                <div className='flex flex-col items-center w-[250px]'>
                    {type === 'manage' && (
                            <div className='flex items-center w-32'>
                                {status === '0' && (
                                    <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#F4A022]'>
                                        <p className='text-xs text-[#F4A022] font-bold'>{t('OPEN')}</p>
                                    </div>
                                )}

                                {status === '1' && (
                                    <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#3E9EF5]'>
                                        <p className='text-xs text-[#3E9EF5] font-bold'>{t('ACCEPTED')}</p>
                                    </div>
                                )}

                                {status === '2' && (
                                    <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#2AC230]'>
                                        <p className='text-xs text-[#2AC230] font-bold'>{t('INSPECTED')}</p>
                                    </div>
                                )}

                                {status === '3' && (
                                    <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-red-500'>
                                        <p className='text-xs text-red-500 font-bold'>{t('EXPIRED')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    {type === 'manage' ? (
                        <>
                        <p className='text-white font-bold'>{t('Created At')}:</p>
                        <p className='text-white text-center'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                        </>
                    ) : (
                        <>
                        <p className='text-white font-bold'>{t('Inspected At')}:</p>
                        <p className='text-white text-center'>{format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>

                        {method === 'phoenix' ? (
                            <div className='flex items-center gap-1 border-2 rounded-md px-2 mt-2'>
                                <img
                                    src={require('../assets/token.png')}
                                    className='w-[30px] h-[30px] object-contain'
                                />
                                <p className='font-bold text-white text-sm'>Método Phoenix</p>
                            </div>
                        ) : (
                            <div className='flex items-center gap-1 border-2 rounded-md px-2 mt-2'>
                                <div
                                    className='w-[25px] h-[25px] my-1 rounded-full bg-gray-500'
                                />
                                <p className='font-bold text-white text-sm'>Método Manual</p>
                            </div>
                        )}
                        </>
                    )}

                    {type === 'manage' && (
                        <div className='flex items-center font-bold'>
                            {status === '1' && (
                                <p className='text-[#ff9900]'>{t('Expires in')} {(Number(data.acceptedAt) + Number(6650)) - Number(blockNumber)} blocks</p>
                            )}
                        
                            {status === '3' && (
                                <p className='text-red-500'>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(6650))} blocks</p>
                            )}
                        </div>
                    )}
                </div>


                

                {type === 'history' && (
                    <div className='flex flex-col items-center bg-green-950 p-2 rounded-md border-2'>
                        <p className='text-white'>ISA {t('Score')}</p>
                        <p className='text-white font-bold text-lg'>{data.isaScore} pts</p>
                    </div>
                )}

                <div className='flex justify-end pr-2 items-center bg-[#0A4303]'>
                    {type === 'history' && (
                        <>
                        <button
                            onClick={() => {
                                setModalViewResult(true)
                            }}
                            className='font-bold w-32 text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
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
                                {status !== '3' ? (
                                    <>
                                        {user === '2' ? (
                                            <button
                                                onClick={() => {
                                                    if(data.status === '0'){
                                                        handleAccept()
                                                    }
                                                    if(data.status === '1'){
                                                        handleRealize()
                                                    }
                                                }}
                                                className='font-bold w-36 h-10 text-[#062C01] text-sm bg-[#ff9900] rounded-md'
                                            >
                                                {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                                {data.status === '1' && t('Realize Inspection')}
                                            </button>
                                        ) : (
                                            <div className='w-36'/>
                                        )}
                                    </>
                                ) : (
                                    <div className='w-36'/>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <div 
                className='lg:hidden w-full flex items-center justify-between h-10 px-2 cursor-pointer'
                onClick={() => setMoreInfo(!moreInfo)}
            >
                <p className='font-bols text-white'>{t('Inspection')} #{data.id}</p>

                {type === 'manage' && (
                    <div className='flex items-center w-32'>
                        {status === '0' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#F4A022]'>
                                <p className='text-xs text-[#F4A022] font-bold'>{t('OPEN')}</p>
                            </div>
                        )}

                        {status === '1' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#3E9EF5]'>
                                <p className='text-xs text-[#3E9EF5] font-bold'>{t('ACCEPTED')}</p>
                            </div>
                        )}

                        {status === '2' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#2AC230]'>
                                <p className='text-xs text-[#2AC230] font-bold'>{t('INSPECTED')}</p>
                            </div>
                        )}

                        {status === '3' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-red-500'>
                                <p className='text-xs text-red-500 font-bold'>{t('EXPIRED')}</p>
                            </div>
                        )}
                    </div>
                )}

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
            </div>

            {moreInfo && (
                <div className='w-full bg-[#0a4303] flex flex-col p-2 border-b-2 border-green-950'>
                    <p className='font-bold text-white mt-3'>ISA {t('Score')}: {data.isaScore}</p>

                    <p className='font-bold text-white mt-3'>{t('Producer')} {t('Wallet')}:</p>
                    <p 
                        className='max-w-[30ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                        onClick={() => handleClickUser('1', data.createdBy)}
                    >
                        {data.createdBy}
                    </p>
                    <p className='font-bold text-white mt-3'>{t('Address')}:</p>
                    <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>

                    {type === 'manage' ? (
                        <>
                        {status === '1' && (
                            <>
                            <p className='font-bold text-white mt-3'>{t('Accepted By')}:</p>
                            
                            <p 
                                className='max-w-[30ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                onClick={() => handleClickUser('2', data.acceptedBy)}
                            >
                                {data.acceptedBy}
                            </p>
                            </>
                        )}
                        </>
                    ) : (
                        <>
                            <p className='font-bold text-white mt-3'>{t('Inspected By')}:</p>
                            
                            <p 
                                className='max-w-[30ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                                onClick={() => handleClickUser('2', data.acceptedBy)}
                            >
                                {data.acceptedBy}
                            </p>
                        </>
                    )}


                    {type === 'manage' ? (
                        <>
                        <p className='font-bold text-white mt-3'>{t('Created At')}:</p>
                        <p className='text-white'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                        <p className='font-bold text-white mt-3'>{t('Expires In')}:</p>
                        {status === '0' && (
                            <p className='text-white'>{t('Not accepted')}</p>
                        )}
                        {status === '1' && (
                            <p className='text-white'>{t('Expires in')} {(Number(data.acceptedAt) + Number(6650)) - Number(blockNumber)} blocks</p>
                        )}
                        {status === '2' && (
                            <p className='text-white'>{t('Inspected')}</p>
                        )}
                        {status === '3' && (
                            <p className='text-white'>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(6650))} blocks</p>
                        )}

                        </>
                    ) : (
                        <>
                            <p className='font-bold text-white mt-3'>{t('Inspected At')}:</p>
                            <p className='text-white'>{format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                        </>
                    )}
                        <div className='w-full mt-3'>
                            <button
                                onClick={() => {
                                    if(data.status === '0'){
                                        handleAccept()
                                    }
                                    if(data.status === '1'){
                                        handleRealize()
                                    }
                                    if(data.status === '2'){
                                        setModalViewResult(true)
                                    }
                                }}
                                className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
                            >
                                {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                {data.status === '1' && t('Realize Inspection')}
                                {data.status === '2' && t('See Result')}
                            </button>
                        </div>
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
                            action='accept-inspection'
                        />
                </Dialog.Root>

                <Dialog.Root
                    open={openModalChooseMethod}
                    onOpenChange={(open) => setOpenModalChooseMethod(open)}
                >
                    <ModalChooseMethod
                        finishInspection={finishInspection}
                        finishManual={(data, methodType) => createIsas(data, methodType)}
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

                <ToastContainer
                    position='top-center'
                />
        </div>
    )

    return(
        <div className='flex flex-col border-b-2 border-green-950'>
            <div className="flex items-center w-full py-2 gap-3 bg-[#0a4303]">
                <div className='hidden lg:flex items-center h-full w-[70px] px-2'>
                    <p className='text-white'>{data.id}</p>
                </div>
                
                <div className='flex items-center lg:w-[350px] bg-[#0A4303] px-2'>
                    <p 
                        className='max-w-[11ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400 cursor-pointer'
                        onClick={() => handleClickUser('1', data.createdBy)}
                    >
                        {data.createdBy}
                    </p>
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-full bg-[#0A4303]'>
                        <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                    </div>
                )}

                <div className='hidden lg:flex items-center h-full w-[350px] bg-[#0A4303]'>
                    {status === '0' ? (
                        <p className='text-white'>Não aceita</p>
                    ) : (
                        <p 
                            className='max-w-[11ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                            onClick={() => handleClickUser('2', data.acceptedBy)}
                        >
                            {data.acceptedBy}
                        </p>
                    )}
                </div>

                <div className='hidden lg:flex items-center h-full w-[350px] bg-[#0A4303]'>
                    {type === 'manage' ? (
                        <p className='text-white text-center'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                    ) : (
                        <p className='text-white text-center'>{format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                    )}
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-[350px] bg-[#0A4303] text-white'>
                        {status === '0' && (
                            <p>{t('Not accepted')}</p>
                        )}
                        {status === '1' && (
                            <p>{t('Expires in')} {(Number(data.acceptedAt) + Number(6650)) - Number(blockNumber)} blocks</p>
                        )}
                        {status === '2' && (
                            <p>{t('Inspected')}</p>
                        )}
                        {status === '3' && (
                            <p>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(6650))} blocks</p>
                        )}
                    </div>
                )}

                {type === 'manage' && (
                    <div className='flex items-center h-full w-[350px] bg-[#0A4303]'>
                        {status === '0' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#F4A022]'>
                                <p className='text-xs text-[#F4A022] font-bold'>{t('OPEN')}</p>
                            </div>
                        )}

                        {status === '1' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#3E9EF5]'>
                                <p className='text-xs text-[#3E9EF5] font-bold'>{t('ACCEPTED')}</p>
                            </div>
                        )}

                        {status === '2' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#2AC230]'>
                                <p className='text-xs text-[#2AC230] font-bold'>{t('INSPECTED')}</p>
                            </div>
                        )}

                        {status === '3' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg border-2 border-[#C52A15]'>
                                <p className='text-xs text-[#C52A15] font-bold'>{t('EXPIRED')}</p>
                            </div>
                        )}
                    </div>
                )}

                {type === 'history' && (
                    <div className='flex items-center h-full w-[350px] bg-[#0A4303]'>
                        <p className='text-white'>{data.isaScore}</p>
                    </div>
                )}

                <div className='flex justify-end pr-2 items-center h-full w-[350px] bg-[#0A4303]'>
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
                                {status !== '3' && (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {moreInfo && (
                <div className='w-full bg-[#0a4303] flex flex-col p-2 border-b-2 border-green-950'>
                    <p className='font-bold text-white'>{t('Address')}:</p>
                    <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>

                    <p className='font-bold text-white mt-3'>{t('Accepted By')}:</p>
                    {status === '0' ? (
                        <p className='text-white'>Não aceita</p>
                    ) : (
                        <p 
                            className='max-w-[30ch] text-ellipsis overflow-hidden border-b-2 border-blue-400 text-blue-400  cursor-pointer'
                            onClick={() => handleClickUser('2', data.acceptedBy)}
                        >
                            {data.acceptedBy}
                        </p>
                    )}

                    <p className='font-bold text-white mt-3'>{t('Created At')}:</p>
                    <p className='text-white'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>

                    {type === 'manage' && (
                        <>
                        <p className='font-bold text-white mt-3'>{t('Expires In')}:</p>
                        {status === '0' && (
                            <p className='text-white'>{t('Not accepted')}</p>
                        )}
                        {status === '1' && (
                            <p className='text-white'>{t('Expires in')} {(Number(data.acceptedAt) + Number(6650)) - Number(blockNumber)} blocks</p>
                        )}
                        {status === '2' && (
                            <p className='text-white'>{t('Inspected')}</p>
                        )}
                        {status === '3' && (
                            <p className='text-white'>{t('Expired ago')} {Number(blockNumber) - (Number(data.acceptedAt) + Number(6650))} blocks</p>
                        )}

                        <div className='w-full mt-3'>
                            <button
                                onClick={() => {
                                    if(data.status === '0'){
                                        handleAccept()
                                    }
                                    if(data.status === '1'){
                                        handleRealize()
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
                            action='accept-inspection'
                        />
                </Dialog.Root>

                <Dialog.Root
                    open={openModalChooseMethod}
                    onOpenChange={(open) => setOpenModalChooseMethod(open)}
                >
                    <ModalChooseMethod
                        finishInspection={finishInspection}
                        finishManual={(data, methodType) => createIsas(data, methodType)}
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

                <ToastContainer
                    position='top-center'
                />
        </div>
    )
}