import React, {useState, useContext, useEffect} from 'react';
import  './modalActions.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../../LoadingTransaction';
import { useNavigate } from 'react-router-dom';
import {MainContext} from '../../../contexts/main';
import { ToastContainer, toast } from 'react-toastify';
import {get} from '../../../config/infura';
import {format} from 'date-fns';
//services
import {AcceptInspection, RealizeInspection} from '../../../services/manageInspectionsService';
import {GetProducer} from '../../../services/producerService';
import {GetActivist} from '../../../services/activistService';
import {useTranslation} from 'react-i18next';
import {GetCategories} from '../../../services/isaService';
import {api} from '../../../services/api';

export default function ModalActions({close, item, walletAddress, showRealize, reloadInspection, showSeeResult, setLoading, status}){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user, walletConnected} = useContext(MainContext);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [producerData, setProducerData] = useState({});
    const [producerDataApi, setProducerDataApi] = useState({});
    const [proofPhotoProducer, setProofPhotoProducer] = useState('');
    const [activistData, setActivistData] = useState({});
    const [proofPhotoActivist, setProofPhotoActivist] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [acceptedDate, setAcceptedDate] = useState('');
    const [inspectedDate, setInspectedDate] = useState('');

    useEffect(() => {
        getData();
        formatDates();
    }, []);

    function formatDates(){
        setCreatedDate(format(new Date(Number(item.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
        setAcceptedDate(format(new Date(Number(item.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
        setInspectedDate(format(new Date(Number(item.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
    }

    async function getData(){
        const producer = await GetProducer(item?.createdBy);
        setProducerData(producer);
        getBase64(producer?.proofPhoto, 'producer');
        const activist = await GetActivist(item?.acceptedBy);
        setActivistData(activist);
        getBase64(activist?.proofPhoto, 'activist');
        const producerApi = await api.get(`/user/${producer.producerWallet}`)
        setProducerDataApi(producerApi.data.user);
        console.log(producer.producerWallet)
    }

    async function getBase64(path, user){
        const base64 = await get(path);
        if(user === 'producer'){
            setProofPhotoProducer(base64);
        }else{
            setProofPhotoActivist(base64);
        }
    }

    async function acceptInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        AcceptInspection(item.id, walletAddress)
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

    function handleAccept(){
        if(user !== '2'){
            toast.error(`${t('This account is not activist')}!`);
            return;
        }
        if(status === '2'){
            toast.error(`${t('This inspection has been inspected')}!`);
            return;
        }
        if(status === '3'){
            toast.error(`${t('This inspection has been expired')}!`);
            return;
        }
        if(status === '1'){
            toast.error(`${t('This inspection has been accepted')}!`);
            return;
        }
        acceptInspection();
    }

    function handleRealize(){
        finishInspection();
        return;
        if(user !== '2'){
            toast.error(`${t('This account is not activist')}!`);
            return;
        }
        if(status === '3'){
            toast.error(`${t('This inspection has been expired')}!`);
            return;
        }
        if(status === '0'){
            toast.error(`${t('It is necessary to accept the inspection before')}!`);
            return;
        }
        if(status === '1' && String(walletConnected).toUpperCase() !== String(item.acceptedBy).toUpperCase()){
            toast.error(`${t('You cannot carry out this inspection, another activist has already accepted it')}!`);
            return
        }
        if(status === '2'){
            toast.error(`${t('This inspection has been inspected')}!`);
            return;
        }
        showRealize();
    }

    function handleSeeResult(){
        if(item.status !== '2'){
            toast.error(`${t('Inspection Not Realized')}!`);
            return;
        }
        showSeeResult();
    }

    async function registerInspectionAPI(){
        const data = {
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

        const propertyData = JSON.stringify(data);
        
        try{
            await api.post('/inspections',{
                inspectionId: String(item.id),
                createdBy: String(item.createdBy),
                createdAt: String(item.createdAtTimestamp),
                userWallet: String(walletConnected).toUpperCase(),
                propertyData
            })
        }catch(err){
            console.log(err);
        }finally{

        }
    }

    async function finishInspection(){
        let isas = [];
        const response = await api.get(`/inspection/${item.id}`)
        if(response.data.inspection.status === 1){
            alert('Realize a inspeção no app do ativista para smartphone!')
            return;
        }
        const resultIndices = JSON.parse(response.data.inspection.resultIdices);
    
        const carbonResult = calculateCarboon(resultIndices);
        const waterResult = calculateWater(resultIndices);
        const bioResult = calculateBio(resultIndices);
        const soloResult = calculateSolo(resultIndices);

        const carbonIndicator = Number(resultIndices?.carbon).toFixed(0)
        const bioIndicator = Number(resultIndices?.bio).toFixed(0)
        const aguaIndicator = Number(resultIndices?.agua).toFixed(0)
        const soloIndicator = Number(resultIndices?.solo).toFixed(0)

        const carbon = {
            categoryId: 1,
            isaIndex: carbonResult,
            report: 'hash_pdffcdzfcdsacascascxczcx4324324234',
            indicator: carbonIndicator
        }
        isas.push(carbon);

        const bio = {
            categoryId: 2,
            isaIndex: bioResult,
            report: 'hash_pdfdfasd32423423drea vdsadasdeqw4e3',
            indicator: bioIndicator
        }
        isas.push(bio);

        const water = {
            categoryId: 3,
            isaIndex: waterResult,
            report: 'hash_pdfewqeqwdqw4e234235ewrfewf2354234234234',
            indicator: aguaIndicator
        }
        isas.push(water);

        const solo = {
            categoryId: 4,
            isaIndex: soloResult,
            report: 'hash_pdfewqer32resarfwer23432423423',
            indicator: soloIndicator
        }
        isas.push(solo);

        finishInspectionBlockchain(isas)
    }

    async function finishInspectionBlockchain(isas){
        setModalTransaction(true);
        setLoadingTransaction(true);
        RealizeInspection(item.id, isas, walletAddress)
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
        let result = 2;
        return result;
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

    }

    return(
        <Dialog.Portal className='modal-actions__portal'>
            <Dialog.Overlay className='modal-actions__overlay'/>
            <Dialog.Content className='modal-actions__content'>
                <Dialog.Title className='modal-actions__title'>
                    {t('Inspection options')}
                </Dialog.Title>
                    <>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p className='modal-actions__label'>{t('Producer')}</p>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                <div className='modal-action__area-photo'>
                                    <img
                                        src={`data:image/png;base64,${proofPhotoProducer}`}
                                        style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover'}}
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <p style={{margin: 0, fontWeight: 'bold', fontSize: 16}}>{producerData?.name}</p>
                                    <p style={{margin: 0, fontSize: 16}}>
                                        {producerData?.propertyAddress?.street}, {producerData?.propertyAddress?.city} - {producerData?.propertyAddress?.state}
                                    </p>
                                    <a 
                                        onClick={() => navigate(`/dashboard/${walletConnected}/producer-page/${item.createdBy}`)}
                                        style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                                    >
                                        <p style={{margin: 0}} title={item.createdBy}>{item.createdBy}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {Number(item.status) > 0 && (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <p className='modal-actions__label'>{t('Activist')}</p>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                    <div className='modal-action__area-photo'>
                                        <img
                                            src={`data:image/png;base64,${proofPhotoActivist}`}
                                            style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover'}}
                                        />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <p style={{margin: 0, fontWeight: 'bold', fontSize: 16}}>{activistData?.name}</p>
                                        <p style={{margin: 0, fontSize: 16}}>
                                            {activistData?.activistAddress?.city} - {activistData?.activistAddress?.state}
                                        </p>
                                        <a 
                                            onClick={() => navigate(`/dashboard/${walletConnected}/activist-page/${item.acceptedBy}`)}
                                            style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                                        >
                                            <p style={{margin: 0}} title={item.acceptedBy}>{item.acceptedBy}</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                        <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                            <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>{t('Created At')}:</p> 
                            {createdDate}
                        </p>
                        {Number(item.status) > 0 && (
                            <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                                <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>{t('Accepted At')}:</p> 
                                {acceptedDate}
                            </p>
                        )}
                        {Number(item.status) > 1 && (
                            <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                                <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>{t('Inspected At')}:</p> 
                                {inspectedDate}
                            </p>
                        )}
                    </div>
                    </>
                
                    <div className='modal-actions__area-btn'>            
                        <button 
                            onClick={handleAccept}
                        >
                            {t('Accept')}
                        </button>
                        

                        
                        <button 
                            onClick={handleRealize}
                        >
                            {t('Realize')}
                        </button>
                        
                
                        <button 
                            onClick={handleSeeResult}
                        >
                            {t('See Result')}
                        </button>
                    </div>

                    <Dialog.Root 
                        open={modalTransaction} 
                        onOpenChange={(open) => {
                            if(!loadingTransaction){
                                setModalTransaction(open);
                                reloadInspection();
                                close();
                            }
                        }}
                    >
                        <LoadingTransaction
                            loading={loadingTransaction}
                            logTransaction={logTransaction}
                        />
                    </Dialog.Root>
            </Dialog.Content>
            <ToastContainer position='top-center'/>
        </Dialog.Portal>
    )
}